// Exemplo de integração completa dos sistemas Mobile, SEO e Temas 2.0

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme2';
import { useSEO, usePageSEO, useCoreWebVitals } from './hooks/SEOHelper';
import { useGestures } from './hooks/useMobileGestures';
import { useIntersectionAnimation, useParallax } from './hooks/useMobileAnimations';
import { MobileNavigation } from './components/MobileNavigation';
import { ThemeToggleButton } from './components/ThemeToggleButton';
import './styles/mobile.css';
import './styles/themes.css';

// Componente principal da aplicação
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  // SEO para página atual
  usePageSEO();
  
  // Core Web Vitals monitoring
  const vitals = useCoreWebVitals();

  // Log performance metrics
  React.useEffect(() => {
    console.log('Core Web Vitals:', vitals);
  }, [vitals]);

  return (
    <div className="min-h-screen theme-bg-background theme-text-primary">
      {/* Navigation Mobile */}
      <MobileNavigation />
      
      {/* Conteúdo principal */}
      <main className="pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/projetos" element={<ProjectsPage />} />
          <Route path="/contato" element={<ContactPage />} />
        </Routes>
      </main>
      
      {/* Theme Toggle Button */}
      <ThemeToggleButton />
    </div>
  );
}

// Exemplo de página com integração completa
function HomePage() {
  const elementRef = React.useRef<HTMLDivElement>(null);
  
  // SEO específico da página
  useSEO({
    title: 'Home - Jefferson Araújo',
    description: 'Desenvolvedor Full Stack especializado em React, Node.js e tecnologias modernas.',
    keywords: ['desenvolvedor', 'full stack', 'react', 'nodejs']
  });

  // Mobile gestures para interações
  const gestures = useGestures(elementRef);
  
  // Animações mobile
  const animateOnScroll = useIntersectionAnimation();
  const parallaxRef = useParallax();

  return (
    <div className="space-y-8" ref={elementRef}>
      {/* Hero Section com Parallax */}
      <section 
        ref={parallaxRef.elementRef}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div 
          className="theme-gradient absolute inset-0 opacity-10"
          style={{ transform: 'translateY(var(--parallax-y, 0px))' }}
        />
        
        <div className="text-center z-10 space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl font-bold theme-text-primary">
            Jefferson Araújo
          </h1>
          
          <p className="text-xl md:text-2xl theme-text-secondary max-w-2xl mx-auto">
            Desenvolvedor Full Stack especializado em tecnologias modernas
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="theme-button">
              Ver Projetos
            </button>
            <button className="theme-button secondary">
              Entre em Contato
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section com Mobile Gestures */}
      <section className="theme-container py-16">
        <h2 className="text-3xl font-bold text-center mb-12 theme-text-primary">
          Habilidades
        </h2>
        
        <div className="theme-grid">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="theme-card"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg theme-gradient flex items-center justify-center">
                  <span className="text-2xl">{skill.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold theme-text-primary">
                    {skill.name}
                  </h3>
                  <p className="text-sm theme-text-secondary">
                    {skill.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="theme-text-secondary">Proficiência</span>
                  <span className="theme-text-primary">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full theme-bg-primary"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="theme-container py-16">
        <h2 className="text-3xl font-bold text-center mb-12 theme-text-primary">
          Projetos em Destaque
        </h2>
        
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="theme-card"
            >
              <div className="md:flex space-y-4 md:space-y-0 md:space-x-6">
                <div className="md:w-1/3">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <h3 className="text-xl font-semibold theme-text-primary">
                    {project.title}
                  </h3>
                  <p className="theme-text-secondary">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <a 
                      href={project.demo} 
                      className="theme-button"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Demo
                    </a>
                    <a 
                      href={project.github} 
                      className="theme-button secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Dados de exemplo
const skills = [
  {
    name: 'React',
    description: 'Desenvolvimento de interfaces modernas',
    level: 95,
    icon: '⚛️'
  },
  {
    name: 'Node.js',
    description: 'APIs e backend development',
    level: 90,
    icon: '🟢'
  },
  {
    name: 'TypeScript',
    description: 'JavaScript tipado e escalável',
    level: 88,
    icon: '🔷'
  },
  {
    name: 'Mobile',
    description: 'Desenvolvimento mobile responsivo',
    level: 85,
    icon: '📱'
  }
];

const projects = [
  {
    id: 1,
    title: 'Portfolio 2.0',
    description: 'Portfolio pessoal com sistema de temas, otimização mobile e SEO avançado.',
    image: '/images/project1.jpg',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    demo: 'https://demo.com',
    github: 'https://github.com/user/project'
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    description: 'Plataforma completa de e-commerce com painel administrativo.',
    image: '/images/project2.jpg',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    demo: 'https://demo.com',
    github: 'https://github.com/user/project'
  }
];

// Páginas adicionais (simplificadas)
function AboutPage() {
  useSEO({
    title: 'Sobre - Jefferson Araújo',
    description: 'Conheça mais sobre Jefferson Araújo, desenvolvedor full stack.',
    type: 'profile'
  });

  return (
    <div className="theme-container py-16">
      <h1 className="text-4xl font-bold theme-text-primary mb-8">Sobre Mim</h1>
      <p className="theme-text-secondary text-lg">
        Desenvolvedor apaixonado por tecnologia e inovação...
      </p>
    </div>
  );
}

function ProjectsPage() {
  useSEO({
    title: 'Projetos - Jefferson Araújo',
    description: 'Confira os projetos desenvolvidos por Jefferson Araújo.',
  });

  return (
    <div className="theme-container py-16">
      <h1 className="text-4xl font-bold theme-text-primary mb-8">Projetos</h1>
      <p className="theme-text-secondary text-lg">
        Aqui estão alguns dos meus projetos...
      </p>
    </div>
  );
}

function ContactPage() {
  useSEO({
    title: 'Contato - Jefferson Araújo',
    description: 'Entre em contato com Jefferson Araújo.',
  });

  return (
    <div className="theme-container py-16">
      <h1 className="text-4xl font-bold theme-text-primary mb-8">Contato</h1>
      <p className="theme-text-secondary text-lg">
        Vamos conversar sobre seu próximo projeto...
      </p>
    </div>
  );
}

export default App;