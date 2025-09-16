import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <span className="inline-block rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm text-gray-700 border border-gray-200">
            Warm care for every student
          </span>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Find calm, clarity, and support.
          </h1>
          <p className="text-lg text-gray-600 max-w-prose">
            Nirvaan is your guided mental wellbeing companion—created with
            universities—to help you explore resources, take screenings, and
            connect with support.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/screening" className="btn btn-primary ring-focus">
              Start screening
            </Link>
            <Link href="/resources" className="btn btn-ghost">
              Explore resources
            </Link>
          </div>
        </div>
        <div className="card p-6">
          <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-white to-[#fff5ec] grid place-items-center">
            <Image
              src="/Hero.png"
              width={500}
              height={500}
              alt="Picture of the author"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "University partners",
            desc: "See who’s using Nirvaan.",
            href: "/universities",
          },
          {
            title: "Resources",
            desc: "Curated, credible student help.",
            href: "/resources",
          },
          {
            title: "Screening",
            desc: "Private, quick self-checks.",
            href: "/screening",
          },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="card p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <p className="text-gray-600 mt-2">{card.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
