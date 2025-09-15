import { motion } from "framer-motion";
import { Bot, Cog, Code2, Component, Cpu, Rocket, Download, Mail, Github, Linkedin } from "lucide-react";
import Skills from "@/components/Skills";
import BotaoHiringPack from "@/components/BotaoHiringPack";

const skillsData = [
  { icon: <Component className="h-5 w-5" />, label: "React", level: 95 },
  { icon: <Code2 className="h-5 w-5" />, label: "TypeScript", level: 90 },
  { icon: <Rocket className="h-5 w-5" />, label: "Tailwind CSS", level: 92 },
  { icon: <Cpu className="h-5 w-5" />, label: "Node.js", level: 85 },
  { icon: <Bot className="h-5 w-5" />, label: "IA & Automação", level: 80 },
  { icon: <Cog className="h-5 w-5" />, label: "DevOps", level: 75 },
];

const experiences = [
  {
    period: "2023 - Presente",
    role: "Desenvolvedor Frontend Senior",
    company: "Freelancer",
    description: "Desenvolvimento de aplicações React/TypeScript com foco em performance e UX. Automação de processos com IA e integração de APIs.",
  },
  {
    period: "2021 - 2023",
    role: "Desenvolvedor Full Stack",
    company: "Tech Startup",
    description: "Criação de dashboards SaaS, implementação de sistemas de pagamento e otimização de performance em aplicações web.",
  },
  {
    period: "2019 - 2021",
    role: "Desenvolvedor Frontend",
    company: "Agência Digital",
    description: "Desenvolvimento de landing pages e e-commerces responsivos. Implementação de animações e interações avançadas.",
  },
];

export default function Sobre() {
  const handleDownloadCV = () => {
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
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />
        <div className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display text-4xl font-extrabold text-foreground md:text-5xl">
              Sobre Mim
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Sou Jefferson Felix, desenvolvedor frontend especializado em React e TypeScript, 
              com paixão por criar interfaces que combinam design excepcional com performance otimizada. 
              Tenho experiência em automação de processos e integração de IA em produtos digitais.
            </p>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Meu foco está em entregar soluções que não apenas funcionam bem, mas que também 
              proporcionam experiências memoráveis aos usuários. Acredito que a tecnologia deve 
              ser uma ferramenta para resolver problemas reais e gerar impacto positivo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <BotaoHiringPack 
                variant="cv" 
                label="Baixar CV"
                data={{
                  name: "Jefferson Felix",
                  role: "Desenvolvedor Frontend & Automação",
                  skills: skillsData.map(s => s.label),
                  experience: "Desenvolvedor especializado em React e TypeScript com foco em criar interfaces que combinam design excepcional com performance otimizada. Experiência em automação de processos e integração de IA em produtos digitais.",
                  projects: [
                    {
                      title: "Dashboard SaaS Avançado",
                      description: "Plataforma completa com visualizações em tempo real usando React Query e Recharts.",
                      tech: ["React", "TypeScript", "Tailwind CSS"],
                    },
                    {
                      title: "Sistema de Automação",
                      description: "Bots de scraping e automação com IA integrada.",
                      tech: ["Node.js", "IA", "Automação"],
                    },
                    {
                      title: "Landing Page Premium",
                      description: "Website com animações fluidas e performance otimizada.",
                      tech: ["React", "Framer Motion", "Vite"],
                    }
                  ],
                  contact: {
                    email: "contato@jefferson.dev",
                    linkedin: "linkedin.com/in/jefferson-felix",
                    github: "github.com/jefferson-felix"
                  }
                }}
              />
              <BotaoHiringPack 
                label="Hiring Pack Completo"
                data={{
                  name: "Jefferson Felix",
                  role: "Desenvolvedor Frontend & Automação",
                  skills: skillsData.map(s => s.label),
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
                      description: "Bots de scraping e automação de processos com IA integrada. Sistema de monitoramento em tempo real, alertas automáticos e relatórios detalhados.",
                      tech: ["Node.js", "Python", "IA", "Automação", "APIs"],
                      caseUrl: "#",
                      codeUrl: "#"
                    },
                    {
                      title: "Landing Page Interativa Premium",
                      description: "Website com animações fluidas, otimização SEO avançada, sistema de analytics personalizado e integração com CRM.",
                      tech: ["React", "Framer Motion", "Vite", "SEO", "Analytics"],
                      caseUrl: "#",
                      demoUrl: "#"
                    },
                    {
                      title: "E-commerce com IA",
                      description: "Plataforma de e-commerce com recomendações personalizadas por IA, sistema de pagamentos integrado e gestão automatizada.",
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
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <Skills items={skillsData} className="py-20" />

      {/* Experience Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl mb-10">
              Experiência Profissional
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-8 border-l-2 border-indigo-500/20"
                >
                  <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"></div>
                  <div className="pb-8">
                    <span className="text-sm text-indigo-500 font-medium">{exp.period}</span>
                    <h3 className="text-xl font-semibold text-foreground mt-1">{exp.role}</h3>
                    <p className="text-muted-foreground font-medium">{exp.company}</p>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 p-10 text-center backdrop-blur"
          >
            <h3 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Vamos trabalhar juntos?
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Estou sempre aberto a novos desafios e oportunidades de colaboração.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <motion.a
                href="mailto:contato@jefferson.dev"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                <Mail className="h-4 w-4" />
                Enviar Email
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 hover:shadow-md"
              >
                <Github className="h-4 w-4" />
                GitHub
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all duration-200 hover:bg-secondary/80 hover:shadow-md"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}