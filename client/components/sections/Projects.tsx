import { motion } from "framer-motion";
import { usePortfolio } from "@/hooks/usePortfolio";
import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  const { projects } = usePortfolio();
  
  // Show only completed projects in the portfolio
  const featuredProjects = projects
    .filter(p => p.status === 'Concluído')
    .slice(0, 6); // Limit to 6 projects

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
          {featuredProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="h-full">
                <ProjectCard
                  image={p.image || "/placeholder.svg"}
                  title={p.title}
                  description={p.description}
                  stack={p.tech}
                  caseUrl={p.link || "#contato"}
                  codeUrl={p.github || "#"}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
