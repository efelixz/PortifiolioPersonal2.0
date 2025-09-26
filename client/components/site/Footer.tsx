import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60">
      <div className="container grid gap-6 py-10 md:grid-cols-3">
        <div>
          <div className="mb-3 inline-flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <span className="text-xs font-bold">JF</span>
            </div>
            <span className="text-sm font-semibold text-white/90">
              Jefferson Felix
            </span>
          </div>
          <p className="max-w-sm text-sm text-white/60">
            Construindo interfaces rápidas, escaláveis e com impacto real.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm text-white/70">
          <a href="home" className="hover:text-white">
            Home
          </a>
          <a href="projetos" className="hover:text-white">
            Projetos
          </a>
          <a href="sobre" className="hover:text-white">
            Sobre
          </a>
          <a href="contato" className="hover:text-white">
            Contato
          </a>
        </nav>
        <div className="flex items-center gap-3 md:justify-end">
          <a
            href="mailto:jeffersonfelixz@outlook.com"
            aria-label="Email"
            className="rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/efelixz"
            aria-label="GitHub"
            className="rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/jeffersonfelizz/"
            aria-label="LinkedIn"
            className="rounded-md p-2 text-white/70 hover:bg-white/5 hover:text-white"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Jefferson Felix. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
