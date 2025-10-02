"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT ME" },
  { href: "/coursework", label: "COURSEWORK" },
  { href: "/experiences", label: "EXPERIENCES" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/certificates", label: "EXTRACURRICULARS" },
  { href: "/test-scores", label: "TEST SCORES/DOCS" }
];

export default function Nav() {
  const pathname = usePathname() || "/";
  return (
   <header
  className="
    sticky top-3           /* gap from top even when sticky */
    z-30
    mx-4                   /* side gap so rounded corners show */
    rounded-2xl            /* soft curved edges */
    bg-[#97C2EC]/90           /* light theme blue */
    backdrop-blur supports-[backdrop-filter]:bg-[#97C2EC]/80 dark:bg-neutral-900/60
  "
>
      <div className="mx-auto max-w-6xl px-4">
        <nav className="flex h-14 items-center gap-6">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  active
                    ? "font-semibold text-black dark:text-white"
                    : "text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
