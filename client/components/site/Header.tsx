import { useCallback } from "react";
import { Menu, X, Download } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "/projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const handleDownloadCV = useCallback(() => {
    const content = `Currículo — Jefferson Felix\n\nCargo: Desenvolvedor Frontend & Automação\nStack: React, TypeScript, Tailwind, Node.js, RPA, IA\nResumo: Construindo interfaces rápidas, escaláveis e com impacto real.`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Jefferson-Felix-CV.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
      <div className="container flex h-16 items-center justify-between">
        <a href="#home" className="group flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-[0_0_40px_hsl(258_100%_60%/.6)]">
            <span className="text-sm font-bold tracking-wider">JF</span>
          </div>
          <span className="hidden text-sm font-semibold text-white/90 md:inline-block">Jefferson Felix</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCV}
            className="hidden rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 md:inline-flex"
          >
            <Download className="mr-2 h-4 w-4" /> Baixar CV
          </button>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-slate-950/80 p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={handleDownloadCV}
              className="mt-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white"
            >
              <Download className="mr-2 inline h-4 w-4" /> Baixar CV
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
