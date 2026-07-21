import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-xl p-6 text-center">
      <h1 className="text-3xl font-bold">Thank you!</h1>

      <p className="mt-4 text-gray-600">
        Your payment was submitted. We are confirming your order.
      </p>

      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
      >
        Continue shopping
      </Link>
    </main>
  );
}
