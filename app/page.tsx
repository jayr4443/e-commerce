import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { getProductCategories, getProducts } from "@/lib/store/products";

type StoreBenefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const storeBenefits: StoreBenefit[] = [
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Payments protected with a trusted Stripe checkout flow.",
  },
  {
    icon: PackageCheck,
    title: "Carefully fulfilled",
    description:
      "Every order is prepared with attention from cart to delivery.",
  },
  {
    icon: RefreshCw,
    title: "Easy support",
    description: "Clear, friendly help whenever you need it.",
  },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 6 }),
    getProductCategories(),
  ]);

  return (
    <main>
      <section className="mx-auto max-w-[1500px] px-4 pt-4 sm:px-6">
        <div className="hero-grid relative min-h-[78vh] overflow-hidden rounded-[2rem] bg-neutral-950 text-white sm:rounded-[3rem]">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=90"
            alt="Modern concept store interior"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

          <div className="relative z-10 flex min-h-[78vh] max-w-4xl flex-col justify-end px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
            <div className="hero-enter inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
              <Sparkles size={14} />
              New season, thoughtfully selected
            </div>

            <h1 className="hero-enter mt-7 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.065em] sm:text-7xl lg:text-[6.8rem]">
              Better objects for modern living.
            </h1>

            <p className="hero-enter mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
              Discover elevated essentials from independent brands, designed for
              work, movement, rest, and everything between.
            </p>

            <div className="hero-enter mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="button-light">
                Explore products
                <ArrowRight size={18} />
              </Link>

              <Link href="/about" className="button-ghost-light">
                Our story
                <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 hidden rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl lg:block">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Current edit
            </p>
            <p className="mt-2 text-lg font-bold">
              City Essentials / {products.length}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <SectionHeading
          eyebrow="Curated for you"
          title="Products with purpose, personality, and staying power."
          body="A considered selection of everyday pieces that balance function, form, and lasting quality."
          href="/products"
          linkLabel="Explore all products"
        />

        {products.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-black/10 bg-neutral-50 px-6 py-16 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em]">
              No products available
            </h2>
            <p className="mt-3 text-neutral-500">
              Add active products in Supabase to display them here.
            </p>
          </div>
        )}
      </section>

      <section className="border-y border-black/5 bg-neutral-50 py-12">
        <div className="brand-marquee mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-7 px-5 sm:justify-between sm:px-8">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="text-lg font-black uppercase tracking-[0.16em] text-neutral-400 transition duration-300 hover:-translate-y-1 hover:text-black"
              >
                {category}
              </Link>
            ))
          ) : (
            <span className="text-sm font-medium text-neutral-500">
              Product categories will appear here.
            </span>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
        <Link
          href="/gallery"
          className="editorial-card group relative min-h-[560px] overflow-hidden rounded-[2.2rem]"
        >
          <Image
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85"
            alt="Fashion collection"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition duration-1000 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
            <p className="eyebrow text-white/60">Visual journal</p>

            <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
              Objects in their element.
            </h2>

            <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
              Open gallery
              <ArrowUpRight size={16} />
            </p>
          </div>
        </Link>

        <div className="grid gap-5">
          <Link
            href="/products"
            className="editorial-card group relative min-h-[270px] overflow-hidden rounded-[2.2rem] bg-[#dde7e1] p-8 sm:p-10"
          >
            <div className="relative z-10 max-w-sm">
              <p className="eyebrow">Category directory</p>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
                Explore the collections in our current edit.
              </h2>

              <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
                Browse products
                <ArrowUpRight size={16} />
              </p>
            </div>

            <div className="absolute -bottom-20 -right-14 h-64 w-64 rounded-full bg-white/60 transition duration-700 group-hover:scale-125" />
          </Link>

          <Link
            href="/about"
            className="editorial-card group relative min-h-[270px] overflow-hidden rounded-[2.2rem] bg-[#e8e0d6] p-8 sm:p-10"
          >
            <div className="relative z-10 max-w-sm">
              <p className="eyebrow">Our philosophy</p>

              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
                Buy less. Choose better. Keep longer.
              </h2>

              <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
                Read our story
                <ArrowUpRight size={16} />
              </p>
            </div>

            <div className="absolute -right-12 top-1/2 h-40 w-40 -translate-y-1/2 rotate-12 rounded-[2rem] border-[24px] border-white/50 transition duration-700 group-hover:rotate-45" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-neutral-950 text-white lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-16">
            <p className="eyebrow text-white/50">The Company promise</p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              A smoother way to discover and shop.
            </h2>

            <div className="mt-10 grid gap-7">
              {storeBenefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/55">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&q=85"
              alt="Curated shopping experience"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
