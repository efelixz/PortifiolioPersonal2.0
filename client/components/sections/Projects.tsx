import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";

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
            Alguns trabalhos selecionados que mostram qualidade técnica e foco
            em negócio.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="h-full">
                <ProjectCard
                  image={p.img}
                  title={p.title}
                  description={p.desc}
                  stack={p.stack}
                  caseUrl="#contato"
                  codeUrl="#"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
