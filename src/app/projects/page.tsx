// import ProjectCard from "@/components/ProjectCard";

// export default function ProjectsPage() {
//   return (
//     <main className="space-y-6">
//       <div className="flex items-end justify-between">
//         <h1 className="text-3xl font-semibold">Projects</h1>
//       </div>
//       <div className="grid gap-6 sm:grid-cols-2">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <ProjectCard key={i} />
//         ))}
//       </div>
//     </main>
//   );
// }

import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "Student Progress Tracker",
    tag: "December'24",
    href: "/projects/se-project",
    description: "A compliance-first legal analytics engine…",
    image: "/projects/se-project.jpeg",
  },
  {
    title: "Court Agent",
    tag: "Feb'24",
    href: "/projects/court-agent",
    description: "Upload PDFs, extract entities, build timelines…",
    image: "/projects/court-agent.jpg",
  },
  {
    title: "GaLM-SEBI",
    tag: "May'24",
    href: "/projects/galm-sebi",
    description: "Graph-augmented LLM over SEBI enforcement orders…",
    image: "/projects/galm-sebi.jpg",
  },
  {
    title: "VAE Time-Series",
    tag: "Nov'24",
    href: "/projects/vae-timeseries",
    description: "Regime-aware CVAE-LSTM synthetic data generator…",
    image: "/projects/vae-timeseries.jpg",
  },
  {
    title: "Mesh Feature Miner",
    tag: "Jan'25",
    href: "/projects/mesh-miner",
    description: "STL feature extraction & clustering with SqueezeNet…",
    image: "/projects/mesh-miner.jpg",
  },
  {
    title: "WebGazer+",
    tag: "Mar'25",
    href: "/projects/webgazer-plus",
    description: "Custom calibration & gaze analytics in the browser…",
    image: "/projects/webgazer-plus.jpg",
  },
];

export default function ProjectsPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-semibold">Projects</h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={i} {...p} />
        ))}
      </div>
    </main>
  );
}

