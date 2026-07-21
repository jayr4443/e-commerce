import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/utils/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Invalid Stripe signature:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId && session.payment_status === "paid") {
        const { data: existingOrder } = await admin
          .from("orders")
          .select("status")
          .eq("id", orderId)
          .maybeSingle();

        // Only decrement stock the first time this order is marked paid, so
        // retried/duplicate webhook events don't oversell inventory.
        const alreadyPaid = existingOrder?.status === "paid";

        await admin
          .from("orders")
          .update({
            status: "paid",
            customer_email: session.customer_details?.email ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (!alreadyPaid) {
          const { data: items } = await admin
            .from("order_items")
            .select("product_id, color_id, quantity")
            .eq("order_id", orderId);

          for (const item of items ?? []) {
            if (item.color_id) {
              const { data: color } = await admin
                .from("product_colors")
                .select("stock")
                .eq("id", item.color_id)
                .maybeSingle();

              if (color) {
                await admin
                  .from("product_colors")
                  .update({
                    stock: Math.max(0, color.stock - item.quantity),
                  })
                  .eq("id", item.color_id);
              }
            }

            const { data: product } = await admin
              .from("products")
              .select("stock")
              .eq("id", item.product_id)
              .maybeSingle();

            if (product) {
              await admin
                .from("products")
                .update({
                  stock: Math.max(0, product.stock - item.quantity),
                })
                .eq("id", item.product_id);
            }
          }
        }
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await admin
          .from("orders")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .eq("status", "pending");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 },
    );
  }
}
