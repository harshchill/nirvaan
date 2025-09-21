"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  // Mock progress for frontend-only
  const progress = {
    screeningCompleted: 60, // percent
    resourcesViewed: 3,
    nextAction: "Finish your screening",
  };

  const quote = {
    text: "Small steps, consistently taken, create meaningful change.",
    author: "",
  };

  return (
    <section className="container-max space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">Welcome{session?.user?.name ? ", " + session.user.name.split(" ")[0] : ""}</h1>
          <p className="text-gray-600 mt-2">Here’s a quick snapshot of your wellbeing journey.</p>
        </div>
        <Link href="/resources" className="btn btn-ghost">Explore resources</Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[1fr] gap-6">
        {/* Progress Card */}
        <div className="card p-6 border border-gray-200 md:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold">Your progress</h2>
            <p className="text-gray-600 text-sm mt-1">Screening completion</p>
            <div className="mt-4">
              <div className="h-3 rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full"
                  style={{
                    width: `${progress.screeningCompleted}%`,
                    background: "linear-gradient(90deg, var(--brand), var(--brand-strong))",
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-700">{progress.screeningCompleted}% complete</div>
            </div>
          </div>
          <Link href="/screening" className="btn btn-primary mt-6 w-full">Continue screening</Link>
        </div>

        {/* Actionable Steps */}
        <div className="card p-6 border border-gray-200 md:col-span-2 flex flex-col">
          <h2 className="text-lg font-semibold">Actionable steps</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-[#e6cdb5]" />
              <div>
                <div className="font-medium text-gray-800">{progress.nextAction}</div>
                <div className="text-gray-600">Pick up where you left off to unlock guidance.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-[#b6d2c8]" />
              <div>
                <div className="font-medium text-gray-800">Bookmark a helpful resource</div>
                <div className="text-gray-600">Save tools you find useful for quick access later.</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block w-2 h-2 rounded-full bg-[#d9b491]" />
              <div>
                <div className="font-medium text-gray-800">Schedule a counselling session</div>
                <div className="text-gray-600">Pick a time that works and talk to a professional.</div>
              </div>
            </li>
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/resources" className="btn btn-ghost w-full">Find resources</Link>
            <Link href="/counsellor" className="btn btn-primary w-full">Book session</Link>
          </div>
        </div>

        {/* Resource Glimpse */}
        <div className="card p-6 border border-gray-200 md:col-span-2 subtle-grid bg-white">
          <h2 className="text-lg font-semibold">Resource spotlight</h2>
          <div className="mt-4 space-y-2">
            <h3 className="font-medium text-gray-800">Managing academic pressure</h3>
            <p className="text-sm text-gray-600">Evidence‑based techniques to reduce overwhelm during exams.</p>
          </div>
          <div className="divider-soft my-4" />
          <div className="space-y-2">
            <div className="text-sm text-gray-700">Key takeaways</div>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Break tasks into small, time‑boxed sessions</li>
              <li>Practice brief breathing exercises between blocks</li>
              <li>Plan recovery windows like you plan study windows</li>
            </ul>
          </div>
          <Link href="/resources" className="btn btn-ghost mt-6 w-fit">Read more</Link>
        </div>

        {/* Motivation Quote (spans full on md) */}
        <div className="card p-6 border border-gray-200 md:col-span-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-wide text-gray-500">Motivation</div>
              <p className="text-xl md:text-2xl text-gray-800 mt-2 leading-snug max-w-3xl">
                {quote.text}
              </p>
            </div>
            <div className="min-w-[220px]">
              <div className="text-sm text-gray-600">Resources viewed</div>
              <div className="text-3xl font-semibold text-gray-800 mt-1">{progress.resourcesViewed}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
