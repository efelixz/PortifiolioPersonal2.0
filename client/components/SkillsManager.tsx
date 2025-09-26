import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '@/hooks/usePortfolio';
import { 
  Save, 
  Plus, 
  Trash2, 
  ArrowDown, 
  ArrowUp,
  Component, 
  Code,
  Database,
  Cog,
  Cloud,
  Palette,
  TestTube,
  Wrench,
  Cpu,
  Code2
} from 'lucide-react';

// Definição de categorias de skills
const SKILL_CATEGORIES = [
  { id: 'Frontend', label: 'Frontend', icon: <Component className="w-4 h-4" /> },
  { id: 'Backend', label: 'Backend', icon: <Cpu className="w-4 h-4" /> },
  { id: 'Languages', label: 'Linguagens', icon: <Code2 className="w-4 h-4" /> },
  { id: 'Database', label: 'Banco de Dados', icon: <Database className="w-4 h-4" /> },
  { id: 'DevOps', label: 'DevOps', icon: <Cog className="w-4 h-4" /> },
  { id: 'Mobile', label: 'Mobile', icon: <Component className="w-4 h-4" /> },
  { id: 'Design', label: 'Design', icon: <Palette className="w-4 h-4" /> },
  { id: 'Testing', label: 'Testes', icon: <TestTube className="w-4 h-4" /> },
  { id: 'Tools', label: 'Ferramentas', icon: <Wrench className="w-4 h-4" /> },
  { id: 'Cloud', label: 'Cloud', icon: <Cloud className="w-4 h-4" /> },
];

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}

interface SkillFormProps {
  skill: Skill;
  onUpdate: (updatedSkill: Skill) => void;
  onCancel: () => void;
  onSave: () => void;
}

