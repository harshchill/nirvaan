"use client";
import { useMemo, useState } from "react";

const QUESTIONS = [
  {
    id: "q1",
    text: "Over the last 2 weeks, how often have you had little interest or pleasure in doing things?",
  },
  {
    id: "q2",
    text: "Over the last 2 weeks, how often have you felt down, depressed, or hopeless?",
  },
  {
    id: "q3",
    text: "Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
  },
  {
    id: "q4",
    text: "Over the last 2 weeks, how often have you felt tired or had little energy?",
  },
  {
    id: "q5",
    text: "Over the last 2 weeks, how often have you had poor appetite or overeating?",
  },
  {
    id: "q6",
    text: "Over the last 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?",
  },
  {
    id: "q7",
    text: "Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading the newspaper or watching television?",
  },
  {
    id: "q8",
    text: "Over the last 2 weeks, how often have you been moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual?",
  },
  {
    id: "q9",
    text: "Over the last 2 weeks, how often have you had thoughts that you would be better off dead, or of hurting yourself in some way?",
  },
];

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export default function ScreeningPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const isDone = index >= QUESTIONS.length;

  const score = useMemo(() => answers.reduce((a, b) => a + b, 0), [answers]);
  const severity = useMemo(() => {
    if (score <= 2) return "Minimal";
    if (score <= 5) return "Mild";
    if (score <= 9) return "Moderate";
    return "Severe";
  }, [score]);

  function choose(value) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setIndex((i) => i + 1);
  }

  function restart() {
    setAnswers([]);
    setIndex(0);
  }

  return (
    <section className="max-w-2xl mx-auto">
      <header className="space-y-2 mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Screening</h1>
        <p className="text-gray-600">
          A brief, private self-check. This does not diagnose. If you're in
          crisis, use the crisis resources on the Resources page.
        </p>
      </header>

      {!isDone ? (
        <div className="card p-6 space-y-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Question {index + 1} of {QUESTIONS.length}
            </span>
            <div className="h-2 bg-gray-100 rounded-full w-40 overflow-hidden">
              <div
                className="h-full bg-[#e6cdb5]"
                style={{ width: `${(index / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-xl">{QUESTIONS[index]?.text}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className="btn btn-primary ring-focus"
                onClick={() => choose(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Your result</h2>
          <p className="text-gray-700">
            Total score: <strong>{score}</strong> • Severity:{" "}
            <strong>{severity}</strong>
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              Minimal to Mild: Keep using self-care resources and check in
              weekly.
            </li>
            <li>
              Moderate: Consider connecting with campus counseling or a peer
              group.
            </li>
            <li>
              Severe: Please reach out to professional help and crisis
              resources.
            </li>
          </ul>
          <div className="flex gap-3 pt-2">
            <button className="btn btn-ghost" onClick={restart}>
              Restart
            </button>
            <a className="btn btn-primary" href="/resources">
              View resources
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
