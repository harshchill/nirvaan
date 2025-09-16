export const metadata = { title: "Universities • Nirvaan" };

const universities = [
  { name: "Aurelia University", location: "San Diego, CA" },
  { name: "Northbridge Institute", location: "Boston, MA" },
  { name: "Seaside College", location: "Santa Cruz, CA" },
  { name: "Valley State University", location: "Tempe, AZ" },
  { name: "Meadowview University", location: "Eugene, OR" },
];

export default function UniversitiesPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold">Partner Universities</h1>
        <p className="text-gray-600">Institutions partnering with Nirvaan to support student wellbeing.</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((u) => (
          <div key={u.name} className="card p-5">
            <h3 className="font-semibold text-lg">{u.name}</h3>
            <p className="text-gray-600">{u.location}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


