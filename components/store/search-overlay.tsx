"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Loader2, Search, TriangleAlert, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { ProductSearchResult } from "@/lib/store/products";

type SearchOverlayProps = {
  trigger: (open: () => void) => ReactNode;
  enableShortcut?: boolean;
};

export function SearchOverlay({
  trigger,
  enableShortcut = true,
}: SearchOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  useEffect(() => {
    setMounted(true);

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const close = useCallback(() => {
    requestId.current += 1;

    setOpen(false);
    setQuery("");
    setResults([]);
    setLoading(false);
    setError("");
    setHasSearched(false);
  }, []);

  const openOverlay = useCallback(() => {
    setOpen(true);
  }, []);

  // Only one SearchOverlay instance should handle the keyboard shortcut.
  useEffect(() => {
    if (!enableShortcut) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isSearchShortcut) {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        close();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, enableShortcut]);

  // Focus input and safely lock page scrolling.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      window.clearTimeout(focusTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Debounced product search.
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      requestId.current += 1;
      setResults([]);
      setLoading(false);
      setError("");
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError("");

    const currentRequest = ++requestId.current;
    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        const data = (await response.json()) as {
          results?: ProductSearchResult[];
        };

        if (currentRequest === requestId.current) {
          setResults(data.results ?? []);
          setHasSearched(true);
        }
      } catch (searchError) {
        if (
          searchError instanceof DOMException &&
          searchError.name === "AbortError"
        ) {
          return;
        }

        if (currentRequest === requestId.current) {
          setResults([]);
          setError("Something went wrong. Please try again.");
          setHasSearched(true);
        }
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const overlay =
    mounted &&
    createPortal(
      <div
        className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close search"
          onClick={close}
          className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          tabIndex={open ? 0 : -1}
        />

        <div className="relative flex min-h-[100dvh] items-start justify-center px-3 pt-4 sm:px-5 sm:pt-20">
          <div
            className={`flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl origin-top flex-col overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-h-[80dvh] sm:rounded-3xl ${
              open
                ? "translate-y-0 scale-100 opacity-100"
                : "-translate-y-3 scale-[0.98] opacity-0"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center gap-3 border-b border-black/10 px-4 py-3 sm:px-5 sm:py-4">
              <Search size={19} className="shrink-0 text-neutral-400" />

              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                placeholder="Search products, categories..."
                className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-neutral-400"
                aria-label="Search products"
                disabled={!open}
              />

              {loading && (
                <Loader2
                  size={17}
                  className="shrink-0 animate-spin text-neutral-400"
                />
              )}

              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition hover:bg-neutral-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              {error ? (
                <div className="flex items-center gap-3 px-4 py-8 text-sm text-red-600">
                  <TriangleAlert size={16} />
                  {error}
                </div>
              ) : hasSearched && !loading && results.length === 0 ? (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold">
                    No products match &ldquo;{query}&rdquo;
                  </p>

                  <p className="mt-1 text-sm text-neutral-500">
                    Try another keyword or browse all products.
                  </p>
                </div>
              ) : results.length > 0 ? (
                <ul className="grid gap-1">
                  {results.map((product, index) => (
                    <li
                      key={product.id}
                      className="search-result-row"
                      style={{
                        animationDelay: `${index * 45}ms`,
                      }}
                    >
                      <Link
                        href={`/products/${product.id}`}
                        onClick={close}
                        className="flex items-center gap-3 rounded-2xl p-3 transition-colors duration-200 hover:bg-neutral-100 sm:gap-4"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-neutral-100" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">
                            {product.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs font-medium uppercase tracking-wide text-neutral-400">
                            {product.category || "Essential"}
                          </p>

                          <p className="mt-1 text-sm font-bold sm:hidden">
                            ₱
                            {(product.price / 100).toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <p className="hidden shrink-0 whitespace-nowrap text-sm font-bold sm:block">
                          ₱
                          {(product.price / 100).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-10 text-center text-sm text-neutral-400">
                  Start typing to search the collection.
                </div>
              )}
            </div>

            <div className="hidden shrink-0 items-center justify-between border-t border-black/10 px-5 py-3 text-xs text-neutral-400 sm:flex">
              <span>Press Esc to close</span>
              <span>⌘K or Ctrl+K to search</span>
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      {trigger(openOverlay)}
      {overlay}
    </>
  );
}
