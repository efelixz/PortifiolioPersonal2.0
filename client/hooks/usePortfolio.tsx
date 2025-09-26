import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  status: string;
  date: string;
  link?: string;
  github?: string;
  image?: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}

interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  refreshData: () => void;
}

const PortfolioContext = createContext<PortfolioData | undefined>(undefined);

interface PortfolioProviderProps {
  children: ReactNode;
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const loadData = () => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('dashboard_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Default projects if none exist
      setProjects([
        {
          id: 1,
          title: 'Sistema de Automação RPA',
          description: 'Automação de processos empresariais com tecnologias RPA, reduzindo 80% do tempo em tarefas repetitivas',
          tech: ['Python', 'Selenium', 'Pandas', 'API Integration'],
          status: 'Concluído',
          date: '2024-02-15',
          link: '',
          github: ''
        },
        {
          id: 2,
          title: 'Dashboard Analytics',
          description: 'Painel de controle para análise de dados em tempo real com visualizações interativas',
          tech: ['React', 'TypeScript', 'Chart.js', 'Node.js'],
          status: 'Concluído',
          date: '2024-01-20',
          link: '',
          github: ''
        },
        {
          id: 3,
          title: 'Portfolio Profissional',
          description: 'Site pessoal com dashboard administrativo completo e sistema de autenticação',
          tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
          status: 'Concluído',
          date: '2024-03-10',
          link: 'https://jeffersonfelix.dev',
          github: ''
        },
        {
          id: 4,
          title: 'Sistema de Gestão Empresarial',
          description: 'Aplicação web para gestão de processos internos e controle de qualidade',
          tech: ['React', 'Node.js', 'PostgreSQL', 'Express'],
          status: 'Em progresso',
          date: '2024-03-25',
          link: '',
          github: ''
        }
      ]);
    }

    // Load skills from localStorage
    const savedSkills = localStorage.getItem('dashboard_skills');
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    } else {
      // Default skills if none exist
      setSkills([
        { id: 1, name: 'JavaScript', category: 'Languages', level: 92 },
        { id: 2, name: 'React', category: 'Frontend', level: 88 },
        { id: 3, name: 'TypeScript', category: 'Languages', level: 85 },
        { id: 4, name: 'Python', category: 'Languages', level: 90 },
        { id: 5, name: 'Node.js', category: 'Backend', level: 80 },
        { id: 6, name: 'Tailwind CSS', category: 'Frontend', level: 85 },
        { id: 7, name: 'Selenium', category: 'Tools', level: 95 },
        { id: 8, name: 'RPA', category: 'Tools', level: 90 },
        { id: 9, name: 'Pandas', category: 'Tools', level: 88 },
        { id: 10, name: 'PostgreSQL', category: 'Database', level: 75 },
        { id: 11, name: 'MongoDB', category: 'Database', level: 70 },
        { id: 12, name: 'Git', category: 'Tools', level: 90 },
        { id: 13, name: 'API Integration', category: 'Backend', level: 85 },
        { id: 14, name: 'Data Analysis', category: 'Tools', level: 82 },
        { id: 15, name: 'Process Automation', category: 'Tools', level: 95 },
        { id: 16, name: 'Vite', category: 'Tools', level: 80 },
        { id: 17, name: 'Framer Motion', category: 'Frontend', level: 75 },
        { id: 18, name: 'Chart.js', category: 'Frontend', level: 78 }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  const value = {
    projects,
    skills,
    refreshData
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}