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
        <h2 className="text-2xl font-medium">Currently</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-700 dark:text-neutral-300">
          <li>This is some list</li>
        </ul>
      </section>
    </main>
  );
}
