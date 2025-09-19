"use client";
import React from "react";

function StepIndicator({ total, current }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`h-2 rounded-full transition-all ${
            idx <= current ? "bg-[#90b098] w-8" : "bg-gray-200 w-4"
          }`}
        />
      ))}
    </div>
  );
}

export default function CounsellorForm({ institutes }) {
  const [step, setStep] = React.useState(0);
  const totalSteps = 9;
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const [form, setForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    instituteId: "",
    proofTitle: "",
    proofNumber: "",
    proofUrls: [""],
    documents: [{ label: "", url: "" }],
  });

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function canProceed() {
    if (step === 0) return form.fullName.trim().length > 1;
    if (step === 1) return /.+@.+\..+/.test(form.email);
    if (step === 2) return form.phone.trim().length >= 7;
    if (step === 3) return !!form.instituteId;
    if (step === 4) return form.proofTitle.trim().length > 1;
    if (step === 5) return form.proofNumber.trim().length > 1;
    if (step === 6) return form.proofUrls.every((u) => u.trim().length > 0);
    if (step === 7) return form.documents.every((d) => !d.label || !!d.url);
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/counsellors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess("Submitted for review. We'll verify and get back to you.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Register as Counsellor</h1>
        <p className="text-gray-600">A short, one-step-at-a-time form to get you verified.</p>
        <StepIndicator total={totalSteps} current={step} />
      </header>

      <div className="card p-6 md:p-8 space-y-6">
        {step === 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Full name</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="Your full legal name"
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Phone</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="Contact number"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Your Institute</label>
            <select
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              value={form.instituteId}
              onChange={(e) => updateField("instituteId", e.target.value)}
            >
              <option value="">Select an institute</option>
              {institutes.map((i) => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Proof title</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="e.g., Govt. License, Certification"
              value={form.proofTitle}
              onChange={(e) => updateField("proofTitle", e.target.value)}
            />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Proof number</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="License/Certificate number"
              value={form.proofNumber}
              onChange={(e) => updateField("proofNumber", e.target.value)}
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Proof links</label>
            {form.proofUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => {
                    const next = [...form.proofUrls];
                    next[idx] = e.target.value;
                    updateField("proofUrls", next);
                  }}
                />
                <button
                  type="button"
                  className="btn bg-gray-100"
                  onClick={() => updateField("proofUrls", form.proofUrls.filter((_, i) => i !== idx))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn bg-[#90b098] text-white hover:brightness-95"
              onClick={() => updateField("proofUrls", [...form.proofUrls, ""])}
            >
              Add another link
            </button>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Additional documents</label>
            {form.documents.map((doc, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  className="rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                  placeholder="Label (e.g., Portfolio)"
                  value={doc.label}
                  onChange={(e) => {
                    const next = [...form.documents];
                    next[idx] = { ...next[idx], label: e.target.value };
                    updateField("documents", next);
                  }}
                />
                <input
                  className="rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                  placeholder="https://..."
                  value={doc.url}
                  onChange={(e) => {
                    const next = [...form.documents];
                    next[idx] = { ...next[idx], url: e.target.value };
                    updateField("documents", next);
                  }}
                />
                <div className="md:col-span-2">
                  <button
                    type="button"
                    className="btn bg-gray-100"
                    onClick={() => updateField("documents", form.documents.filter((_, i) => i !== idx))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn bg-[#90b098] text-white hover:brightness-95"
              onClick={() => updateField("documents", [...form.documents, { label: "", url: "" }])}
            >
              Add document
            </button>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Review</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Name:</strong> {form.fullName}</li>
              <li><strong>Email:</strong> {form.email}</li>
              <li><strong>Phone:</strong> {form.phone}</li>
              <li><strong>Institute:</strong> {institutes.find(i => i.id === form.instituteId)?.name || "—"}</li>
              <li><strong>Proof:</strong> {form.proofTitle} — {form.proofNumber}</li>
              <li><strong>Proof links:</strong> {form.proofUrls.filter(Boolean).join(", ") || "—"}</li>
              <li><strong>Documents:</strong> {form.documents.filter(d=>d.url).map(d=>`${d.label || "Doc"}: ${d.url}`).join("; ") || "—"}</li>
            </ul>
          </div>
        )}

        {error && <p className="text-red-600">{error}</p>}
        {success && (
          <div className="space-y-3">
            <p className="text-[#90b098] font-medium">{success}</p>
            <a href="/" className="btn bg-[#90b098] text-white hover:brightness-95">Go to Home</a>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
          >
            Back
          </button>

          {step < totalSteps - 1 ? (
            <button
              type="button"
              className="btn bg-[#90b098] text-white hover:brightness-95"
              onClick={() => canProceed() && setStep((s) => s + 1)}
              disabled={!canProceed() || submitting}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="btn bg-[#90b098] text-white hover:brightness-95"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}