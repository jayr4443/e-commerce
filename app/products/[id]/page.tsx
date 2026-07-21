import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, ShieldCheck } from "lucide-react";

import { ProductOptions } from "@/components/store/product-options";
import { getProduct } from "@/lib/store/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
      <Link
        href="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 transition duration-200 hover:-translate-x-0.5 hover:text-black"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>

      <ProductOptions product={product} />

      <div className="mt-14 grid gap-4 border-t border-black/10 pt-8 sm:grid-cols-2 lg:max-w-xl lg:ml-auto">
        <div className="flex gap-3">
          <Package className="mt-0.5" size={19} />
          <div>
            <p className="text-sm font-bold">Careful delivery</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Packed securely and prepared with attention.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5" size={19} />
          <div>
            <p className="text-sm font-bold">Secure payment</p>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Protected checkout powered by Stripe.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
