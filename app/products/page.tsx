import Link from "next/link";

import { ProductCard } from "@/components/store/product-card";
import { getProductCategories, getProducts } from "@/lib/store/products";

type ProductsPageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

export const metadata = {
  title: "Products",
  description: "Explore modern products for everyday momentum.",
};

function categoryUrl(category?: string) {
  if (!category) {
    return "/products";
  }

  return `/products?category=${encodeURIComponent(category)}`;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const rawCategory =
    typeof resolvedSearchParams.category === "string"
      ? resolvedSearchParams.category
      : undefined;

  const selectedCategory = rawCategory?.trim() || "All";

  const [products, categories] = await Promise.all([
    getProducts({
      category: selectedCategory === "All" ? undefined : selectedCategory,
    }),
    getProductCategories(),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <section className="max-w-5xl">
        <p className="eyebrow">The collection</p>

        <h1 className="mt-4 text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-7xl">
          Explore products made for everyday momentum.
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-7 text-neutral-500 sm:text-lg">
          Browse a focused mix of fashion, technology, and lifestyle essentials
          from brands we believe in.
        </p>
      </section>

      <nav
        aria-label="Product categories"
        className="relative z-20 mt-10 flex flex-wrap gap-2"
      >
        <Link
          href="/products"
          className={
            selectedCategory === "All"
              ? "pointer-events-auto relative z-20 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white"
              : "pointer-events-auto relative z-20 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black transition duration-300 hover:border-black hover:bg-black hover:text-white"
          }
        >
          All
        </Link>

        {categories.map((category) => {
          const isActive =
            selectedCategory.toLowerCase() === category.toLowerCase();

          return (
            <Link
              key={category}
              href={categoryUrl(category)}
              className={
                isActive
                  ? "pointer-events-auto relative z-20 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white"
                  : "pointer-events-auto relative z-20 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black transition duration-300 hover:border-black hover:bg-black hover:text-white"
              }
            >
              {category}
            </Link>
          );
        })}
      </nav>

      <section className="mt-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-500">
              {selectedCategory === "All" ? "All products" : selectedCategory}
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">
              {products.length} {products.length === 1 ? "product" : "products"}
            </h2>
          </div>
        </div>

        {products.length > 0 ? (
          <div
            key={selectedCategory}
            className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-black/10 bg-neutral-50 px-6 py-20 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em]">
              No products found
            </h2>

            <p className="mt-3 text-neutral-500">
              No active products were found in the{" "}
              <strong>{selectedCategory}</strong> category.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-sm font-bold text-white"
            >
              View all products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
