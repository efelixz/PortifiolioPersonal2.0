import { motion } from "framer-motion";
import { Github, Linkedin, Mail, PhoneCall, Calendar } from "lucide-react";
import Particles from "@/components/visual/Particles";

export default function ContactPage() {
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Contato enviado:", data);
    form.reset();
    alert("Mensagem registrada! Integraremos EmailJS depois.");
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 animated-gradient" />
        <Particles className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full" />
        <div className="container py-16">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl font-extrabold md:text-4xl"
          >
            Vamos conversar?
          </motion.h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Fale sobre seu projeto, prazo e objetivos. Responderei rapidamente.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-12">
        <div className="container grid gap-6 md:grid-cols-3">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nome"
                      className="mb-1 block text-sm text-white/80"
                    >
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      className="w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-500"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm text-white/80"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-500"
                      placeholder="voce@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="mensagem"
                    className="mb-1 block text-sm text-white/80"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    className="h-32 w-full resize-none rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-500"
                    placeholder="Conte um pouco sobre o projeto"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
                >
                  Enviar Mensagem
                </button>
              </form>

              {/* Ações rápidas */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  <Linkedin className="mr-2 inline h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="#"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  <Github className="mr-2 inline h-4 w-4" /> GitHub
                </a>
                <a
                  href="mailto:contato@jefferson.dev"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  <Mail className="mr-2 inline h-4 w-4" /> Email
                </a>
                <a
                  href="#"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  <PhoneCall className="mr-2 inline h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Lateral */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold">Agenda aberta</h3>
              <p className="mt-1 text-sm text-white/70">
                Marque uma conversa rápida para falarmos sobre sua ideia e
                próximos passos.
              </p>
              <a
                href="https://calendly.com/"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                <Calendar className="h-4 w-4" /> Agendar Reunião
              </a>
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}
