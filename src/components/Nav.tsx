// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import ThemeToggle from "@/components/ThemeToggle";

// const links = [
//   { href: "/", label: "ABOUT ME" },
//   { href: "/coursework", label: "COURSEWORK" },
//   { href: "/projects", label: "PROJECTS/INTERNSHIPS" },
//   { href: "/certificates", label: "CERTIFICATES" },
// ];

// export default function Nav() {
//   const pathname = usePathname() || "/";
//   return (
//     <header className="sticky top-0 z-30 bg-[#d9d9d9]/70 backdrop-blur supports-[backdrop-filter]:bg-[#d9d9d9]/60 dark:bg-neutral-900/60">
//       <div className="mx-auto max-w-6xl px-4">
//         <nav className="flex items-center gap-6 py-3 text-sm font-medium tracking-wide">
//           {links.map(({ href, label }) => {
//             const active = pathname === href;
//             return (
//               <Link
//                 key={href}
//                 href={href}
//                 className={`transition-colors ${
//                   active
//                     ? "text-black dark:text-white"
//                     : "text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
//                 }`}
//               >
//                 {label}
//               </Link>
//             );
//           })}
//           <div className="ml-auto">
//             <ThemeToggle />
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// }

// src/components/Nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT ME" },
  { href: "/coursework", label: "COURSEWORK" },
  { href: "/projects", label: "PROJECTS/INTERNSHIPS" },
  { href: "/certificates", label: "EXTRACURRICULARS" },
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
