"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { SearchOverlay } from "@/components/store/search-overlay";

const links = [
  ["Home", "/"],
  ["Products", "/products"],
  ["Brands", "/brands"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Company home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-black text-sm font-black text-white transition-transform duration-300 group-hover:-rotate-6">
            Logo
          </span>
          <span className="text-xl font-black tracking-[-0.04em]">Company</span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="nav-link text-sm font-medium text-neutral-600 hover:text-black"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchOverlay
            trigger={(openSearch) => (
              <button
                className="icon-button hidden sm:grid"
                aria-label="Search"
                onClick={openSearch}
              >
                <Search size={19} />
              </button>
            )}
          />
          <Link
            href="/products"
            className="icon-button"
            aria-label="Shopping bag"
          >
            <ShoppingBag size={19} />
          </Link>
          <button
            className="icon-button lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-black/5 bg-white transition-all duration-500 lg:hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="mx-auto grid max-w-7xl gap-1 px-5 py-4 sm:px-8">
          <SearchOverlay
            trigger={(openSearch) => (
              <button
                onClick={() => {
                  setOpen(false);
                  openSearch();
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 hover:text-black sm:hidden"
              >
                <Search size={16} /> Search
              </button>
            )}
          />

          {links.map(([label, href], index) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`mobile-link rounded-xl px-4 py-3 text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 hover:text-black ${
                open ? "mobile-link-in" : ""
              }`}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
