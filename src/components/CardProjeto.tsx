import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProjetoProps {
  image: string;
  title: string;
  description: string;
  stack: string[];
  caseUrl?: string;
  codeUrl?: string;
  demoUrl?: string;
  className?: string;
}

const badgePalette: Record<string, string> = {
  React: "from-sky-500 to-cyan-500 text-white",
  TypeScript: "from-blue-600 to-indigo-600 text-white",
  Tailwind: "from-teal-500 to-emerald-500 text-white",
  "Node.js": "from-lime-500 to-green-600 text-slate-900",
  IA: "from-fuchsia-500 to-purple-600 text-white",
  Automação: "from-amber-400 to-orange-500 text-slate-900",
};

export function CardProjeto({
  image,
  title,
  description,
  stack,
  caseUrl = "#",
  codeUrl = "#",
  demoUrl,
  className,
}: CardProjetoProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 theme-card",
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span
              key={s}
              className={cn(
                "inline-flex items-center rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-semibold",
                badgePalette[s] ?? "from-indigo-500 to-fuchsia-500 text-white",
              )}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <motion.a
            href={caseUrl}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Ver Case
          </motion.a>
          <motion.a
            href={codeUrl}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 hover:shadow-md"
          >
            Ver Código
          </motion.a>
          {demoUrl && (
            <motion.a
              href={demoUrl}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 hover:shadow-md"
            >
              Abrir Demo
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default CardProjeto;