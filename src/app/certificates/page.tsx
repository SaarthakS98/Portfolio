import Link from "next/link";

export default function CertificatesPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Extracurriculars and Volunteer Experiences</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        
          <article className="rounded-xl bg-white p-4 shadow-sm">
              <Link
                href="https://booksforall.in/our-partners/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="text-xl font-semibold hover:underline">Books for All</h3>
                <p className="text-sm text-neutral-300 hover:text-white">See More </p>
              </Link>

              <h5 className="text-sm text-neutral-600">Continuous Association</h5>
              <p className="mt-2 text-sm text-neutral-700">
                About the Organization: Books for All is a non-profit organization dedicated to
                promoting literacy and education among underprivileged children in India.
              </p>
            </article>
      </div>
    </main>
  );
}
