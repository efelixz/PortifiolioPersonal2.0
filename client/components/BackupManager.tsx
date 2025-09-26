import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBackup, hasStoredData, getDataStats } from '../hooks/useBackup';

interface BackupManagerProps {
  className?: string;
}

export function BackupManager({ className = '' }: BackupManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { exportData, importData, clearAllData, isLoading, status, message } = useBackup();
  
  const dataStats = getDataStats();
  const hasData = hasStoredData();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await importData(file);
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'exporting':
      case 'importing':
      case 'clearing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Gerenciamento de Dados
        </h2>
      </div>

      {/* Estatísticas dos Dados */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{dataStats.projects}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Projetos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{dataStats.skills}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Habilidades</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{dataStats.studySchedule}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Cronogramas</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(dataStats.totalSize / 1024)}KB
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Tamanho</div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Exportar Dados */}
        <motion.button
          onClick={exportData}
          disabled={isLoading || !hasData}
          whileHover={{ scale: hasData ? 1.02 : 1 }}
          whileTap={{ scale: hasData ? 0.98 : 1 }}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed transition-all
            ${hasData 
              ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:border-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300' 
              : 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500'
            }
          `}
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">
            {status === 'exporting' ? 'Exportando...' : 'Exportar Backup'}
          </span>
        </motion.button>

        {/* Importar Dados */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-300 transition-all cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            <span className="font-medium">
              {status === 'importing' ? 'Importando...' : 'Importar Backup'}
            </span>
          </motion.div>
        </div>

        {/* Limpar Dados */}
        <motion.button
          onClick={clearAllData}
          disabled={isLoading || !hasData}
          whileHover={{ scale: hasData ? 1.02 : 1 }}
          whileTap={{ scale: hasData ? 0.98 : 1 }}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed transition-all
            ${hasData 
              ? 'border-red-300 bg-red-50 hover:bg-red-100 text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-300' 
              : 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500'
            }
          `}
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium">
            {status === 'clearing' ? 'Limpando...' : 'Limpar Tudo'}
          </span>
        </motion.button>
      </div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}

      {/* Informações de Ajuda */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
          💡 Dicas de Backup
        </h3>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Faça backup regularmente dos seus dados importantes</li>
          <li>• O arquivo de backup é um JSON que pode ser editado manualmente</li>
          <li>• A importação substitui todos os dados atuais</li>
          <li>• Mantenha múltiplas versões de backup por segurança</li>
        </ul>
      </div>
    </div>
  );
}