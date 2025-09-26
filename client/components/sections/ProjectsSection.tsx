import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Dashboard",
    description: "Dashboard completo para e-commerce com analytics em tempo real, gestão de produtos e vendas.",
    image: "/placeholder.svg",
    technologies: ["React", "TypeScript", "Tailwind", "Chart.js"],
    demoUrl: "#",
    githubUrl: "#",
    featured: true
  },
  {
    id: 2,
    title: "Task Manager App",
    description: "Aplicativo de gerenciamento de tarefas com drag & drop, filtros avançados e colaboração em tempo real.",
    image: "/placeholder.svg",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Socket.io"],
    demoUrl: "#",
    githubUrl: "#",
    featured: true
  },
  {
    id: 3,
    title: "Weather Forecast",
    description: "App de previsão do tempo com geolocalização, múltiplas cidades e gráficos interativos.",
    image: "/placeholder.svg",
    technologies: ["React", "API Integration", "Charts"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Website portfolio responsivo com animações, dark mode e otimizações de performance.",
    image: "/placeholder.svg",
    technologies: ["React", "Framer Motion", "TypeScript"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 5,
    title: "Chat Application",
    description: "Aplicativo de chat em tempo real com salas, emojis, compartilhamento de arquivos.",
    image: "/placeholder.svg",
    technologies: ["Socket.io", "Node.js", "MongoDB"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 6,
    title: "Finance Tracker",
    description: "Aplicativo para controle financeiro pessoal com categorização automática e relatórios.",
    image: "/placeholder.svg",
    technologies: ["React Native", "Firebase", "Charts"],
    demoUrl: "#",
    githubUrl: "#"
  }
];

const techColors: Record<string, string> = {
  React: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  TypeScript: "bg-blue-600/20 text-blue-400 border-blue-600/30",
  "Next.js": "bg-gray-500/20 text-gray-300 border-gray-500/30",
  Tailwind: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Node.js": "bg-green-500/20 text-green-300 border-green-500/30",
  MongoDB: "bg-green-600/20 text-green-400 border-green-600/30",
  PostgreSQL: "bg-blue-700/20 text-blue-400 border-blue-700/30",
  "Socket.io": "bg-gray-600/20 text-gray-300 border-gray-600/30",
  Firebase: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Prisma: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Chart.js": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Charts: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "API Integration": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Framer Motion": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  "React Native": "bg-blue-400/20 text-blue-300 border-blue-400/30"
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 ${
        project.featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <motion.img
          src={project.image}
          alt={project.title}
          className="w-full h-48 md:h-56 object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-4"
        >
          {project.demoUrl && (
            <motion.a
              href={project.demoUrl}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: isHovered ? 1 : 0, 
                rotate: isHovered ? 0 : -180 
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <Eye size={20} className="text-white" />
            </motion.a>
          )}
          
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              initial={{ scale: 0, rotate: 180 }}
              animate={{ 
                scale: isHovered ? 1 : 0, 
                rotate: isHovered ? 0 : 180 
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            >
              <Github size={20} className="text-white" />
            </motion.a>
          )}
        </motion.div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
              Destaque
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 text-xs font-medium rounded-md border ${
                techColors[tech] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex space-x-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              className="flex items-center space-x-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ExternalLink size={16} />
              <span>Demo</span>
            </a>
          )}
          
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Github size={16} />
              <span>Código</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-slate-900/50 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Meus 
            </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Projetos
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Alguns dos projetos que desenvolvi, cada um com seus desafios únicos e soluções criativas
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            Ver Todos os Projetos
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-32 right-10 w-4 h-4 bg-purple-400 rounded-full opacity-30"
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-20 w-6 h-6 bg-pink-400 rounded-full opacity-20"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </section>
  );
}