// src/app/about/page.tsx
export const metadata = {
  title: "Saarthak Singhal",
  description: "About me",
};

export default function AboutPage() {
  return (
    <main className="space-y-10">
      <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
        <h1 className="text-4xl font-semibold sm:text-5xl">About me</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
          I am Saarthak Singhal
        </p>
        <p className="mt-4 text-lg leading-8 text-neutral-700 dark:text-neutral-300">
          This is just some text
        </p>
      </section>

      <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
        <h2 className="text-2xl font-medium">Currently Working On:</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-300">
          <li>Research Internship with Prof. Prajish Prasad, Flame University working on Computer Vision for Education</li>
          <li>Personal Research on using Graph and Vector Based Techniques for Legal Research</li>
          <li>Studying Reinforcement Learning, Mathematical Foundation for Generative AI, Industry 4.0 and Lab for NLP, Speech, and Vision (Final Semester of undergraduate studies) </li>
        </ul>
      </section>
      <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
        <h2 className="text-2xl font-medium">Future Goals:</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-300">
          <li>Pursue research focusing on AI and its applications in Education and Legal Research</li>
          <li>Collaborate with interdisciplinary teams to develop innovative solutions using AI</li>
          <li>Build tools that can  help people understand their legal rights and liabilities</li>
          <li>Develop methods for Responsible and Green AI that could ensure more sustainable and accessible AI products</li>

        </ul>
      
      </section>

    </main>
  );
}
