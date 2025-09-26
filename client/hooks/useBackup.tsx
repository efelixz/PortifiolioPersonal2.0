import { useCallback, useState } from 'react';

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    projects: any[];
    skills: any[];
    studySchedule: any[];
    userAuth?: any;
  };
  metadata: {
    projectsCount: number;
    skillsCount: number;
    scheduleCount: number;
    createdAt: string;
  };
}

interface UseBackupReturn {
  exportData: () => Promise<void>;
  importData: (file: File) => Promise<boolean>;
  clearAllData: () => Promise<boolean>;
  isLoading: boolean;
  status: 'idle' | 'exporting' | 'importing' | 'clearing' | 'success' | 'error';
  message: string;
}

const BACKUP_VERSION = '1.0.0';
const BACKUP_KEYS = ['dashboard_projects', 'dashboard_skills', 'study_schedule'];

export function useBackup(): UseBackupReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'exporting' | 'importing' | 'clearing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const exportData = useCallback(async () => {
    setIsLoading(true);
    setStatus('exporting');
    setMessage('Preparando backup...');

    try {
      // Coletar todos os dados do localStorage
      const projects = JSON.parse(localStorage.getItem('dashboard_projects') || '[]');
      const skills = JSON.parse(localStorage.getItem('dashboard_skills') || '[]');
      const studySchedule = JSON.parse(localStorage.getItem('study_schedule') || '[]');

      const backupData: BackupData = {
        version: BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        data: {
          projects,
          skills,
          studySchedule
        },
        metadata: {
          projectsCount: projects.length,
          skillsCount: skills.length,
          scheduleCount: studySchedule.length,
          createdAt: new Date().toLocaleDateString('pt-BR')
        }
      };

      // Criar arquivo para download
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatus('success');
      setMessage('Backup criado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      setStatus('error');
      setMessage('Erro ao criar backup. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const importData = useCallback(async (file: File): Promise<boolean> => {
    setIsLoading(true);
    setStatus('importing');
    setMessage('Importando dados...');

    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validar estrutura do arquivo
      if (!backupData.version || !backupData.data) {
        throw new Error('Arquivo de backup inválido');
      }

      // Validar versão (opcional - para futuras compatibilidades)
      if (backupData.version !== BACKUP_VERSION) {
        console.warn('Versão do backup diferente, tentando importar mesmo assim...');
      }

      // Fazer backup dos dados atuais antes de substituir
      const currentData = {
        projects: localStorage.getItem('dashboard_projects'),
        skills: localStorage.getItem('dashboard_skills'),
        studySchedule: localStorage.getItem('study_schedule'),
      };

      try {
        // Importar dados
        if (backupData.data.projects) {
          localStorage.setItem('dashboard_projects', JSON.stringify(backupData.data.projects));
        }
        if (backupData.data.skills) {
          localStorage.setItem('dashboard_skills', JSON.stringify(backupData.data.skills));
        }
        if (backupData.data.studySchedule) {
          localStorage.setItem('study_schedule', JSON.stringify(backupData.data.studySchedule));
        }

        setStatus('success');
        setMessage(`Dados importados! ${backupData.metadata.projectsCount} projetos, ${backupData.metadata.skillsCount} habilidades, ${backupData.metadata.scheduleCount} horários de estudo.`);
        
        // Recarregar a página para atualizar todos os componentes
        setTimeout(() => {
          window.location.reload();
        }, 2000);

        return true;
      } catch (importError) {
        // Restaurar dados anteriores em caso de erro
        if (currentData.projects) localStorage.setItem('dashboard_projects', currentData.projects);
        if (currentData.skills) localStorage.setItem('dashboard_skills', currentData.skills);
        if (currentData.studySchedule) localStorage.setItem('study_schedule', currentData.studySchedule);
        
        throw importError;
      }
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Erro ao importar arquivo. Verifique se é um backup válido.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllData = useCallback(async (): Promise<boolean> => {
    if (!confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os seus dados (projetos, habilidades, cronograma). Tem certeza?')) {
      return false;
    }

    if (!confirm('Esta ação é IRREVERSÍVEL. Deseja continuar?')) {
      return false;
    }

    setIsLoading(true);
    setStatus('clearing');
    setMessage('Limpando dados...');

    try {
      // Limpar todos os dados
      BACKUP_KEYS.forEach(key => {
        localStorage.removeItem(key);
      });

      setStatus('success');
      setMessage('Todos os dados foram removidos.');
      
      // Recarregar a página
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      return true;
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
      setStatus('error');
      setMessage('Erro ao limpar dados.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    exportData,
    importData,
    clearAllData,
    isLoading,
    status,
    message,
  };
}

// Utilitário para verificar se há dados salvos
export function hasStoredData(): boolean {
  return BACKUP_KEYS.some(key => {
    const data = localStorage.getItem(key);
    return data && JSON.parse(data).length > 0;
  });
}

// Utilitário para obter estatísticas dos dados
export function getDataStats() {
  const projects = JSON.parse(localStorage.getItem('dashboard_projects') || '[]');
  const skills = JSON.parse(localStorage.getItem('dashboard_skills') || '[]');
  const studySchedule = JSON.parse(localStorage.getItem('study_schedule') || '[]');

  return {
    projects: projects.length,
    skills: skills.length,
    studySchedule: studySchedule.length,
    totalSize: new Blob([
      localStorage.getItem('dashboard_projects') || '',
      localStorage.getItem('dashboard_skills') || '',
      localStorage.getItem('study_schedule') || ''
    ]).size,
    lastModified: Math.max(
      ...BACKUP_KEYS.map(key => {
        const item = localStorage.getItem(key + '_lastModified');
        return item ? parseInt(item) : 0;
      })
    )
  };
}