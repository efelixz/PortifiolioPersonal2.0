import { motion } from "framer-motion";
import { Bot, Cog, Code2, Component, Cpu, Rocket } from "lucide-react";

const skills = [
  { icon: Component, title: "React", desc: "Interfaces reativas e escaláveis." },
  { icon: Code2, title: "TypeScript", desc: "Tipagem forte e segurança." },
  { icon: Rocket, title: "Tailwind", desc: "Estilo rápido e consistente." },
  { icon: Cpu, title: "Node.js", desc: "APIs performáticas em JS." },
  { icon: Bot, title: "IA", desc: "Integrações de IA no produto." },
  { icon: Cog, title: "Automação", desc: "RPA, scraping e integrações." },
];

export default function Skills() {
  return (
    <section id="sobre" className="relative py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Habilidades & Stack
          </h2>
          <p className="hidden max-w-md text-sm text-white/60 md:block">
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
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
            >
              <div className="mb-3 inline-flex rounded-md bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 p-2 text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-1 text-sm text-white/60">{s.desc}</p>
              <div className="pointer-events-none absolute -right-12 -top-12 size-24 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:scale-125" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
