export const metadata = { title: "Universities • Nirvaan" };


import connectDB from "@/lib/connectdb";
import Institute from "@/models/institute";

async function getUniversities() {
  await connectDB();
  const docs = await Institute.find({})
    .select("name logoUrl website")
    .sort({ name: 1 })
    .lean();
  return docs?.map((d) => ({
    _id: String(d._id),
    name: d.name,
    logoUrl: d.logoUrl || "",
    website: d.website || "",
  })) || [];
}

export default async function UniversitiesPage() {
  const universities = await getUniversities();

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Partner Universities</h1>
        <p className="text-gray-600">Institutions partnering with Nirvaan to support student wellbeing.</p>
      </header>
      <div className="flex gap-4">
        <a
          href="/universities/register"
          className="btn bg-[#90b098] text-white hover:brightness-95 ring-focus"
        >
          Partner with us as counsellor
        </a>
        <a
          href="/counsellor"
          className="btn bg-[#90b098] text-white hover:brightness-95 ring-focus"
        >
          Register as counsellor
        </a>
      </div>

      {universities.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600">No universities found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((u) => (
            <article
              key={u._id}
              className="card overflow-hidden transition hover:shadow-xl group border border-[#90b098]/30"
            >
              <div className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-[#90b098]/15 ring-1 ring-[#90b098]/30 flex items-center justify-center overflow-hidden">
                  {u.logoUrl ? (
                    <img
                      src={u.logoUrl}
                      alt={u.name}
                      width={56}
                      height={56}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-[#90b098]">
                      {u.name?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate group-hover:text-[#90b098]">
                    {u.name}
                  </h3>
                  {u.website ? (
                    <a
                      href={u.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-[#90b098] underline-offset-4 hover:underline"
                    >
                      Visit website
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Website not provided</p>
                  )}
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#90b098]/0 via-[#90b098]/50 to-[#90b098]/0" />
            </article>
          ))}
        </div>
      )}
    </section>
  );
}


