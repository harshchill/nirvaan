// app/Components/InstituteForm.jsx
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

export default function InstituteForm() {
  const [step, setStep] = React.useState(0);
  const totalSteps = 8;
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const [form, setForm] = React.useState({
    name: "",
    type: "university",
    logoUrl: "",
    website: "",
    email: "",
    phone: "",
    establishedYear: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    description: "",
  });

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function updateAddress(field, value) {
    setForm((f) => ({ ...f, address: { ...f.address, [field]: value } }));
  }

  function canProceed() {
    if (step === 0) return form.name.trim().length > 1;
    if (step === 1) return ["university", "college"].includes(form.type);
    if (step === 2) return form.logoUrl.trim().length > 5;
    if (step === 3) return !form.website || /^https?:\/\//.test(form.website);
    if (step === 4) return (!form.email || /.+@.+\..+/.test(form.email)) && (!form.phone || form.phone.trim().length >= 7);
    if (step === 5) return !form.establishedYear || /^\d{4}$/.test(String(form.establishedYear));
    if (step === 6) return !!form.address.city || !!form.address.country;
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/institutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          establishedYear: form.establishedYear ? Number(form.establishedYear) : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess("Institute submitted. We'll review and publish soon.");
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Register an Institute</h1>
        <p className="text-gray-600">Provide details to list your university or college on Nirvaan.</p>
        <StepIndicator total={totalSteps} current={step} />
      </header>

      <div className="card p-6 md:p-8 space-y-6">
        {step === 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Institute name</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="e.g., Meadowview University"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Type</label>
            <div className="flex gap-3">
              {[
                { value: "university", label: "University" },
                { value: "college", label: "College" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`btn ${form.type === opt.value ? "bg-[#90b098] text-white" : "bg-gray-100"}`}
                  onClick={() => updateField("type", opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Logo URL</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="https://...logo.png"
              value={form.logoUrl}
              onChange={(e) => updateField("logoUrl", e.target.value)}
            />
            <p className="text-xs text-gray-500">Provide a square or horizontal logo link.</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Website</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="https://www.example.edu"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
            />
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                placeholder="contact@example.edu"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Phone</label>
              <input
                className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                placeholder="Contact number"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Established year</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="e.g., 1968"
              value={form.establishedYear}
              onChange={(e) => updateField("establishedYear", e.target.value)}
            />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Address</label>
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="Address line 1"
              value={form.address.line1}
              onChange={(e) => updateAddress("line1", e.target.value)}
            />
            <input
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="Address line 2 (optional)"
              value={form.address.line2}
              onChange={(e) => updateAddress("line2", e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                placeholder="City"
                value={form.address.city}
                onChange={(e) => updateAddress("city", e.target.value)}
              />
              <input
                className="rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                placeholder="State"
                value={form.address.state}
                onChange={(e) => updateAddress("state", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                placeholder="Country"
                value={form.address.country}
                onChange={(e) => updateAddress("country", e.target.value)}
              />
              <input
                className="rounded-xl border px-4 py-2 focus:outline-none ring-focus"
                placeholder="Postal code"
                value={form.address.postalCode}
                onChange={(e) => updateAddress("postalCode", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Short description</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border px-4 py-2 focus:outline-none ring-focus"
              placeholder="Optional overview about the institute"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
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