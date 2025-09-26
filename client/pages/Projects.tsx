import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/SEOHelper";
import { usePageSignature } from "@/hooks/usePageSignature";
import { usePortfolio } from "../hooks/usePortfolio";

type Tech =
  | "React"
  | "TypeScript"
  | "Tailwind"
  | "Node.js"
  | "IA"
  | "Automação"
  | "JavaScript"
  | "Python"
  | "RPA"
  | "Express"
  | "MongoDB"
  | "API"
  | "Selenium"
  | "Figma"
  | "CSS"
  | "HTML"
  | "Vite"
  | "Framer Motion"
  | "API Integration"
  | "Pandas";

type Project = {
  id: string;
  title: string;
  desc: string;
  image: string;
  tech: string[];
  codeUrl?: string;
  demoUrl?: string;
  repositoryUrl?: string;
  date?: string;
};

const ALL_TAG: Tech | "Todos" = "Todos" as const;

const techPalette: Record<string, string> = {
  React: "from-sky-500 to-cyan-500 text-white",
  TypeScript: "from-blue-600 to-indigo-600 text-white",
  Tailwind: "from-teal-500 to-emerald-500 text-white",
  "Node.js": "from-lime-500 to-green-600 text-slate-900",
  IA: "from-fuchsia-500 to-purple-600 text-white",
  Automação: "from-amber-400 to-orange-500 text-slate-900",
  JavaScript: "from-yellow-400 to-amber-500 text-slate-900",
  Python: "from-blue-500 to-indigo-600 text-white",
  RPA: "from-purple-500 to-indigo-600 text-white",
  Express: "from-slate-500 to-gray-600 text-white",
  MongoDB: "from-green-500 to-emerald-600 text-white",
  API: "from-orange-500 to-red-500 text-white",
  Selenium: "from-teal-400 to-blue-500 text-white",
  Figma: "from-pink-500 to-purple-500 text-white",
  CSS: "from-blue-400 to-purple-500 text-white",
  HTML: "from-orange-400 to-red-500 text-white",
  Vite: "from-purple-400 to-indigo-500 text-white",
  "Framer Motion": "from-pink-400 to-purple-600 text-white",
  "API Integration": "from-indigo-500 to-purple-600 text-white",
  Pandas: "from-green-400 to-teal-500 text-white"
};

export default function ProjectsPage() {
  const { projects: portfolioProjects } = usePortfolio();
  usePageSignature('Projetos');
  
  useSEO({
    title: 'Projetos - Jefferson Felix',
    description: 'Conheça os principais projetos desenvolvidos por Jefferson Felix. Aplicações React, TypeScript, automações e soluções frontend modernas.',
    url: 'https://jeffersonfelix.dev/projetos',
    type: 'website',
    keywords: [
      'projetos react',
      'typescript projects',
      'portfolio projetos',
      'automação',
      'frontend projects',
      'desenvolvimento web'
    ]
  });

  // Converter os projetos do portfolio para o formato esperado
  const projects: Project[] = portfolioProjects.map(project => ({
    id: project.id.toString(),
    title: project.title,
    desc: project.description,
    image: project.image || "/placeholder.svg",
    tech: project.tech,
    codeUrl: project.github,
    demoUrl: project.link,
    repositoryUrl: project.github,
    date: project.date
  }));

  // Gerar filtros dinamicamente com base nas tecnologias dos projetos
  const uniqueTechs = Array.from(new Set(projects.flatMap(p => p.tech)));
  const filters: (typeof ALL_TAG | string)[] = [ALL_TAG, ...uniqueTechs.sort()];

  // Usar estado local sem modificar a URL
  const [active, setActive] = useState<(typeof filters)[number]>(ALL_TAG);

  const list = useMemo(() => {
    if (active === ALL_TAG) return projects;
    return projects.filter((p) => p.tech.includes(active as string));
  }, [active, projects]);

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
