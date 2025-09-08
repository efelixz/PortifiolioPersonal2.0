import { motion } from "framer-motion";

const projects = [
  {
    title: "Dashboard SaaS",
    desc: "Visualizações em tempo real com React Query e Recharts.",
    stack: ["React", "TypeScript", "Tailwind"],
    img: "/placeholder.svg",
  },
  {
    title: "Automação de Processos",
    desc: "Bots de scraping e integrações com APIs para otimizar fluxos.",
    stack: ["Node.js", "RPA", "IA"],
    img: "/placeholder.svg",
  },
  {
    title: "Landing Page Interativa",
    desc: "Animações fluidas com Framer Motion e experiência premium.",
    stack: ["React", "Framer Motion", "Vite"],
    img: "/placeholder.svg",
  },
];

export default function Projects() {
  return (
    <section id="projetos" className="relative py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Projetos em Destaque
          </h2>
          <p className="hidden max-w-md text-sm text-white/60 md:block">
            Alguns trabalhos selecionados que mostram qualidade técnica e foco em negócio.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={p.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-white/60">{p.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href="#contato"
                  className="mt-4 inline-flex rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110"
                >
                  Ver Case Completo
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
