import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { usePortfolio } from '@/hooks/usePortfolio';
import { Navigate } from 'react-router-dom';
import ProjectModal from '@/components/ProjectModal';
import SkillModal from '@/components/SkillModal';
import StudyScheduleModal from '@/components/StudyScheduleModal';
import { BackupManager } from '@/components/BackupManager';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { useMetricsIntegration } from '@/hooks/useMetrics';
import { AdvancedControlPanel } from '@/components/AdvancedControlPanel';
import { CVManager } from '@/components/CVManager';
import { AboutManager } from '@/components/AboutManager';
import { SkillsManager } from '@/components/SkillsManager';
import {
  LayoutDashboard,
  FolderOpen,
  Code,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Activity,
  BookOpen,
  FileText,
  Download,
  User,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { projects, skills, refreshData } = usePortfolio();
  const { withMetrics } = useMetricsIntegration();
  const [activeTab, setActiveTab] = useState('overview');

  // Modal states
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingSkill, setEditingSkill] = useState(null);
  const [loading, setLoading] = useState(false);

  // Study schedule state with localStorage persistence
  const [studySchedule, setStudySchedule] = useState(() => {
    const saved = localStorage.getItem('study_schedule');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default schedule
    return [
      {
        id: 1,
        time: "06:30",
        monday: "JavaScript Avançado",
        tuesday: "",
        wednesday: "JavaScript Avançado",
        thursday: "",
        friday: "JavaScript Avançado",
        saturday: "",
        sunday: ""
      },
      {
        id: 2,
        time: "07:30",
        monday: "",
        tuesday: "React.js",
        wednesday: "",
        thursday: "React.js",
        friday: "",
        saturday: "React.js",
        sunday: ""
      },
      {
        id: 3,
        time: "14:00",
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "",
        saturday: "Projetos Pessoais",
        sunday: "Projetos Pessoais"
      },
      {
        id: 4,
        time: "19:00",
        monday: "TypeScript",
        tuesday: "Node.js",
        wednesday: "Python & RPA",
        thursday: "Database Design",
        friday: "Automação",
        saturday: "",
        sunday: ""
      },
      {
        id: 5,
        time: "20:30",
        monday: "Inglês Técnico",
        tuesday: "Inglês Técnico",
        wednesday: "Inglês Técnico",
        thursday: "Inglês Técnico",
        friday: "Inglês Técnico",
        saturday: "",
        sunday: ""
      },
      {
        id: 6,
        time: "21:30",
        monday: "",
        tuesday: "",
        wednesday: "",
        thursday: "",
        friday: "Revisão Semanal",
        saturday: "",
        sunday: "Planejamento"
      }
    ];
  });

  const days = [
    { key: "monday", label: "Segunda" },
    { key: "tuesday", label: "Terça" },
    { key: "wednesday", label: "Quarta" },
    { key: "thursday", label: "Quinta" },
    { key: "friday", label: "Sexta" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" }
  ];

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      "JavaScript": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      "React.js": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "React Native": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      "Ciber Segurança": "bg-red-500/20 text-red-300 border-red-500/30",
      "Ciência de Dados": "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "Automação": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      "Polícia Militar": "bg-slate-500/20 text-slate-300 border-slate-500/30",
    };
    return colors[subject] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Project CRUD functions
  const handleSaveProject = withMetrics(async (projectData: any) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentProjects = JSON.parse(localStorage.getItem('dashboard_projects') || '[]');
    
    if (editingProject) {
      // Update existing project
      const updatedProjects = currentProjects.map((p: any) => 
        p.id === editingProject.id 
          ? { ...projectData, id: editingProject.id }
          : p
      );
      localStorage.setItem('dashboard_projects', JSON.stringify(updatedProjects));
    } else {
      // Add new project
      const newProject = {
        ...projectData,
        id: Date.now() // Simple ID generation
      };
      const updatedProjects = [...currentProjects, newProject];
      localStorage.setItem('dashboard_projects', JSON.stringify(updatedProjects));
    }
    
    refreshData(); // Refresh the portfolio data
    setLoading(false);
    setProjectModalOpen(false);
    setEditingProject(null);
  }, 'project');

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const handleDeleteProject = (projectId: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      const currentProjects = JSON.parse(localStorage.getItem('dashboard_projects') || '[]');
      const updatedProjects = currentProjects.filter((p: any) => p.id !== projectId);
      localStorage.setItem('dashboard_projects', JSON.stringify(updatedProjects));
      refreshData(); // Refresh the portfolio data
    }
  };

  // Skill CRUD functions
  const handleSaveSkill = withMetrics(async (skillData: any) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentSkills = JSON.parse(localStorage.getItem('dashboard_skills') || '[]');
    
    if (editingSkill) {
      // Update existing skill
      const updatedSkills = currentSkills.map((s: any) => 
        s.id === editingSkill.id 
          ? { ...skillData, id: editingSkill.id }
          : s
      );
      localStorage.setItem('dashboard_skills', JSON.stringify(updatedSkills));
    } else {
      // Add new skill
      const newSkill = {
        ...skillData,
        id: Date.now() // Simple ID generation
      };
      const updatedSkills = [...currentSkills, newSkill];
      localStorage.setItem('dashboard_skills', JSON.stringify(updatedSkills));
    }
    
    refreshData(); // Refresh the portfolio data
    setLoading(false);
    setSkillModalOpen(false);
    setEditingSkill(null);
  }, 'skill');

  const handleEditSkill = (skill: any) => {
    setEditingSkill(skill);
    setSkillModalOpen(true);
  };

  const handleDeleteSkill = (skillId: number) => {
    if (confirm('Tem certeza que deseja excluir esta habilidade?')) {
      const currentSkills = JSON.parse(localStorage.getItem('dashboard_skills') || '[]');
      const updatedSkills = currentSkills.filter((s: any) => s.id !== skillId);
      localStorage.setItem('dashboard_skills', JSON.stringify(updatedSkills));
      refreshData(); // Refresh the portfolio data
    }
  };

  const handleSaveSchedule = (schedule: any[]) => {
    setLoading(true);
    try {
      localStorage.setItem('study_schedule', JSON.stringify(schedule));
      setStudySchedule(schedule);
    } catch (error) {
      console.error('Erro ao salvar cronograma:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const sidebarItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'skills', label: 'Habilidades', icon: Code },
    { id: 'studies', label: 'Estudos', icon: BookOpen },
    { id: 'cv', label: 'Currículo', icon: FileText },
    { id: 'about', label: 'Sobre Mim', icon: User },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const stats = [
    { label: 'Projetos', value: projects.length, color: 'from-blue-500 to-cyan-500' },
    { label: 'Tecnologias', value: skills.length, color: 'from-purple-500 to-pink-500' },
    { label: 'Horários Estudo', value: studySchedule.length, color: 'from-green-500 to-emerald-500' },
    { label: 'Atividades/Semana', value: studySchedule.reduce((acc, slot) => {
      const activeDays = [slot.monday, slot.tuesday, slot.wednesday, slot.thursday, slot.friday, slot.saturday, slot.sunday].filter(Boolean).length;
      return acc + activeDays;
    }, 0), color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 min-h-screen bg-slate-800 border-r border-slate-700"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <div>
                <h2 className="font-semibold">{user.name}</h2>
                <p className="text-sm text-gray-400">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Logout */}
          <div className="absolute bottom-4 left-4 right-4">
            <motion.button
              onClick={handleLogout}
              whileHover={{ x: 4 }}
              className=" flex items-center space-x-2 p-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut size={10} />
              <span>Sair</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-slate-800 border-b border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">
                  Último acesso: Hoje, 14:30
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Métricas de Produtividade */}
                <MetricsDashboard />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <Activity className="text-white" size={24} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Projects */}
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      Projetos Recentes
                    </h3>
                    <div className="space-y-3">
                      {projects.slice(0, 4).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              project.status === 'Concluído' ? 'bg-green-500' :
                              project.status === 'Em progresso' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`} />
                            <div>
                              <p className="font-medium text-sm">{project.title}</p>
                              <p className="text-xs text-gray-400">{project.status}</p>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(project.date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ))}
                      {projects.length === 0 && (
                        <p className="text-gray-400 text-sm">Nenhum projeto criado ainda</p>
                      )}
                    </div>
                  </div>

                  {/* Top Skills */}
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Principais Habilidades
                    </h3>
                    <div className="space-y-3">
                      {skills
                        .sort((a, b) => b.level - a.level)
                        .slice(0, 4)
                        .map((skill) => (
                          <div key={skill.id} className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-xs text-gray-400">{skill.level}%</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-1.5">
                                <div 
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      {skills.length === 0 && (
                        <p className="text-gray-400 text-sm">Nenhuma habilidade cadastrada ainda</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Cronograma de Hoje ({new Date().toLocaleDateString('pt-BR', { weekday: 'long' })})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(() => {
                      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
                      const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                      const todayKey = dayMap[today];
                      
                      const todaySchedule = studySchedule
                        .filter(slot => slot[todayKey as keyof typeof slot] && slot[todayKey as keyof typeof slot] !== '')
                        .sort((a, b) => a.time.localeCompare(b.time));

                      return todaySchedule.length > 0 ? (
                        todaySchedule.map((slot) => (
                          <div key={slot.id} className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-purple-400 font-mono text-sm">{slot.time}</span>
                              <span className="text-xs text-gray-400">
                                {(() => {
                                  const now = new Date();
                                  const [hours, minutes] = slot.time.split(':').map(Number);
                                  const slotTime = new Date();
                                  slotTime.setHours(hours, minutes, 0, 0);
                                  
                                  if (slotTime > now) {
                                    const diff = Math.ceil((slotTime.getTime() - now.getTime()) / (1000 * 60 * 60));
                                    return diff === 1 ? 'em 1h' : `em ${diff}h`;
                                  } else {
                                    return 'concluído';
                                  }
                                })()}
                              </span>
                            </div>
                            <p className="text-white text-sm font-medium">
                              {slot[todayKey as keyof typeof slot] as string}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <p className="text-gray-400">Nenhum estudo programado para hoje</p>
                          <p className="text-gray-500 text-sm mt-1">Aproveite para descansar ou estudar algo livre!</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Meus Projetos</h2>
                  <motion.button
                    onClick={() => setProjectModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                    <span>Novo Projeto</span>
                  </motion.button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-purple-500 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold">{project.title}</h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditProject(project)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Editar projeto"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            title="Excluir projeto"
                          >
                            <Trash2 size={16} />
                          </button>
                          {project.link && (
                            <button 
                              onClick={() => window.open(project.link, '_blank')}
                              className="text-gray-400 hover:text-white transition-colors"
                              title="Ver projeto"
                            >
                              <ExternalLink size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'Concluído' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-orange-600/20 text-orange-400'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-gray-400">
                          {new Date(project.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Habilidades</h2>
                  <motion.button
                    onClick={() => setSkillModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                    <span>Nova Habilidade</span>
                  </motion.button>
                </div>

                {/* Skills List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-800 rounded-lg p-6 border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{skill.name}</h3>
                          <p className="text-sm text-gray-400">{skill.category}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditSkill(skill)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Editar habilidade"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            title="Excluir habilidade"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Nível</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'studies' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Cronograma de Estudos</h2>
                  <motion.button
                    onClick={() => setScheduleModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Settings size={20} />
                    <span>Gerenciar Cronograma</span>
                  </motion.button>
                </div>

                {/* Study Schedule Table */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700 bg-slate-700/50">
                          <th className="text-left p-4 text-white font-semibold min-w-[80px]">Horário</th>
                          {days.map((day) => (
                            <th key={day.key} className="text-left p-4 text-white font-semibold min-w-[120px]">
                              {day.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {studySchedule.map((slot, index) => (
                          <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                            <td className="p-4 text-white/80 font-mono text-sm font-medium">
                              {slot.time}
                            </td>
                            {days.map((day) => {
                              const subject = slot[day.key as keyof typeof slot] as string;
                              return (
                                <td key={day.key} className="p-3">
                                  {subject ? (
                                    <div className={`px-3 py-2 rounded-lg border text-xs font-medium text-center ${getSubjectColor(subject)} hover:scale-105 transition-transform cursor-pointer`}>
                                      {subject}
                                    </div>
                                  ) : (
                                    <div className="px-3 py-2 text-xs text-slate-500 text-center">
                                      -
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Study Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                      📊 Estatísticas
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Horas/semana:</span>
                        <span className="text-white font-medium">~25h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Matérias ativas:</span>
                        <span className="text-white font-medium">7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dias de estudo:</span>
                        <span className="text-white font-medium">7/7</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                      🎯 Foco Principal
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-slate-300 text-sm">JavaScript & React</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-slate-300 text-sm">Ciber Segurança</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                        <span className="text-slate-300 text-sm">Polícia Militar</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                      ⏰ Horários
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="text-slate-400">Manhã: <span className="text-white">07:00 - 11:40</span></div>
                      <div className="text-slate-400">Tarde: <span className="text-white">16:30 - 18:10</span></div>
                      <div className="text-slate-400">Noite: <span className="text-white">19:00 - 22:20</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'cv' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Gerenciador de Currículo</h2>
                </div>
                <CVManager />
              </motion.div>
            )}
            
            {activeTab === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Gerenciador da Página "Sobre Mim"</h2>
                  <a 
                    href="/about" 
                    target="_blank" 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink size={16} />
                    Ver página
                  </a>
                </div>
                <AboutManager />
              </motion.div>
            )}

            {activeTab === 'skillsmanager' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Gerenciador Avançado de Skills</h2>
                  <a 
                    href="/skills" 
                    target="_blank" 
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                  >
                    <ExternalLink size={16} />
                    Ver página de skills
                  </a>
                </div>
                <SkillsManager />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Backup Manager */}
                <BackupManager />

                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold mb-4">Configurações da Conta</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        readOnly
                      />
                    </div>
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Salvar Alterações
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Painel de Controle Avançado integrado à área de configurações */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Painel de Controle Avançado</h3>
                  <AdvancedControlPanel inDashboard={true} className="w-full" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
        loading={loading}
      />

      <SkillModal
        isOpen={skillModalOpen}
        onClose={() => {
          setSkillModalOpen(false);
          setEditingSkill(null);
        }}
        onSave={handleSaveSkill}
        skill={editingSkill}
        loading={loading}
      />

      <StudyScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSave={handleSaveSchedule}
        schedule={studySchedule}
        loading={loading}
      />
    </div>
  );
}