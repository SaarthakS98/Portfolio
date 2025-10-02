import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-semibold">Projects</h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCard key={i} />
        ))}
      </div>
    </main>
  );
}
