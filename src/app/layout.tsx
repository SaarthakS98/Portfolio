import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import ThemeProvider from "@/components/ThemeProvider";
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

// Then update your body className:
<body className={`${GeistSans.className} min-h-screen bg-[#f5f5f5] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100`}></body>

export const metadata: Metadata = {
  title: "Saarthak Singhal — Portfolio",
  description: "Personal site",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f5f5f5] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <Nav />
          <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
          <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} Saarthak Singhal
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
