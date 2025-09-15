import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { generateHiringPack } from "@/utils/pdfGenerator";

export interface BotaoHiringPackProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onGenerate?: () => Promise<void>;
  label?: string;
  variant?: "hiring-pack" | "cv";
  data?: {
    name: string;
    role: string;
    skills: string[];
    experience: string;
    projects: Array<{
      title: string;
      description: string;
      tech: string[];
      image?: string;
      caseUrl?: string;
      codeUrl?: string;
      demoUrl?: string;
    }>;
    contact?: {
      email: string;
      linkedin?: string;
      github?: string;
    };
  };
}

export default function BotaoHiringPack({
  onGenerate,
  label,
  variant = "hiring-pack",
  data,
  className,
  ...props
}: BotaoHiringPackProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultData = {
    name: "Jefferson Felix",
    role: "Desenvolvedor Frontend & Automação",
    skills: [
      "React", "TypeScript", "Tailwind CSS", "Node.js", 
      "Next.js", "Vite", "Framer Motion", "IA Integration", 
      "RPA", "API Development", "Performance Optimization"
    ],
    experience: "Desenvolvedor especializado em React e TypeScript com foco em criar interfaces que combinam design excepcional com performance otimizada. Experiência em automação de processos e integração de IA em produtos digitais. Apaixonado por entregar soluções que não apenas funcionam bem, mas que também proporcionam experiências memoráveis aos usuários.",
    projects: [
      {
        title: "Dashboard SaaS Avançado",
        description: "Plataforma completa com visualizações em tempo real, sistema de autenticação, gerenciamento de usuários e integração com múltiplas APIs. Implementação de cache inteligente e otimizações de performance.",
        tech: ["React", "TypeScript", "Tailwind CSS", "React Query", "Recharts"],
        caseUrl: "#",
        codeUrl: "#",
        demoUrl: "#"
      },
      {
        title: "Sistema de Automação Inteligente",
        description: "Bots de scraping e automação de processos com IA integrada. Sistema de monitoramento em tempo real, alertas automáticos e relatórios detalhados. Redução de 80% no tempo de processamento manual.",
        tech: ["Node.js", "Python", "IA", "Automação", "APIs"],
        caseUrl: "#",
        codeUrl: "#"
      },
      {
        title: "Landing Page Interativa Premium",
        description: "Website com animações fluidas, otimização SEO avançada, sistema de analytics personalizado e integração com CRM. Performance score 98/100 no Lighthouse.",
        tech: ["React", "Framer Motion", "Vite", "SEO", "Analytics"],
        caseUrl: "#",
        demoUrl: "#"
      },
      {
        title: "E-commerce com IA",
        description: "Plataforma de e-commerce com recomendações personalizadas por IA, sistema de pagamentos integrado, gestão de estoque automatizada e dashboard administrativo completo.",
        tech: ["React", "TypeScript", "IA", "Stripe", "Node.js"],
        caseUrl: "#",
        codeUrl: "#",
        demoUrl: "#"
      }
    ],
    contact: {
      email: "contato@jefferson.dev",
      linkedin: "linkedin.com/in/jefferson-felix",
      github: "github.com/jefferson-felix"
    }
  };

  const finalData = data || defaultData;
  const finalLabel = label || (variant === "cv" ? "Baixar CV" : "Hiring Pack");

  const handleClick = async () => {
    try {
      setLoading(true);
      setError(null);

      // Track download attempt
      trackDownload(variant === "cv" ? "cv" : "hiring-pack", "pdf");

      if (onGenerate) {
        await onGenerate();
      } else {
        // Generate PDF using the data
        await generateHiringPack(finalData);
      }
    } catch (err) {
      console.error("Error generating PDF:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro ao gerar PDF";
      setError(errorMessage);
      
      // Track error
      trackError(new Error(errorMessage), "BotaoHiringPack");
      
      // Show error for 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className={cn(
            "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50",
            className,
          )}
          {...props}
        >
          <motion.div
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
            className="mr-2"
          >
            {variant === "cv" ? (
              <Download className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
          </motion.div>
          {loading ? "Gerando PDF..." : finalLabel}
        </Button>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-200 z-10"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}