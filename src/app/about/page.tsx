// src/app/about/page.tsx
export const metadata = {
  title: "About — Saarthak Singhal",
  description: "About me",
};

export default function AboutPage() {
  return (
    <main className="space-y-10">
      <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
        <h1 className="text-4xl font-semibold sm:text-5xl">About me</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
          I’m Saarthak Singhal — a law-trained data scientist focused on LegalTech, regulatory analytics,
          and AI-driven document processing. I’m currently pursuing a B.S. in Data Science & Applications
          at IIT-Madras (expected Dec 2025) and previously completed a B.A. LL.B. (Hons.) at NLU Jodhpur (2023).
        </p>
        <p className="mt-4 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
          I build end-to-end AI systems across OCR/RAG, gaze tracking, and time-series modeling, and I’ve held
          roles across ML engineering and data engineering. This site collects projects, coursework, and notes.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
        <h2 className="text-2xl font-medium">Currently</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-300">
          <li>GaLM-SEBI (Graph-Augmented LLM for SEBI Insider-Trading Orders)</li>
          <li>“Court-Agent” knowledge-graph-driven RAG system</li>
          <li>Reading Analytics (WebGazer.js + MediaPipe FaceMesh)</li>
        </ul>
      </section>
    </main>
  );
}
