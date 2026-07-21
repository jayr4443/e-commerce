import { NextResponse } from "next/server";
import Stripe from "stripe";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY.");
}

const stripe = new Stripe(stripeSecretKey);

type CheckoutBody = {
  productId?: number;
  quantity?: number;
  colorId?: number;
};

type SelectedColor = {
  id: number;
  name: string;
  image_url: string | null;
  stock: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;

    const productId = Number(body.productId);
    const colorId = body.colorId !== undefined ? Number(body.colorId) : null;

    const quantity = Math.max(1, Math.min(Number(body.quantity) || 1, 10));

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: "Invalid product." }, { status: 400 });
    }

    if (colorId !== null && (!Number.isInteger(colorId) || colorId <= 0)) {
      return NextResponse.json(
        { error: "Invalid product color." },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Please sign in before checking out." },
        { status: 401 },
      );
    }

    const admin = createAdminClient();

    const { data: product, error: productError } = await admin
      .from("products")
      .select("id, name, price, stock, image_url")
      .eq("id", productId)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "The product is unavailable." },
        { status: 400 },
      );
    }

    let selectedColor: SelectedColor | null = null;

    if (colorId !== null) {
      const { data: color, error: colorError } = await admin
        .from("product_colors")
        .select("id, name, image_url, stock")
        .eq("id", colorId)
        .eq("product_id", productId)
        .single();

      if (colorError || !color || color.stock < quantity) {
        return NextResponse.json(
          { error: "The selected color is unavailable." },
          { status: 400 },
        );
      }

      selectedColor = color;
    } else if (product.stock < quantity) {
      return NextResponse.json(
        { error: "The product is unavailable." },
        { status: 400 },
      );
    }

    const totalAmount = product.price * quantity;

    const displayName = selectedColor
      ? `${product.name} — ${selectedColor.name}`
      : product.name;

    const displayImage = selectedColor?.image_url ?? product.image_url;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total_amount: totalAmount,
        currency: "php",
        customer_email: user.email ?? null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);

      throw new Error("Could not create the order.");
    }

    const { error: itemError } = await admin.from("order_items").insert({
      order_id: order.id,
      product_id: product.id,
      product_name: displayName,
      quantity,
      unit_price: product.price,
      color_id: selectedColor?.id ?? null,
      color_name: selectedColor?.name ?? null,
    });

    if (itemError) {
      console.error("Order item error:", itemError);

      await admin.from("orders").delete().eq("id", order.id);

      throw new Error("Could not create the order item.");
    }

    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer_email: user.email ?? undefined,

      line_items: [
        {
          quantity,
          price_data: {
            currency: "php",
            unit_amount: product.price,
            product_data: {
              name: displayName,
              images: displayImage ? [displayImage] : undefined,
            },
          },
        },
      ],

      metadata: {
        orderId: String(order.id),
        userId: user.id,
        productId: String(product.id),
        colorId: selectedColor ? String(selectedColor.id) : "",
        colorName: selectedColor?.name ?? "",
      },

      success_url:
        `${origin}/checkout/success` + `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${origin}/products/${product.id}`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL.");
    }

    const { error: updateError } = await admin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Order session update error:", updateError);
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Checkout could not be started.",
      },
      { status: 500 },
    );
  }
}
