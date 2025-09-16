import Link from "next/link";

export const metadata = { title: "Resources • Nirvaan" };

const sections = [
  {
    title: "Campus Support",
    items: [
      { label: "Counseling Center", href: "#" },
      { label: "Peer Support Groups", href: "#" },
      { label: "Academic Advising", href: "#" },
    ],
  },
  {
    title: "Self-care & Learning",
    items: [
      { label: "Mindfulness basics", href: "https://mindful.org/meditation/mindfulness-getting-started/" },
      { label: "Sleep hygiene", href: "https://www.sleepfoundation.org/sleep-hygiene" },
      { label: "Coping skills library", href: "https://www.therapistaid.com/worksheets/coping-skills-handout.pdf" },
    ],
  },
  {
    title: "Crisis & Helplines",
    items: [
      { label: "International crisis resources", href: "https://www.iasp.info/resources/Crisis_Centres/" },
      { label: "988 Lifeline (US)", href: "https://988lifeline.org/" },
      { label: "Text support (US/CA/UK/IE)", href: "https://www.crisistextline.org/" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Resources</h1>
        <p className="text-gray-600">Gentle guides, credible links, and support options curated for students.</p>
      </header>
      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((s) => (
          <div key={s.title} className="card p-5">
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <ul className="mt-3 space-y-2">
              {s.items.map((i) => (
                <li key={i.label}>
                  <Link href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} className="text-gray-700 underline underline-offset-4">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}


