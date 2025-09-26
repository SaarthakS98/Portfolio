export default function CourseworkPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Coursework</h1>
      <p className="text-neutral-600">Add your courses, brief descriptions, and key outcomes.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {["Software Testing", "Algorithms", "Databases", "Machine Learning"].map((c) => (
          <li key={c} className="rounded-xl bg-white p-4 shadow-sm">{c}</li>
        ))}
      </ul>
    </main>
  );
}