import { useCallback } from "react";
import { Menu, X, Download } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/demos", label: "Demos" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-[0_0_40px_hsl(258_100%_60%/.6)]">
            <span className="text-sm font-bold tracking-wider">JF</span>
          </div>
          <span className="hidden text-sm font-semibold text-foreground md:inline-block">
            Jefferson Felix
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-foreground ${
                location.pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="dropdown" size="sm" />
          
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Button
              onClick={handleDownloadCV}
              className="hidden bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/30 md:inline-flex"
            >
              <Download className="mr-2 h-4 w-4" /> Baixar CV
            </Button>
          </motion.div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/80 p-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent ${
                  location.pathname === link.href
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button
                onClick={handleDownloadCV}
                className="mt-2 w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                <Download className="mr-2 h-4 w-4" /> Baixar CV
              </Button>
            </motion.div>
          </nav>
        </div>
      )}
    </header>
  );
}