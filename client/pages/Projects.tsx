import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Tech =
  | "React"
  | "TypeScript"
  | "Tailwind"
  | "Node.js"
  | "IA"
  | "Automação";

type Project = {
  id: string;
  title: string;
  desc: string;
  image: string;
  tech: Tech[];
  codeUrl?: string;
  demoUrl?: string;
};

const ALL_TAG: Tech | "Todos" = "Todos" as const;

const projects: Project[] = [
  {
    id: "saas-dashboard",
    title: "Dashboard SaaS",
    desc: "KPIs em tempo real, caching e charts interativos.",
    image: "/placeholder.svg",
    tech: ["React", "TypeScript", "Tailwind"],
    codeUrl: "#",
    demoUrl: "#",
  },
  {
    id: "rpa-bots",
    title: "Automação de Processos",
    desc: "Bots de scraping e integrações para otimizar fluxos.",
    image: "/placeholder.svg",
    tech: ["Node.js", "Automação", "IA"],
    codeUrl: "#",
    demoUrl: "#",
  },
  {
    id: "ai-insights",
    title: "IA Insights",
    desc: "Análises com IA e prompts orquestrados.",
    image: "/placeholder.svg",
    tech: ["React", "IA"],
    codeUrl: "#",
    demoUrl: "#",
  },
  {
    id: "landing-animada",
    title: "Landing Interativa",
    desc: "Animações fluidas e UX premium.",
    image: "/placeholder.svg",
    tech: ["React", "Tailwind"],
    codeUrl: "#",
    demoUrl: "#",
  },
];

const techPalette: Record<string, string> = {
  React: "from-sky-500 to-cyan-500 text-white",
  TypeScript: "from-blue-600 to-indigo-600 text-white",
  Tailwind: "from-teal-500 to-emerald-500 text-white",
  "Node.js": "from-lime-500 to-green-600 text-slate-900",
  IA: "from-fuchsia-500 to-purple-600 text-white",
  Automação: "from-amber-400 to-orange-500 text-slate-900",
};

const filters: (typeof ALL_TAG | Tech)[] = [
  ALL_TAG,
  "React",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "IA",
  "Automação",
];

export default function ProjectsPage() {
  const [active, setActive] = useState<(typeof filters)[number]>(ALL_TAG);

  const list = useMemo(() => {
    if (active === ALL_TAG) return projects;
    return projects.filter((p) => p.tech.includes(active as Tech));
  }, [active]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Hero pequeno */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 animated-gradient" />
        <div className="container py-16">
          <motion.h1
            className="font-display text-3xl font-extrabold md:text-4xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Meus Projetos & Estudos
          </motion.h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Seleção de trabalhos e provas de conceito com foco em performance e
            experiência.
          </p>
        </div>
      </section>

      {/* Filtro */}
      <section className="border-y border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="container flex flex-wrap gap-2 py-4">
          {filters.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                active === t
                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                  : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de projetos */}
      <section className="py-12">
        <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={p.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-white/70">{p.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className={`inline-flex items-center rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-semibold ${techPalette[t]}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={p.codeUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
                  >
                    Ver Código
                  </a>
                  <a
                    href={p.demoUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    Abrir Demo
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
