import { motion } from "framer-motion";
import { forwardRef } from "react";
import CardProjeto from "./CardProjeto";
import Skills from "./Skills";
import { Bot, Cog, Code2, Component, Cpu, Rocket } from "lucide-react";

interface HiringPackSectionProps {
  data: {
    name: string;
    role: string;
    skills: Array<{
      icon: React.ReactNode;
      label: string;
      level: number;
    }>;
    experience: string;
    projects: Array<{
      title: string;
      description: string;
      stack: string[];
      image: string;
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
  className?: string;
}

const HiringPackSection = forwardRef<HTMLDivElement, HiringPackSectionProps>(
  ({ data, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`hiring-pack-section bg-background text-foreground ${className}`}
        style={{
          minWidth: '800px',
          maxWidth: '800px',
          padding: '40px',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pb-8 border-b-2 border-primary"
        >
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            {data.name}
          </h1>
          <h2 className="text-xl text-primary font-semibold mb-4">
            {data.role}
          </h2>
          {data.contact && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{data.contact.email}</p>
              {data.contact.linkedin && <p>LinkedIn: {data.contact.linkedin}</p>}
              {data.contact.github && <p>GitHub: {data.contact.github}</p>}
            </div>
          )}
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-4">
            Habilidades Técnicas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.map((skill, index) => (
              <div
                key={skill.label}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
              >
                <div className="text-primary">{skill.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{skill.label}</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-1">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {skill.level}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-4">
            Experiência Profissional
          </h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              {data.experience}
            </p>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-foreground border-l-4 border-primary pl-4">
            Projetos em Destaque
          </h3>
          <div className="grid gap-6">
            {data.projects.map((project, index) => (
              <div
                key={project.title}
                className="border border-border rounded-xl p-6 bg-card"
              >
                <h4 className="text-lg font-bold mb-2 text-foreground">
                  {project.title}
                </h4>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {(project.caseUrl || project.codeUrl || project.demoUrl) && (
                  <div className="text-xs text-muted-foreground space-x-4">
                    {project.caseUrl && <span>📋 Case Study Disponível</span>}
                    {project.codeUrl && <span>💻 Código Disponível</span>}
                    {project.demoUrl && <span>🚀 Demo Disponível</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-8 border-t border-border"
        >
          <p className="text-xs text-muted-foreground">
            Gerado em {new Date().toLocaleDateString('pt-BR')} • Portfolio: jefferson.dev
          </p>
        </motion.div>
      </div>
    );
  }
);

HiringPackSection.displayName = "HiringPackSection";

export default HiringPackSection;