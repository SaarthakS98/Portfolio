"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeTest() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="min-h-[60vh] p-8 space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-sm">Theme: <b>{theme}</b></span>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded border px-3 py-1 text-sm"
        >
          Toggle
        </button>
      </div>

      {/* Box A: normal dark variant */}
      <div data-test="box-a"
           className="rounded-xl p-8 text-center text-lg bg-white text-black dark:bg-neutral-900 dark:text-white">
        A) Should switch white ↔ near-black
      </div>

      {/* Box B: dark variant with !important — wins most overrides */}
      <div data-test="box-b"
           className="rounded-xl p-8 text-center text-lg bg-white text-black dark:!bg-black dark:!text-white">
        B) Forces dark colors with !important
      </div>
    </main>
  );
}
