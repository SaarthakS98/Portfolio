"use client";

import Image from "next/image";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";

export default function Page() {
  return (
    <main className="space-y-12 md:space-y-16">
      {/* ===== HERO ===== */}
      <section className="pt-6 md:pt-10">
  <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-3xl sm:text-4xl">Hello</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">
              I am <span className="text-black dark:text-white">Saarthak Singhal</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700 dark:text-neutral-300">
              An aspiring artificial intelligence researcher and a full-stack developer with a passion for learning and building innovative solutions for problems around me
            </p>
          </div>

          {/* Right image */}
          {/* <div className="relative mx-auto aspect-[4/5] w-64 overflow-hidden rounded-2xl sm:w-72 md:w-80">
            <Image
                alt="Saarthak headshot"
                src="/headshot.jpg"     // <— local file in /public
                width={800}             // give actual dimensions or use `fill`
                height={1000}
                className="object-cover rounded-2xl"
              />
          </div> */}
          <div
  className="
    relative ml-auto
    h-64 sm:h-72 md:h-80        /* ↓ shorter at each breakpoint */
    aspect-[3/4]                /* a bit less tall than 4/5 */
    max-w-full overflow-hidden rounded-2xl
    ring-1 ring-black/10 dark:ring-white/10
  "
>
  <Image
    fill
    alt="Saarthak headshot"
    src="/headshot.jpg"
    className="object-cover"
  />
</div>

        </div>
      </section>

      {/* ===== “A bit about me…” strip ===== */}
      <section className="rounded-2xl bg-[#d7cebf] p-6 shadow-sm dark:bg-neutral-800">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1.2fr_1fr]">
          <div className="p-2 sm:p-4">
            <h2 className="text-3xl font-semibold sm:text-4xl">A bit about me</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-800 dark:text-neutral-200">
              Some text about me
            </p>
          </div>

          {/* Video-style thumbnail with play → navigates to /about */}
          {/* <div className="relative mx-auto aspect-video w-full max-w-md overflow-hidden rounded-2xl bg-neutral-300 dark:bg-neutral-700">
            <Image
              alt="About video"
              fill
              className="object-cover opacity-90"
              src = "null"
            />
            <button
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-4 shadow-md ring-2 ring-white/80 backdrop-blur-sm"
              aria-label="Play intro video"
              onClick={() => (window.location.href = "/about")}
            >
              <svg width="52" height="52" viewBox="0 0 24 24" fill="white" className="drop-shadow">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div> */}
        </div>
      </section>

      {/* ===== Work Experience ===== */}
      <section className="rounded-2xl bg-neutral-900 p-8 text-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-3xl font-semibold sm:text-4xl">Work Experience</h2>
            <Link href="/projects" className="text-sm text-neutral-300 hover:text-white">
              See More &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl bg-neutral-800 p-4">
                <div className="mt-1 h-6 w-6 shrink-0 rounded-md bg-white/90" />
                <div>
                  <p className="font-medium">
                    Product Designer at <span className="font-semibold">Uber</span>
                  </p>
                  <p className="text-sm text-neutral-300">February 2023 – April 2025</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Selected Projects ===== */}
      <section className="space-y-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Selected <span className="font-bold">Projects</span>
          </h2>
          <Link
            href="/projects"
            className="text-sm text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
          >
            See All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
      </section>
    </main>
  );
}
