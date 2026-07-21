import Image from "next/image";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="page-intro">
          <p className="eyebrow">About Me</p>
          <h1>Helping businesses build modern web experiences.</h1>
          <p>
            I'm a passionate freelance web developer dedicated to creating
            responsive, scalable, and user-friendly websites and applications
            tailored to each client's needs.
          </p>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-[2.5rem] bg-neutral-100 lg:grid-cols-2">
          <div className="relative min-h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80"
              alt="Freelance Web Developer"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-14">
            <p className="eyebrow">What I Do</p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.05em]">
              Building digital solutions that make an impact.
            </h2>

            <p className="mt-6 leading-8 text-neutral-600">
              I specialize in developing modern websites and web applications
              using technologies like React, Next.js, Tailwind CSS, Node.js, and
              Laravel. My goal is to create fast, secure, and responsive
              solutions that help businesses grow online.
            </p>

            <p className="mt-5 leading-8 text-neutral-600">
              From landing pages, e-commerce, and shopify platforms to custom
              business systems, I work closely with clients to turn ideas into
              reliable, high-quality digital products while maintaining clear
              communication throughout every project.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-y border-black/10 py-12 sm:grid-cols-3">
          {[
            ["3+", "Years of Experience"],
            ["50+", "Projects Completed"],
            ["100%", "Client Satisfaction"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-5xl font-black tracking-[-0.06em]">{value}</p>
              <p className="mt-3 text-sm text-neutral-500">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