function SkillForm({ skill, onUpdate, onCancel, onSave }: SkillFormProps) {
  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">Editar Habilidade</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Nome</label>
          <input 
            type="text" 
            value={skill.name}
            onChange={(e) => onUpdate({ ...skill, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-slate-300 mb-1">Categoria</label>
          <select
            value={skill.category}
            onChange={(e) => onUpdate({ ...skill, category: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
          >
            {SKILL_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-300">Nível ({skill.level}%)</label>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={skill.level}
            onChange={(e) => onUpdate({ ...skill, level: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg accent-purple-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Iniciante</span>
            <span>Intermediário</span>
            <span>Avançado</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm flex items-center gap-1"
          >
            <Save className="w-4 h-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export function SkillsManager() {
  const { skills, refreshData } = usePortfolio();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  // Inicializa as skills do estado quando o componente carrega
  useEffect(() => {
    setCurrentSkills(skills);
  }, [skills]);

  // Filtra as skills com base na categoria selecionada
  const filteredSkills = selectedCategory
    ? currentSkills.filter(skill => skill.category === selectedCategory)
    : currentSkills;

  const handleSaveChanges = () => {
    localStorage.setItem('dashboard_skills', JSON.stringify(currentSkills));
    refreshData();
    setSaveMessage('Alterações salvas com sucesso!');
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  const handleAddSkill = () => {
    const newId = currentSkills.length > 0
      ? Math.max(...currentSkills.map(s => s.id)) + 1
      : 1;
      
    const newSkill: Skill = {
      id: newId,
      name: 'Nova Habilidade',
      category: selectedCategory || 'Frontend',
      level: 50
    };
    
    setCurrentSkills([...currentSkills, newSkill]);
    setEditingSkill(newSkill);
    setEditingIndex(currentSkills.length);
    setIsEditing(true);
  };

  const handleEditSkill = (skill: Skill, index: number) => {
    setEditingSkill({ ...skill });
    setEditingIndex(index);
    setIsEditing(true);
  };

  const handleUpdateSkill = (updatedSkill: Skill) => {
    setEditingSkill(updatedSkill);
  };

  const handleSaveSkill = () => {
    if (editingSkill && editingIndex !== null) {
      const updatedSkills = [...currentSkills];
      updatedSkills[editingIndex] = editingSkill;
      setCurrentSkills(updatedSkills);
      setIsEditing(false);
      setEditingSkill(null);
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSkill(null);
    setEditingIndex(null);
  };

  const handleDeleteSkill = (id: number) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta habilidade?');
    if (confirmDelete) {
      setCurrentSkills(currentSkills.filter(skill => skill.id !== id));
    }
  };

  const handleMoveSkill = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === filteredSkills.length - 1)
    ) {
      return;
    }
    
    const allSkills = [...currentSkills];
    const filteredIndices = currentSkills
      .map((skill, idx) => selectedCategory ? (skill.category === selectedCategory ? idx : -1) : idx)
      .filter(idx => idx !== -1);
    
    const currentIndex = filteredIndices[index];
    const swapIndex = filteredIndices[index + (direction === 'up' ? -1 : 1)];
    
    [allSkills[currentIndex], allSkills[swapIndex]] = [allSkills[swapIndex], allSkills[currentIndex]];
    
    setCurrentSkills(allSkills);
  };

  // Obtém a contagem de habilidades por categoria
  const categoryCount = currentSkills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getSkillLevelClass = (level: number) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 75) return 'bg-blue-500';
    if (level >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Renderiza o ícone apropriado para cada categoria
  const getCategoryIcon = (categoryId: string) => {
    const category = SKILL_CATEGORIES.find(cat => cat.id === categoryId);
    return category?.icon || <Code className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Habilidades</h2>
          <p className="text-sm text-slate-400 mt-1">
            Adicione, edite ou remova suas habilidades profissionais
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddSkill}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
          >
            <Save className="w-4 h-4" /> Salvar Tudo
          </motion.button>
        </div>
      </div>

      {saveMessage && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg">
          {saveMessage}
        </div>
      )}

      {/* Filtro por categoria */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="font-medium text-white mb-3">Filtrar por categoria</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 text-xs rounded-full ${
              selectedCategory === null 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Todas ({currentSkills.length})
          </button>
          
          {SKILL_CATEGORIES.map(category => {
            const count = categoryCount[category.id] || 0;
            if (count === 0) return null;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {category.icon}
                {category.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de habilidades */}
      <div className="space-y-4">
        {isEditing && editingSkill && (
          <SkillForm 
            skill={editingSkill}
            onUpdate={handleUpdateSkill}
            onCancel={handleCancelEdit}
            onSave={handleSaveSkill}
          />
        )}
        
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`bg-slate-800 border border-slate-700 rounded-lg p-4 ${
              editingIndex === index ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg">
                  {getCategoryIcon(skill.category)}
                </div>
                <div>
                  <h3 className="font-medium text-white">{skill.name}</h3>
                  <span className="text-xs text-slate-400">{
                    SKILL_CATEGORIES.find(cat => cat.id === skill.category)?.label || skill.category
                  }</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-700 px-2 py-1 rounded-md text-slate-300">
                  {skill.level}%
                </span>
                
                <div className="flex">
                  <button
                    onClick={() => handleMoveSkill(index, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded ${index === 0 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                    title="Mover para cima"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => handleMoveSkill(index, 'down')}
                    disabled={index === filteredSkills.length - 1}
                    className={`p-1 rounded ${index === filteredSkills.length - 1 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                    title="Mover para baixo"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => handleEditSkill(skill, currentSkills.indexOf(skill))}
                    className="p-1 text-blue-400 hover:bg-slate-700 rounded"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="p-1 text-red-400 hover:bg-slate-700 rounded"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Barra de nível */}
            <div className="mt-3">
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${getSkillLevelClass(skill.level)}`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
        
        {filteredSkills.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            {selectedCategory ? (
              <>
                <p>Nenhuma habilidade encontrada na categoria selecionada.</p>
                <button 
                  onClick={handleAddSkill}
                  className="mt-4 inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
                >
                  <Plus className="w-4 h-4" /> Adicionar habilidade
                </button>
              </>
            ) : (
              <>
                <p>Você ainda não adicionou nenhuma habilidade.</p>
                <button 
                  onClick={handleAddSkill}
                  className="mt-4 inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
                >
                  <Plus className="w-4 h-4" /> Adicionar sua primeira habilidade
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}