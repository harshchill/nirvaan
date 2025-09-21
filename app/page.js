import Link from "next/link";
import Image from "next/image";
import HomeAuthedRedirect from "./Components/HomeAuthedRedirect";

export default function Home() {
  return (
    <div className="space-y-20">
      <HomeAuthedRedirect />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container-max grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm text-gray-700 border border-gray-200">
              Built with universities • Private & student-first
            </span>
            <h1 className="title-accent text-4xl md:text-6xl font-semibold tracking-tight">
              Your modern companion for student wellbeing
            </h1>
            <p className="text-lg text-gray-600 max-w-prose">
              Discover resources, take quick screenings, and connect with counsellors. Designed to be calm, credible, and easy to use.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/screening" className="btn btn-primary ring-focus">
                Start screening
              </Link>
              <Link href="/resources" className="btn btn-ghost">
                Explore resources
              </Link>
            </div>
            <div className="divider-soft" />
            <div className="flex gap-6 text-sm text-gray-600">
              <div>
                <div className="font-semibold text-gray-800">Evidence‑informed</div>
                Curated by specialists
              </div>
              <div className="hidden sm:block h-12 w-px bg-gray-200" />
              <div>
                <div className="font-semibold text-gray-800">Privacy‑first</div>
                You control your data
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="card p-6 subtle-grid">
              <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-white to-[#fff5ec] grid place-items-center">
                <Image
                  src="/Hero.png"
                  width={800}
                  height={600}
                  priority
                  alt="Nirvaan hero illustration"
                  className="rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container-max">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold">What you can do with Nirvaan</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Guided screenings",
              desc: "Private, clinically‑aligned self‑checks with instant guidance.",
              href: "/screening",
            },
            {
              title: "Book counsellors",
              desc: "Find a suitable counsellor and reserve a time that works.",
              href: "/counsellor",
            },
            {
              title: "Explore resources",
              desc: "Curated articles, tools, and campus programs in one place.",
              href: "/resources",
            },
          ].map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="card hover-card p-6 border border-gray-200"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="text-gray-600">{card.desc}</p>
                <div className="divider-soft mt-4" />
                <span className="text-sm font-medium text-gray-800">Learn more</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container-max">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-2xl md:text-3xl font-semibold title-accent">How it works</h2>
            <p className="mt-6 text-gray-600 max-w-prose">
              Simple steps to help you get the right support at the right time. No friction, no pressure.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ol className="relative border-s border-gray-200 pl-6 space-y-8">
              <li>
                <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#e6cdb5]" />
                <h4 className="font-semibold text-gray-800">Start with a quick check‑in</h4>
                <p className="text-gray-600">Answer a few questions to understand your current state and options.</p>
              </li>
              <li>
                <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#b6d2c8]" />
                <h4 className="font-semibold text-gray-800">Explore tailored resources</h4>
                <p className="text-gray-600">Get suggestions from campus and credible sources that match your needs.</p>
              </li>
              <li>
                <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-[#d9b491]" />
                <h4 className="font-semibold text-gray-800">Connect with a counsellor</h4>
                <p className="text-gray-600">When you’re ready, easily book with a professional right from your dashboard.</p>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Resources Preview */}
      <section className="container-max">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Curated resources</h2>
            <p className="text-gray-600 mt-2">Credible guides and tools for everyday wellbeing.</p>
          </div>
          <Link href="/resources" className="btn btn-ghost">See all</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Managing academic pressure",
              desc: "Evidence‑based techniques to reduce overwhelm during exams.",
            },
            {
              title: "Sleep hygiene essentials",
              desc: "Build a consistent routine and improve rest quality.",
            },
            {
              title: "Finding peer support",
              desc: "Ways to connect meaningfully with your campus community.",
            },
          ].map((card) => (
            <div key={card.title} className="card hover-card p-6 border border-gray-200">
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-gray-600 mt-2">{card.desc}</p>
              <div className="divider-soft mt-4" />
              <Link href="/resources" className="text-sm font-medium text-gray-800">Read the guide</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Callouts */}
      <section className="container-max grid lg:grid-cols-2 gap-6">
        <div className="card p-6 border border-gray-200">
          <h3 className="text-xl font-semibold">Private screenings</h3>
          <p className="text-gray-600 mt-2">Quick self‑checks aligned with common clinical frameworks.</p>
          <div className="divider-soft mt-4" />
          <Link href="/screening" className="btn btn-primary mt-4 w-fit">Start screening</Link>
        </div>
        <div className="card p-6 border border-gray-200">
          <h3 className="text-xl font-semibold">Book a counsellor</h3>
          <p className="text-gray-600 mt-2">Browse counsellors by focus area and availability.</p>
          <div className="divider-soft mt-4" />
          <Link href="/counsellor" className="btn btn-ghost mt-4 w-fit">Browse counsellors</Link>
        </div>
      </section>

      {/* Partners and Testimonials */}
      <section className="container-max space-y-10">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold">Trusted by student communities</h2>
          <div className="divider-soft" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote: "Nirvaan’s experience is refreshingly calm and focused. Students actually use it.",
              name: "Student Affairs Lead",
            },
            {
              quote: "Clear guidance after screenings helps us direct support efficiently.",
              name: "Counselling Center Director",
            },
            {
              quote: "The interface makes tough topics approachable without being overwhelming.",
              name: "Peer Mentor",
            },
          ].map((t, i) => (
            <div key={i} className="card p-6 border border-gray-200">
              <p className="text-gray-800">{t.quote}</p>
              <div className="mt-4 text-sm text-gray-600">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-max">
        <div className="card p-8 md:p-12 border border-gray-200 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold title-accent">Ready to begin?</h2>
            <p className="text-gray-600 mt-4 max-w-prose">Start with a private screening or explore resources tailored to your needs. You can always connect with a counsellor when you’re ready.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/screening" className="btn btn-primary">Start screening</Link>
              <Link href="/resources" className="btn btn-ghost">Explore resources</Link>
            </div>
          </div>
          <div className="subtle-grid rounded-xl h-64 md:h-72 bg-white" />
        </div>
      </section>
    </div>
  );
}
