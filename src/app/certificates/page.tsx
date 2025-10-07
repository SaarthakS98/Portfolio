import Link from "next/link";

export default function CertificatesPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-semibold">Extracurriculars and Volunteer Experiences</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        
          <article className="rounded-xl bg-white p-4 shadow-sm">
              <Link
                href="https://booksforall.in/our-partners/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <h3 className="text-xl font-semibold hover:underline">Books for All</h3>
                <p className="text-sm text-neutral-400 hover:text-grey">Visit their website</p>
              </Link>

              <h5 className="text-sm text-neutral-600">Continuous Association</h5>
              <p className="mt-2 text-sm text-neutral-700">
                About the Organization: Books for All is a non-profit organization dedicated to
                promoting literacy and education among underprivileged children in India.
              </p>
            </article>
            <article className="rounded-xl bg-white p-4 shadow-sm">
              <a
                href="/docs/Python_Mentor_Certificate.pdf"
                download="Saarthak_Singhal_Student_Mentor_Certificate.pdf"
                className="block"
              >
                <h3 className="text-xl font-semibold hover:underline">Student Mentor</h3>
                <p className="text-sm text-neutral-400 hover:text-grey">Download the certificate</p>
              </a>

              <h5 className="text-sm text-neutral-600">August 2022 - September 2022</h5>
              <p className="mt-2 text-sm text-neutral-700">
                About the Organization: Books for All is a non-profit organization dedicated to
                promoting literacy and education among underprivileged children in India.
              </p>
            </article>

      </div>
    </main>
  );
}
