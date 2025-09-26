import { useCallback, useEffect } from "react";
import { Menu, X, Download, Settings, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { href: "/", label: "Home" },
  { href: "/projetos", label: "Projetos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true); // Status online simulado (true para online)
  const { user } = useAuth();
  
  // Simulação de alternar status online a cada 5 minutos (para demonstração)
  useEffect(() => {
    // Na prática, isso seria conectado a um serviço real de status/presença
    const interval = setInterval(() => {
      // Mantendo sempre online para fins de demonstração
      setIsOnline(true);
    }, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  const handleDownloadCV = useCallback(() => {
    // Verificar se existe um CV no localStorage
    const savedUrl = localStorage.getItem('cv_file_url');
    const savedFileName = localStorage.getItem('cv_file_name') || "Jefferson-Felix-CV.txt";
    
    if (savedUrl) {
      // Se tiver um CV armazenado, usar este arquivo
      const a = document.createElement("a");
      a.href = savedUrl;
      a.download = savedFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      // Caso contrário, usar o CV padrão
      const savedData = localStorage.getItem('cv_data');
      let content;
      
      if (savedData) {
        // Se tiver dados de CV no localStorage
        try {
          const cvData = JSON.parse(savedData);
          content = `CURRÍCULO - ${cvData.name}\n\n`;
          content += `Cargo: ${cvData.title}\n\n`;
          content += `Resumo: ${cvData.summary}\n\n`;
          
          content += 'HABILIDADES\n';
          cvData.skills.forEach((skill: string) => {
            content += `• ${skill}\n`;
          });
          content += '\n';
        } catch (e) {
          console.error('Erro ao carregar dados do CV:', e);
          content = `Currículo — Jefferson Felix\n\nCargo: Desenvolvedor Frontend & Automação\nStack: React, TypeScript, Tailwind, Node.js, RPA, IA\nResumo: Construindo interfaces rápidas, escaláveis e com impacto real.`;
        }
      } else {
        // Usar conteúdo padrão se não houver nada
        content = `Currículo — Jefferson Felix\n\nCargo: Desenvolvedor Frontend & Automação\nStack: React, TypeScript, Tailwind, Node.js, RPA, IA\nResumo: Construindo interfaces rápidas, escaláveis e com impacto real.`;
      }
      
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Jefferson-Felix-CV.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-slate-950/40">
      <div className="container flex h-16 items-center justify-between">
        <a href="#home" className="group flex items-center gap-3">
          <div className="relative grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-[0_0_40px_hsl(258_100%_60%/.6)]">
            <span className="text-sm font-bold tracking-wider">JF</span>
          </div>
          <span className="hidden text-sm font-semibold text-white/90 md:inline-block">
            Jefferson Felix
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {l.label}
              {l.label === "Contato" && (
                <div className="relative inline-flex ml-1.5">
                </div>
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Auth Actions */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 md:inline-flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Dashboard
              </Link>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-md border border-white/10">
                <User className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">{user.name}</span>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-md bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 md:inline-flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Login
            </Link>
          )}
          
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
                {l.label === "Contato" && (
                  <div className="relative inline-flex ml-1.5">
                    <MessageSquare className="w-3 h-3 text-white/70" />
                    <span className={`absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  </div>
                )}
              </a>
            ))}
            
            {/* Mobile Auth Actions */}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-purple-400 hover:bg-white/5 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Dashboard
                </Link>
                <div className="px-3 py-2 text-sm text-white/70 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-purple-400 hover:bg-white/5 flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            )}
            
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
