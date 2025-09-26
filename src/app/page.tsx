"use client";
import ProjectCard from "@/components/ProjectCard";
import ChatWidget from "@/components/ChatWidget";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  console.log("Current theme:", theme);
  console.log("Resolved theme:", resolvedTheme);
  
  return (
    <>
    <main className="space-y-10">
     {/* Hero */}
      <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
        <p className="text-3xl sm:text-4xl">Hello!</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
          I am <span className="font-extrabold">Saarthak Singhal</span>
        </h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {["RAG", "LLMs", "Next.js", "TypeScript", "Supabase", "Postgres", "Tailwind", "Python"].map((s) => (
            <span
              key={s}
              className="select-none rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium shadow-[0_1px_0_rgba(0,0,0,0.06)] dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="rounded-2xl bg-[#e5e5e5] p-8 shadow-sm dark:bg-neutral-800">
        <div className="grid gap-8 md:grid-cols-1">
          <ExperienceColumn title="Industry Experience" />
        </div>
      </section>

      {/* Projects Preview */}
      <section className="space-y-4 rounded-2xl bg-white p-8 shadow-sm dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            <span className="font-bold">Projects</span>
          </h2>
          <a href="/projects" className="text-sm font-medium text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">
            See All
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProjectCard key={i} />
          ))}
        </div>
      </section>
    </main>
    {/* Floating Chat Widget */}
      <ChatWidget />
    </>
  );
}

function ExperienceColumn({ title }: { title: string }) {
  const items = [
    { role: "Machine Learning Intern, Engineering and Research, HCLTech", when: "June – Sep, 2025" },
    { role: "Machine Learning Intern, QuantHive Research", when: "January – May, 2025" },
    { role: "Data Engineering Intern, Pabay Software", when: "July – December, 2023" },
  ];
  return (
    <div className="rounded-xl bg-[#efefef] p-6 dark:bg-neutral-700">
      <div className="mb-4 flex items-end justify-between">
        <h3 className="text-2xl font-medium">{title}</h3>
        <a href="/projects" className="text-xs text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white">See More</a>
      </div>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            
            <div>
              <p className="text-[15px] font-medium">{item.role}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{item.when}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}