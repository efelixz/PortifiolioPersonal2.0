import { motion } from "framer-motion";
import Avatar3D from "@/components/Avatar3D";

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden pt-28">
      <div className="absolute inset-0 -z-10 animated-gradient" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-20%,hsl(220_90%_60%/.25),transparent_70%)]" />
      <div className="container grid items-center gap-10 pb-24 md:grid-cols-2 md:gap-14">
        <div className="space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur"
          >
            Disponível para novos projetos
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-tight text-white md:text-6xl"
          >
            Jefferson Felix — Desenvolvedor Frontend & Automação
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-xl text-lg text-white/70 md:text-xl"
          >
            Construindo interfaces rápidas, escaláveis e com impacto real.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#projetos"
              className="group rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
            >
              Ver Projetos
            </a>
            <a
              href="#contato"
              className="rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 hover:text-white"
            >
              Entrar em Contato
            </a>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center"
        >
          <Avatar3D />
        </motion.div>
      </div>
    </section>
  );
}
