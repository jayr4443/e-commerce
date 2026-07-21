import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getBrands } from "@/lib/store/brands";

export const metadata = {
  title: "Brands",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="page-intro">
        <p className="eyebrow">Brand directory</p>

        <h1>Independent names. Distinct points of view.</h1>

        <p>
          We partner with makers who care about material, process, usefulness,
          and the details that make products worth keeping.
        </p>
      </div>

      {brands.length > 0 ? (
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, index) => (
            <article
              key={brand.id}
              className="group rounded-[2rem] border border-black/5 bg-neutral-50 p-8 transition duration-500 hover:-translate-y-1 hover:bg-black hover:text-white"
            >
              <p className="text-xs font-bold tracking-[0.2em] text-neutral-400">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-12 text-3xl font-black tracking-[0.12em]">
                {brand.name}
              </h2>

              <p className="mt-4 min-h-12 text-sm leading-6 text-neutral-500 transition group-hover:text-white/60">
                {brand.description ?? "Explore this brand's latest collection."}
              </p>

              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                className="mt-8 flex items-center gap-2 text-sm font-bold"
              >
                View collection
                <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-14 rounded-[2rem] border border-black/5 bg-neutral-50 p-12 text-center">
          <h2 className="text-2xl font-black">No brands available</h2>

          <p className="mt-3 text-sm text-neutral-500">
            Add brands to your Supabase brands table.
          </p>
        </div>
      )}
    </main>
  );
}
