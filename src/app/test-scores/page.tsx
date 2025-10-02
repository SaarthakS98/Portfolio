// src/app/test-scores/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Test Scores and Documents: Saarthak Singhal",
  description: "Standardized test scores and supporting documents (PDFs).",
};

type ScoreRow = {
  exam: string;
  date?: string;
  total?: string | string;
  breakdown?: Record<string, string | string>;
  type?: string;
};

const SCORES: ScoreRow[] = [
  {
    exam: "TOEFL iBT",
    date: "11/09/25",
    total: "117/120",
    breakdown: { Reading: "29/30", Listening: "30/30", Speaking: "28/30", Writing: "30/30"},
    type: "Center-based",
  },
  {
    exam: "GRE",
    date: "21/09/25",
    total: "344/346",
    breakdown: { Quantitative: "170/170", Verbal: "169/176", "Analytical Writing": "5.0/6.0" },
    type: "Center-based",
  },
  // add more as needed
];

const DOCS = [
  { title: "TOEFL Score Report (PDF)", href: "/docs/TOEFL_Score_Report.pdf" },
  { title: "GRE Score Report (PDF)", href: "/docs/GRE_Score_Report.pdf" },
  { title: "Transcript: IIT-M (PDF)", href: "/docs/Transcript_IITM.pdf" },
  // add more as needed
];

export default function TestScoresPage() {
  return (
    <main className="space-y-10">
      {/* Heading */}
      <section className="pt-2">
        <h1 className="text-4xl font-semibold sm:text-5xl">Test Scores &amp; Documents</h1>
        <p className="mt-3 text-neutral-700 dark:text-neutral-300">
          A summary of standardized test scores and downloadable PDF documents.
        </p>
      </section>

      {/* Scores Table */}
      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900">
        <h2 className="text-2xl font-medium">Scores</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-sm text-neutral-600 dark:text-neutral-400">
                <th className="px-3 py-2">Exam</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Breakdown</th>
                <th className="px-3 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {SCORES.map((row, i) => (
                <tr key={i} className="rounded-xl bg-[#f6f6f6] dark:bg-neutral-800">
                  <td className="px-3 py-3 font-medium">{row.exam}</td>
                  <td className="px-3 py-3">{row.date ?? "—"}</td>
                  <td className="px-3 py-3">{row.total ?? "—"}</td>
                  <td className="px-3 py-3 text-[13px]">
                    {row.breakdown ? (
                        <div className="flex flex-wrap gap-2">
                        {Object.entries(row.breakdown).map(([k, v]) => {
                            const LABELS: Record<string, string> = {
                            Reading: "Reading",
                            Listening: "Listening",
                            Speaking: "Speaking",
                            Writing: "Writing",
                            Quantitative: "Quant",
                            Verbal: "Verbal",
                            "Analytical Writing": "Writing (AWA)",
                            };
                            const short = LABELS[k] ?? k;
                            return (
                            <span
                                key={k}
                                title={`${k}: ${v}`}
                                className="
                                inline-flex items-center rounded-md
                                bg-neutral-100 px-2.5 py-1.5
                                ring-1 ring-black/10
                                dark:bg-neutral-800 dark:ring-white/10
                                "                 // ← removed text-xs
                            >
                                <span className="mr-1 font-medium">{short}</span>
                                <span className="opacity-80">{v}</span>
                            </span>
                            );
                        })}
                        </div>
                    ) : (
                        "—"
                    )}
                    </td>
                  <td className="px-3 py-3 text-sm">{row.type ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900">
        <h2 className="text-2xl font-medium">Documents (PDF)</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCS.map((doc) => (
            <article key={doc.href} className="rounded-xl border border-black/10 p-4 dark:border-white/10">
              <h3 className="text-base font-medium">{doc.title}</h3>
              <div className="mt-3 flex gap-2">
                {/* View in new tab */}
                <Link
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg px-3 py-2 text-sm ring-1 ring-black/10 hover:bg-black/5 dark:ring-white/20 dark:hover:bg-white/10"
                >
                  View
                </Link>
                {/* Force download */}
                <a
                  href={doc.href}
                  download
                  className="inline-flex items-center rounded-lg px-3 py-2 text-sm ring-1 ring-black/10 hover:bg-black/5 dark:ring-white/20 dark:hover:bg-white/10"
                >
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
