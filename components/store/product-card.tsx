import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { StoreProduct } from "@/lib/store/products";

type ProductCardProps = {
  product: StoreProduct;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <article
      className="product-card reveal-card group"
      style={{
        animationDelay: `${index * 90}ms`,
      }}
    >
      <Link
        href={`/products/${product.id}`}
        className="block focus:outline-none"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-neutral-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="product-card-image object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
          )}

          <div className="product-card-overlay pointer-events-none absolute inset-0" />

          <div className="absolute inset-x-4 bottom-4 flex translate-y-3 items-center justify-between rounded-2xl bg-white/90 px-4 py-3 opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <span className="text-sm font-semibold">Explore product</span>

            <ArrowUpRight size={17} />
          </div>
        </div>

        <div className="px-1 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">
                {product.category || "Essential"}
              </p>

              <h3 className="mt-2 text-lg font-bold tracking-tight">
                {product.name}
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
            </div>

            <p className="whitespace-nowrap text-sm font-bold">
              ₱
              {(product.price / 100).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
