import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
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

export function ProjectCard({ image, title, description, stack, caseUrl = "#", codeUrl = "#", demoUrl, className }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn("group overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur", className)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/70">{description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className={cn("inline-flex items-center rounded-full bg-gradient-to-r px-2.5 py-1 text-xs font-semibold", badgePalette[s] ?? "from-indigo-500 to-fuchsia-500 text-white")}> {s} </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={caseUrl} className="rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">Ver Case</a>
          <a href={codeUrl} className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white">Ver Código</a>
          {demoUrl && (
            <a href={demoUrl} className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 hover:text-white">Abrir Demo</a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
