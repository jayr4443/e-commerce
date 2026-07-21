import Link from "next/link";
import { ArrowUpRight, Instagram, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="text-3xl font-black tracking-[-0.05em]">
              Company
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400">
              A curated modern store for thoughtful essentials, emerging labels,
              and products designed to improve everyday life.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
              Explore
            </p>
            <div className="mt-5 grid gap-3 text-sm text-neutral-300">
              <Link href="/products">Products</Link>
              <Link href="/brands">Brands</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/about">Our story</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-neutral-500">
              Connect
            </p>
            <div className="mt-5 grid gap-3 text-sm text-neutral-300">
              <Link href="/contact" className="flex items-center gap-2">
                <Mail size={15} /> Contact us
              </Link>
              <a href="#" className="flex items-center gap-2">
                <Instagram size={15} /> Instagram
              </a>
              <Link href="/products" className="flex items-center gap-2">
                Shop now <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-8 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Company Store. All rights reserved.</p>
          <p>Joshua G. Rolloque.</p>
        </div>
      </div>
    </footer>
  );
}
