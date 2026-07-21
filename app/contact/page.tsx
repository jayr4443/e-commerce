import { Mail, MapPin, Phone } from "lucide-react";
export const metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl">
            Let’s start a conversation.
          </h1>
          <p className="mt-6 max-w-lg leading-7 text-neutral-500">
            Questions about products, orders, partnerships, or the store? Send a
            message and our team will get back to you.
          </p>
          <div className="mt-10 grid gap-4">
            {[
              [Mail, "jayrrolloque16@gmail.com"],
              [Phone, "+63 930 415 1395"],
              [MapPin, "Metro Manila, Philippines"],
            ].map(([Icon, text]) => (
              <div
                key={String(text)}
                className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-semibold">{String(text)}</span>
              </div>
            ))}
          </div>
        </div>
        <form className="rounded-[2.5rem] border border-black/5 bg-neutral-50 p-6 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="form-field">
              <span>First name</span>
              <input placeholder="Alex" />
            </label>
            <label className="form-field">
              <span>Last name</span>
              <input placeholder="Morgan" />
            </label>
          </div>
          <label className="form-field mt-5">
            <span>Email</span>
            <input type="email" placeholder="alex@example.com" />
          </label>
          <label className="form-field mt-5">
            <span>Subject</span>
            <input placeholder="How can we help?" />
          </label>
          <label className="form-field mt-5">
            <span>Message</span>
            <textarea rows={6} placeholder="Tell us a little more..." />
          </label>
          <button
            type="submit"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            Send message
          </button>
        </form>
      </div>
    </main>
  );
}
