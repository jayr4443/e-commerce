"use client";

import { Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import CheckoutButton from "@/components/ui/checkout-button";
import { ZoomableImage } from "@/components/store/zoomable-image";
import type { StoreProduct } from "@/lib/store/products";

type ProductOptionsProps = {
  product: StoreProduct;
};

export function ProductOptions({ product }: ProductOptionsProps) {
  const colors = useMemo(
    () => product.product_colors ?? [],
    [product.product_colors],
  );

  const initialColor =
    colors.find((color) => color.stock > 0) ?? colors[0] ?? null;

  const [selectedColorId, setSelectedColorId] = useState<number | null>(
    initialColor?.id ?? null,
  );

  const selectedColor = useMemo(() => {
    return colors.find((color) => color.id === selectedColorId) ?? initialColor;
  }, [colors, initialColor, selectedColorId]);

  const displayedImage = selectedColor?.image_url || product.image_url;

  const availableStock = selectedColor?.stock ?? product.stock;

  // The very first render should use the slower, more dramatic "page load"
  // reveal. Every image change after that (from clicking a color swatch)
  // should use a quick, snappy crossfade instead.
  const hasMounted = useRef(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setIsInitialLoad(false);
  }, [displayedImage]);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:items-center lg:gap-20">
      <div className="relative mx-auto aspect-square w-full max-w-[460px] overflow-hidden rounded-[2rem] bg-neutral-50">
        {displayedImage ? (
          <div
            key={displayedImage}
            className={
              isInitialLoad ? "product-image-enter" : "color-swap-enter"
            }
            style={{ height: "100%", width: "100%" }}
          >
            <ZoomableImage
              src={displayedImage}
              alt={
                selectedColor
                  ? `${product.name} — ${selectedColor.name}`
                  : product.name
              }
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
        )}

        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur">
          {product.category || "Essential"}
        </span>
      </div>

      <section className="flex flex-col justify-center lg:py-8">
        <p className="eyebrow">Company collection</p>

        <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl">
          {product.name}
        </h1>

        <p className="mt-6 text-3xl font-black">
          ₱
          {(product.price / 100).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <p className="mt-7 max-w-xl text-base leading-8 text-neutral-500">
          {product.description ||
            "A thoughtfully selected everyday essential from the Company collection."}
        </p>

        {colors.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold">Color</p>

              <p className="text-sm text-neutral-500">
                {selectedColor?.name ?? "No color selected"}
              </p>
            </div>

            {colors.length > 0 ? (
              <div
                className="mt-4 flex flex-wrap gap-3"
                role="radiogroup"
                aria-label="Choose product color"
              >
                {colors.map((color) => {
                  const isSelected = selectedColor?.id === color.id;

                  return (
                    <button
                      key={color.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Select ${color.name}`}
                      title={`${color.name} — ${color.stock} in stock`}
                      disabled={color.stock <= 0}
                      onClick={() => setSelectedColorId(color.id)}
                      className={`group relative flex items-center gap-3 rounded-full border px-3 py-2 transition-all duration-300 ${
                        isSelected
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-black/10 bg-white text-black hover:-translate-y-0.5 hover:border-black"
                      } disabled:cursor-not-allowed disabled:opacity-30`}
                    >
                      <span
                        className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-black/15 shadow-inner transition-transform duration-300 group-hover:scale-105"
                        style={{
                          backgroundColor: color.hex_code,
                        }}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            className={
                              isDarkColor(color.hex_code)
                                ? "text-white"
                                : "text-black"
                            }
                          />
                        )}
                      </span>

                      <span className="pr-2 text-sm font-semibold">
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                No color variants were loaded for product {product.id}.
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <Check size={17} />

          {availableStock > 0
            ? `${availableStock} pieces in stock`
            : "Currently unavailable"}
        </div>

        {availableStock > 0 && (
          <div className="mt-8">
            <CheckoutButton
              productId={product.id}
              colorId={selectedColor?.id}
              colorName={selectedColor?.name}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function isDarkColor(hexCode: string) {
  const hex = hexCode.replace("#", "");

  if (hex.length !== 6) {
    return false;
  }

  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness < 140;
}
