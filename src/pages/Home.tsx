import { motion } from "framer-motion";
import { Bot, Cog, Code2, Component, Cpu, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar3DLazy from "@/components/Avatar3DLazy";
import CardProjeto from "@/components/CardProjeto";

const skills = [
  { icon: Component, title: "React", desc: "Interfaces reativas e escaláveis." },
  { icon: Code2, title: "TypeScript", desc: "Tipagem forte e segurança." },
  { icon: Rocket, title: "Tailwind", desc: "Estilo rápido e consistente." },
  { icon: Cpu, title: "Node.js", desc: "APIs performáticas em JS." },
  { icon: Bot, title: "IA", desc: "Integrações de IA no produto." },
  { icon: Cog, title: "Automação", desc: "RPA, scraping e integrações." },
];

const projects = [
  {
    title: "Dashboard SaaS",
    description: "Visualizações em tempo real com React Query e Recharts.",
    stack: ["React", "TypeScript", "Tailwind"],
    image: "/placeholder.svg",
  },
  {
    title: "Automação de Processos",
    description: "Bots de scraping e integrações com APIs para otimizar fluxos.",
    stack: ["Node.js", "Automação", "IA"],
    image: "/placeholder.svg",
  },
  {
    title: "Landing Page Interativa",
    description: "Animações fluidas com Framer Motion e experiência premium.",
    stack: ["React", "TypeScript", "Tailwind"],
    image: "/placeholder.svg",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative isolate overflow-hidden pt-28">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" 
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-20%,hsl(220_90%_60%/.25),transparent_70%)]" />
        <div className="container grid items-center gap-10 pb-24 md:grid-cols-2 md:gap-14">
          <div className="space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground backdrop-blur"
            >
              Disponível para novos projetos
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl"
            >
              Jefferson Felix — Desenvolvedor Frontend & Automação
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-xl text-lg text-muted-foreground md:text-xl"
            >
              Construindo interfaces rápidas, escaláveis e com impacto real.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-wrap gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  to="/projetos"
                  className="group rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  Ver Projetos
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  to="/contato"
                  className="rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all duration-200 hover:bg-secondary/80 hover:shadow-md"
                >
                  Entrar em Contato
                </Link>
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center justify-center"
          >
            <Avatar3DLazy enableLazyLoad={true} />
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="sobre" className="relative py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Habilidades & Stack
            </h2>
            <p className="hidden max-w-md text-sm text-muted-foreground md:block">
              Tecnologias e ferramentas usadas no dia a dia para entregar projetos de alto impacto.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {skills.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 backdrop-blur transition hover:bg-accent"
              >
                <div className="mb-3 inline-flex rounded-md bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 p-2 text-indigo-500 ring-1 ring-inset ring-indigo-500/20">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                <div className="pointer-events-none absolute -right-12 -top-12 size-24 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:scale-125" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projetos" className="relative py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Projetos em Destaque
            </h2>
            <p className="hidden max-w-md text-sm text-muted-foreground md:block">
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
                  <CardProjeto
                    image={p.image}
                    title={p.title}
                    description={p.description}
                    stack={p.stack}
                    caseUrl="/contato"
                    codeUrl="#"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 p-10 text-center backdrop-blur">
            <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Pronto para criar algo incrível?
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
              Vamos tirar sua ideia do papel com qualidade, performance e design de alto nível.
            </p>
            <div className="mt-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Link
                  to="/contato"
                  className="inline-flex rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  Entrar em Contato
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}