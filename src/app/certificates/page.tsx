export default function CertificatesPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Certificates</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <article key={i} className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold">Certificate {i + 1}</h3>
            <p className="text-sm text-neutral-600">Provider • Year</p>
          </article>
        ))}
      </div>
    </main>
  );
}
