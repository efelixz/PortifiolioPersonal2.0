import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  FolderOpen,
  Award,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useMetrics } from '../hooks/useMetrics';

interface MetricsDashboardProps {
  className?: string;
}

export function MetricsDashboard({ className = '' }: MetricsDashboardProps) {
  const { 
    todayMetrics, 
    weekMetrics, 
    getProductivityScore, 
    recordActivity,
    resetMetrics,
    isLoading 
  } = useMetrics();

  const productivityScore = getProductivityScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente!';
    if (score >= 60) return 'Bom ritmo';
    if (score >= 40) return 'Pode melhorar';
    return 'Vamos lá!';
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const todayStats = [
    {
      icon: FolderOpen,
      label: 'Projetos',
      value: todayMetrics.projectsWorked,
      color: 'bg-blue-500',
      action: () => recordActivity('project')
    },
    {
      icon: Clock,
      label: 'Horas de Estudo',
      value: todayMetrics.hoursStudied,
      color: 'bg-green-500',
      suffix: 'h',
      action: () => recordActivity('study', 0.5)
    },
    {
      icon: BookOpen,
      label: 'Novas Habilidades',
      value: todayMetrics.skillsLearned,
      color: 'bg-purple-500',
      action: () => recordActivity('skill')
    },
    {
      icon: CheckCircle,
      label: 'Tarefas Concluídas',
      value: todayMetrics.tasksCompleted,
      color: 'bg-orange-500',
      action: () => recordActivity('task')
    },
  ];

  const weekStats = [
    {
      label: 'Projetos Trabalhados',
      total: weekMetrics.totalProjects,
      average: weekMetrics.averageDaily.projects,
      icon: FolderOpen,
      color: 'text-blue-600'
    },
    {
      label: 'Horas de Estudo',
      total: weekMetrics.totalHours,
      average: weekMetrics.averageDaily.hours,
      icon: Clock,
      color: 'text-green-600',
      suffix: 'h'
    },
    {
      label: 'Habilidades Aprendidas',
      total: weekMetrics.totalSkills,
      average: weekMetrics.averageDaily.skills,
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      label: 'Tarefas Completadas',
      total: weekMetrics.totalTasks,
      average: weekMetrics.averageDaily.tasks,
      icon: CheckCircle,
      color: 'text-orange-600'
    },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Métricas de Produtividade
        </h2>
      </div>

      {/* Score de Produtividade */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Score da Semana
            </h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${getScoreColor(productivityScore)}`}>
                {productivityScore}
              </span>
              <span className="text-sm text-gray-500">/100</span>
            </div>
            <p className={`text-sm font-medium ${getScoreColor(productivityScore)}`}>
              {getScoreLabel(productivityScore)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Award className={`w-8 h-8 ${getScoreColor(productivityScore)}`} />
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Métricas de Hoje */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Hoje
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {todayStats.map((stat, index) => (
            <motion.button
              key={stat.label}
              onClick={stat.action}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <stat.icon className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}{stat.suffix || ''}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Clique nos cards para registrar atividades rapidamente
        </p>
      </div>

      {/* Métricas da Semana */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Últimos 7 Dias
        </h3>
        <div className="space-y-3">
          {weekStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {stat.label}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.total}{stat.suffix || ''}
                </div>
                <div className="text-xs text-gray-500">
                  Média: {stat.average}{stat.suffix || ''}/dia
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dicas de Produtividade */}
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
          🎯 Dica de Produtividade
        </h4>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          {getProductivityTip(productivityScore)}
        </p>
      </div>
      
      {/* Botão para Resetar Métricas */}
      <div className="mt-4 flex justify-end">
        <button 
          onClick={() => {
            if (confirm('Tem certeza que deseja resetar todas as métricas? Esta ação não pode ser desfeita.')) {
              resetMetrics();
            }
          }}
          className="px-3 py-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded border border-red-200 dark:border-red-800 transition-colors"
        >
          Resetar Métricas
        </button>
      </div>
    </div>
  );
}

function getProductivityTip(score: number): string {
  if (score >= 80) {
    return "Excelente ritmo! Continue mantendo essa consistência e considere documentar suas melhores práticas.";
  }
  if (score >= 60) {
    return "Bom progresso! Tente estabelecer pequenas metas diárias para manter o momentum.";
  }
  if (score >= 40) {
    return "Foque em uma atividade por vez. Pequenos passos consistentes geram grandes resultados.";
  }
  return "Comece devagar! Defina uma meta pequena para hoje e celebre cada conquista.";
}