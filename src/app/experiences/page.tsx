// src/app/experiences/page.tsx
export const metadata = {
  title: "Experiences — Saarthak Singhal",
  description: "Work, internships, and major roles.",
};

type Experience = {
  role: string;
  org: string;
  period: string;     // e.g., "Feb 2023 – Apr 2025"
  location?: string;  // e.g., "Remote · India"
  highlights?: string[];
  link?: string;      // org or project link (optional)
  tag?: string;       // e.g., "Full-time", "Internship", "Research"
};

const EXPERIENCES: Experience[] = [
  {
    role: "Research Intern",
    org: "Prof. Prajish Prasad, Flame University",
    period: "October 2025 – January 2026",
    location: "Remote, India",
    tag: "Internship",
    highlights: [
      "Developed OCR/RAG components for internal knowledge search.",
      "Optimized retrieval latency and response quality.",
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "Engineering and Research Services, HCLTech",
    period: "Jun 2025 – Sep 2025",
    location: "Noida, India",
    tag: "Internship",
    highlights: [
      "Developed OCR/RAG components for internal knowledge search.",
      "Optimized retrieval latency and response quality.",
    ],
  },
  {
    role: "Machine Learning Intern",
    org: "Research, QuantHive Research",
    period: "Jan 2025 – May 2025",
    location: "Chennai · India",
    tag: "Internship",
    highlights: [
      "Built feature pipelines and evaluation harnesses for trading strategies.",
      "Implemented model monitoring and automated back-tests.",
    ],
  },
{
    role: "Project Intern",
    org: "Prof. Neelesh Upadhye, IIT Madras",
    period: "Jun 2024 – November 2024",
    location: "Chennai, India",
    tag: "Project",
    highlights: [
      "Developed OCR/RAG components for internal knowledge search.",
      "Optimized retrieval latency and response quality.",
    ],
  },
  {
    role: "Project Intern",
    org: "Dr. Pooja Gupta, Delhi Technological University",
    period: "February 2024 – May 2024",
    location: "Delhi, India",
    tag: "Project",
    highlights: [
      "Developed OCR/RAG components for internal knowledge search.",
      "Optimized retrieval latency and response quality.",
    ],
  },
  {
    role: "Data Engineering Intern",
    org: "Pabay Software",
    period: "July 2023 – November 2023",
    location: "Noida, India",
    tag: "Internship",
    highlights: [
      "Developed OCR/RAG components for internal knowledge search.",
      "Optimized retrieval latency and response quality.",
    ],
  },
];

export default function ExperiencesPage() {
  return (
    <main className="space-y-10">
      {/* Heading */}
      <section className="pt-2">
        <h1 className="text-4xl font-semibold sm:text-5xl">Experiences</h1>
        <p className="mt-3 text-neutral-700 dark:text-neutral-300">
          Roles, internships, and projects with impact.
        </p>
      </section>

      {/* Experiences list */}
      <section className="rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-900">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {EXPERIENCES.map((exp, i) => (
            <article
              key={i}
              className="rounded-xl border border-black/10 p-5 dark:border-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{exp.role}</h3>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {exp.org}
                    {exp.location ? <span className="opacity-70"> · {exp.location}</span> : null}
                  </p>
                </div>
                {exp.tag ? (
                  <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-800 ring-1 ring-black/10 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-white/10">
                    {exp.tag}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{exp.period}</p>

              {exp.highlights?.length ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-neutral-800 dark:text-neutral-200">
                  {exp.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              ) : null}

              {exp.link ? (
                <a
                  href={exp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm text-neutral-700 underline hover:text-black dark:text-neutral-300 dark:hover:text-white"
                >
                  Learn more
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
