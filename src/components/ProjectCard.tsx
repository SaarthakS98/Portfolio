import Link from "next/link";

export type ProjectCardProps = {
  title?: string;
  tag?: string;
  href?: string;
  description?: string;
};

export default function ProjectCard({
  title = "Prudence",
  tag = "Aug'23",
  href = "/projects",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900">
      {/* Media */}
      <div className="relative h-40 w-full bg-gradient-to-r from-[#b1caf7] via-[#c4b4ff] to-[#f2b5ff]">
        <span className="absolute right-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium text-white">
          {tag}
        </span>
      </div>
      {/* Body */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{description}</p>
        </div>
        <Link
          aria-label="Open project"
          href={href}
          className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </Link>
      </div>
    </article>
  );
}