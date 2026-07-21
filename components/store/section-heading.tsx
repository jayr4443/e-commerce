import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({ eyebrow, title, body, href, linkLabel = "View all" }: { eyebrow: string; title: string; body?: string; href?: string; linkLabel?: string }) {
  return <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.045em] sm:text-5xl">{title}</h2>{body && <p className="mt-4 max-w-2xl leading-7 text-neutral-500">{body}</p>}</div>
    {href && <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold">{linkLabel}<ArrowUpRight size={16}/></Link>}
  </div>;
}
