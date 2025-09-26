import { useState, useEffect } from 'react';

export interface MetricData {
  date: string;
  projectsWorked: number;
  hoursStudied: number;
  skillsLearned: number;
  tasksCompleted: number;
}

interface UseMetricsReturn {
  metrics: MetricData[];
  todayMetrics: MetricData;
  weekMetrics: {
    totalProjects: number;
    totalHours: number;
    totalSkills: number;
    totalTasks: number;
    averageDaily: {
      projects: number;
      hours: number;
      skills: number;
      tasks: number;
    };
  };
  recordActivity: (type: 'project' | 'study' | 'skill' | 'task', amount?: number) => void;
  getProductivityScore: () => number;
  resetMetrics: () => void;
  isLoading: boolean;
}

const METRICS_STORAGE_KEY = 'productivity_metrics';

export function useMetrics(): UseMetricsReturn {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar métricas do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(METRICS_STORAGE_KEY);
      if (stored) {
        const parsedMetrics = JSON.parse(stored);
        setMetrics(parsedMetrics);
      }
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Salvar métricas no localStorage sempre que mudarem
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(metrics));
    }
  }, [metrics, isLoading]);

  // Obter métricas de hoje
  const todayMetrics = getTodayMetrics(metrics);

  // Calcular métricas da semana
  const weekMetrics = getWeekMetrics(metrics);

  // Registrar atividade
  const recordActivity = (type: 'project' | 'study' | 'skill' | 'task', amount: number = 1) => {
    const today = new Date().toISOString().split('T')[0];
    
    setMetrics(prevMetrics => {
      const existingIndex = prevMetrics.findIndex(m => m.date === today);
      
      if (existingIndex >= 0) {
        // Atualizar métricas existentes
        const updated = [...prevMetrics];
        const existing = updated[existingIndex];
        
        switch (type) {
          case 'project':
            existing.projectsWorked += amount;
            break;
          case 'study':
            existing.hoursStudied += amount;
            break;
          case 'skill':
            existing.skillsLearned += amount;
            break;
          case 'task':
            existing.tasksCompleted += amount;
            break;
        }
        
        return updated;
      } else {
        // Criar nova entrada para hoje
        const newMetric: MetricData = {
          date: today,
          projectsWorked: type === 'project' ? amount : 0,
          hoursStudied: type === 'study' ? amount : 0,
          skillsLearned: type === 'skill' ? amount : 0,
          tasksCompleted: type === 'task' ? amount : 0,
        };
        
        return [...prevMetrics, newMetric].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
    });
  };

  // Calcular pontuação de produtividade
  const getProductivityScore = (): number => {
    if (weekMetrics.totalProjects === 0 && weekMetrics.totalHours === 0) return 0;
    
    // Algoritmo simples de pontuação baseado em atividades
    const projectScore = weekMetrics.totalProjects * 20;
    const studyScore = weekMetrics.totalHours * 10;
    const skillScore = weekMetrics.totalSkills * 15;
    const taskScore = weekMetrics.totalTasks * 5;
    
    const totalScore = projectScore + studyScore + skillScore + taskScore;
    
    // Normalizar para 0-100
    return Math.min(Math.round(totalScore / 7), 100); // Dividir por 7 dias
  };
  
  // Resetar todas as métricas
  const resetMetrics = () => {
    setMetrics([]);
    localStorage.removeItem(METRICS_STORAGE_KEY);
  };

  return {
    metrics,
    todayMetrics,
    weekMetrics,
    recordActivity,
    getProductivityScore,
    resetMetrics,
    isLoading,
  };
}

// Funções auxiliares
function getTodayMetrics(metrics: MetricData[]): MetricData {
  const today = new Date().toISOString().split('T')[0];
  const todayData = metrics.find(m => m.date === today);
  
  return todayData || {
    date: today,
    projectsWorked: 0,
    hoursStudied: 0,
    skillsLearned: 0,
    tasksCompleted: 0,
  };
}

function getWeekMetrics(metrics: MetricData[]) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weekData = metrics.filter(m => 
    new Date(m.date) >= oneWeekAgo
  );
  
  const totals = weekData.reduce(
    (acc, curr) => ({
      totalProjects: acc.totalProjects + curr.projectsWorked,
      totalHours: acc.totalHours + curr.hoursStudied,
      totalSkills: acc.totalSkills + curr.skillsLearned,
      totalTasks: acc.totalTasks + curr.tasksCompleted,
    }),
    { totalProjects: 0, totalHours: 0, totalSkills: 0, totalTasks: 0 }
  );
  
  const daysWithData = weekData.length || 1; // Evitar divisão por zero
  
  return {
    ...totals,
    averageDaily: {
      projects: Math.round((totals.totalProjects / daysWithData) * 10) / 10,
      hours: Math.round((totals.totalHours / daysWithData) * 10) / 10,
      skills: Math.round((totals.totalSkills / daysWithData) * 10) / 10,
      tasks: Math.round((totals.totalTasks / daysWithData) * 10) / 10,
    },
  };
}

// Hook para integrar métricas automaticamente com ações do dashboard
export function useMetricsIntegration() {
  const { recordActivity } = useMetrics();
  
  // Wrapper para ações que devem registrar métricas
  const withMetrics = <T extends (...args: any[]) => any>(
    action: T,
    metricType: 'project' | 'study' | 'skill' | 'task',
    metricAmount: number = 1
  ) => {
    return ((...args: Parameters<T>) => {
      const result = action(...args);
      recordActivity(metricType, metricAmount);
      return result;
    }) as T;
  };

  return { withMetrics, recordActivity };
}