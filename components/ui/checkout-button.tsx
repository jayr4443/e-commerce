"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

type CheckoutButtonProps = {
  productId: number;
  colorId?: number;
  colorName?: string;
};

export default function CheckoutButton({
  productId,
  colorId,
  colorName,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: 1,
          colorId,
        }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout failed.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Checkout failed.");

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-black px-7 py-4 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? (
          <>
            <LoaderCircle className="animate-spin" size={18} />
            Opening checkout...
          </>
        ) : (
          <>
            Buy now
            <ArrowRight
              className="transition-transform group-hover:translate-x-1"
              size={18}
            />
          </>
        )}
      </button>

      {colorName && (
        <p className="mt-3 text-sm text-neutral-500">
          Selected color:{" "}
          <span className="font-semibold text-neutral-950">{colorName}</span>
        </p>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
