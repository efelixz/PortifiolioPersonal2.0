import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';

interface Skill {
  id?: number;
  name: string;
  category: string;
  level: number;
}

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: Skill) => void;
  skill?: Skill | null;
  loading?: boolean;
}

const categoryOptions = [
  'Frontend',
  'Backend',
  'Languages',
  'Database',
  'DevOps',
  'Mobile',
  'Design',
  'Testing',
  'Tools',
  'Cloud'
];

export default function SkillModal({ isOpen, onClose, onSave, skill, loading = false }: SkillModalProps) {
  const [formData, setFormData] = useState<Skill>({
    name: '',
    category: 'Frontend',
    level: 50
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (skill) {
      setFormData(skill);
    } else {
      setFormData({
        name: '',
        category: 'Frontend',
        level: 50
      });
    }
  }, [skill, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da habilidade é obrigatório';
    }
    if (formData.level < 0 || formData.level > 100) {
      newErrors.level = 'Nível deve estar entre 0 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'level' ? parseInt(value) : value 
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 80) return 'from-green-500 to-emerald-500';
    if (level >= 60) return 'from-blue-500 to-cyan-500';
    if (level >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getLevelText = (level: number) => {
    if (level >= 90) return 'Expert';
    if (level >= 80) return 'Avançado';
    if (level >= 60) return 'Intermediário';
    if (level >= 40) return 'Básico';
    return 'Iniciante';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg mx-4 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">
                {skill ? 'Editar Habilidade' : 'Nova Habilidade'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome da Habilidade *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.name ? 'border-red-500' : 'border-slate-600'
                  }`}
                  placeholder="Ex: React, TypeScript, Python..."
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nível de Proficiência
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    name="level"
                    min="0"
                    max="100"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  {/* Level Display */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{formData.level}%</span>
                        <span className="text-sm text-gray-400">({getLevelText(formData.level)})</span>
                      </div>
                    </div>
                    
                    {/* Visual Level Bar */}
                    <div className="w-24 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${formData.level}%` }}
                        className={`h-full bg-gradient-to-r ${getLevelColor(formData.level)}`}
                      />
                    </div>
                  </div>
                  
                  {/* Level Guidelines */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>0-39: Iniciante</span>
                      <span>40-59: Básico</span>
                    </div>
                    <div className="flex justify-between">
                      <span>60-79: Intermediário</span>
                      <span>80-89: Avançado</span>
                    </div>
                    <div className="text-center">
                      <span>90-100: Expert</span>
                    </div>
                  </div>
                </div>
                {errors.level && <p className="text-red-400 text-sm mt-1">{errors.level}</p>}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Salvar
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}