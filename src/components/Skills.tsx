import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface SkillItem {
  icon: ReactNode;
  label: string;
  level: number; // 0..100
}

export interface SkillsProps {
  title?: string;
  items: SkillItem[];
  className?: string;
}

export default function Skills({
  title = "Habilidades & Stack",
  items,
  className,
}: SkillsProps) {
  return (
    <section className={cn("relative py-10", className)}>
      <div className="container">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              className="rounded-xl border border-border bg-card p-5 backdrop-blur transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 theme-card"
            >
              <div className="mb-3 flex items-center gap-3 text-foreground">
                <div className="inline-flex rounded-md bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 p-2 ring-1 ring-inset ring-indigo-500/20">
                  {s.icon}
                </div>
                <span className="font-semibold">{s.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{
                    width: `${Math.min(100, Math.max(0, s.level))}%`,
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 1.2, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: i * 0.1 
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 shadow-sm"
                />
              </div>
              <div className="mt-2 text-right text-xs text-muted-foreground">
                {s.level}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}