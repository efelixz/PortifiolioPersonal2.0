import { motion } from "framer-motion";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Bot, Cog, Code2, Component, Cpu, Rocket, Database, Cloud, Wrench, Palette, TestTube } from "lucide-react";

export default function Skills() {
  const { skills } = usePortfolio();

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: any } = {
      'Frontend': Component,
      'Backend': Cpu,
      'Languages': Code2,
      'Database': Database,
      'DevOps': Cog,
      'Mobile': Component,
      'Design': Palette,
      'Testing': TestTube,
      'Tools': Wrench,
      'Cloud': Cloud
    };
    return icons[category] || Code2;
  };

  const getSkillDescription = (skill: any) => {
    const level = skill.level;
    if (level >= 90) return 'Domínio expert e liderança técnica';
    if (level >= 80) return 'Conhecimento avançado e sólido';
    if (level >= 60) return 'Experiência intermediária consistente';
    return 'Conhecimento básico em desenvolvimento';
  };

  // Show top skills (level >= 70) for the portfolio
  const topSkills = skills
    .filter(s => s.level >= 70)
    .sort((a, b) => b.level - a.level)
    .slice(0, 6);

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
          {topSkills.map((s, i) => {
            const Icon = getCategoryIcon(s.category);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
              >
                <div className="mb-3 inline-flex rounded-md bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 p-2 text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white">{s.name}</h3>
                <p className="mt-1 text-sm text-white/60">{getSkillDescription(s)}</p>
                
                {/* Skill Level Bar */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                    />
                  </div>
                  <span className="text-xs text-white/50 font-mono">{s.level}%</span>
                </div>
                
                <div className="pointer-events-none absolute -right-12 -top-12 size-24 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:scale-125" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
