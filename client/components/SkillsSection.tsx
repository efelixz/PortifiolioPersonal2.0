import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface SkillItem {
  icon: ReactNode;
  label: string;
  level: number; // 0..100
}

export interface SkillsSectionProps {
  title?: string;
  items: SkillItem[];
  className?: string;
}

export default function SkillsSection({
  title = "Habilidades & Stack",
  items,
  className,
}: SkillsSectionProps) {
  return (
    <section className={cn("relative py-10", className)}>
      <div className="container">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <div className="mb-3 flex items-center gap-3 text-white">
                <div className="inline-flex rounded-md bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 p-2 ring-1 ring-inset ring-indigo-500/20">
                  {s.icon}
                </div>
                <span className="font-semibold">{s.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.min(100, Math.max(0, s.level))}%`,
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                />
              </div>
              <div className="mt-2 text-right text-xs text-white/70">
                {s.level}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
