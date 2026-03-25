export const metadata = {
  title: "Admin | Nirvaan",
};

export default function AdminLayout({ children }) {
  return (
    <section className="container-max py-8 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold title-accent">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor student mental health signals and engagement</p>
        </div>
      </header>
      {children}
    </section>
  );
}
