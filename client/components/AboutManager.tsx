import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, ArrowDown, ArrowUp } from 'lucide-react';

interface AboutContent {
  bioText: string[];
  location: string;
  education: {
    title: string;
    subtitle: string;
  };
  currentFocus: {
    title: string;
    subtitle: string;
  };
  skills: Array<{
    name: string;
    level: number;
    description: string;
  }>;
  experience: Array<{
    title: string;
    period: string;
    description: string;
  }>;
  achievements: string[];
}

interface TabProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
}

const Tab = ({ isActive, label, onClick }: TabProps) => (
  <button
    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
      isActive 
        ? 'bg-slate-700 text-white border-b-2 border-purple-500' 
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export function AboutManager() {
  const [activeTab, setActiveTab] = useState('bio');
  const [savedContent, setSavedContent] = useState<AboutContent | null>(null);
  const [content, setContent] = useState<AboutContent>({
    bioText: [
      'Comecei minha jornada na programação em 2021, fascinado pela possibilidade de resolver problemas complexos através do código. O que começou como curiosidade rapidamente se transformou em paixão.',
      'Especializo-me em desenvolvimento frontend com React e TypeScript, criando interfaces intuitivas e performáticas. Paralelamente, desenvolvo automações com Python e RPA que otimizam processos empresariais.',
      'Acredito que a tecnologia deve ser acessível e resolver problemas reais. Por isso, foco em criar soluções que não apenas funcionam, mas que proporcionam uma experiência excepcional aos usuários.'
    ],
    location: 'Brasil • Trabalho Remoto',
    education: {
      title: 'Autodidata em Desenvolvimento Web',
      subtitle: 'Aprendizado contínuo em tecnologias modernas'
    },
    currentFocus: {
      title: 'Desenvolvimento Frontend & Automações',
      subtitle: 'React, TypeScript, Python, RPA'
    },
    skills: [
      { name: "Frontend Development", level: 95, description: "React, TypeScript, JavaScript" },
      { name: "Automação & RPA", level: 90, description: "Python, Selenium, Process Automation" },
      { name: "UI/UX Design", level: 85, description: "Figma, Tailwind CSS, Design Systems" },
      { name: "Backend Integration", level: 80, description: "Node.js, APIs, Database Design" }
    ],
    experience: [
      {
        title: "Desenvolvedor Frontend Freelancer",
        period: "2023 - Presente",
        description: "Desenvolvimento de aplicações React modernas, dashboards interativos e automações personalizadas."
      },
      {
        title: "Especialista em Automação",
        period: "2022 - 2023",
        description: "Criação de bots RPA e automação de processos empresariais com Python e Selenium."
      },
      {
        title: "Desenvolvedor Web",
        period: "2021 - 2022",
        description: "Desenvolvimento de sites responsivos e aplicações web com foco em performance e UX."
      }
    ],
    achievements: [
      "10+ projetos de automação entregues",
      "15+ aplicações React desenvolvidas",
      "80% redução de tempo em processos automatizados",
      "100% satisfação dos clientes"
    ]
  });

  // Carregar dados salvos do localStorage quando o componente monta
  useEffect(() => {
    const saved = localStorage.getItem('about_content');
    if (saved) {
      const parsedContent = JSON.parse(saved) as AboutContent;
      setSavedContent(parsedContent);
      setContent(parsedContent);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('about_content', JSON.stringify(content));
    setSavedContent(content);
    
    // Mostrar feedback de sucesso
    alert('Conteúdo salvo com sucesso!');
  };

  // Manipuladores para atualizar texto da bio
  const updateBioText = (index: number, value: string) => {
    const updatedBioText = [...content.bioText];
    updatedBioText[index] = value;
    setContent({ ...content, bioText: updatedBioText });
  };

  const addBioParagraph = () => {
    setContent({
      ...content,
      bioText: [...content.bioText, '']
    });
  };

  const removeBioParagraph = (index: number) => {
    const updatedBioText = content.bioText.filter((_, i) => i !== index);
    setContent({ ...content, bioText: updatedBioText });
  };

  // Manipuladores para habilidades
  const updateSkill = (index: number, field: keyof typeof content.skills[0], value: any) => {
    const updatedSkills = [...content.skills];
    updatedSkills[index] = { ...updatedSkills[index], [field]: value };
    setContent({ ...content, skills: updatedSkills });
  };

  const addSkill = () => {
    setContent({
      ...content,
      skills: [...content.skills, { name: "", level: 50, description: "" }]
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = content.skills.filter((_, i) => i !== index);
    setContent({ ...content, skills: updatedSkills });
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === content.skills.length - 1)
    ) {
      return;
    }

    const updatedSkills = [...content.skills];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSkills[index], updatedSkills[newIndex]] = [updatedSkills[newIndex], updatedSkills[index]];
    
    setContent({ ...content, skills: updatedSkills });
  };

  // Manipuladores para experiência
  const updateExperience = (index: number, field: keyof typeof content.experience[0], value: string) => {
    const updatedExperience = [...content.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setContent({ ...content, experience: updatedExperience });
  };

  const addExperience = () => {
    setContent({
      ...content,
      experience: [...content.experience, { title: "", period: "", description: "" }]
    });
  };

  const removeExperience = (index: number) => {
    const updatedExperience = content.experience.filter((_, i) => i !== index);
    setContent({ ...content, experience: updatedExperience });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === content.experience.length - 1)
    ) {
      return;
    }

    const updatedExperience = [...content.experience];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedExperience[index], updatedExperience[newIndex]] = [updatedExperience[newIndex], updatedExperience[index]];
    
    setContent({ ...content, experience: updatedExperience });
  };

  // Manipuladores para conquistas
  const updateAchievement = (index: number, value: string) => {
    const updatedAchievements = [...content.achievements];
    updatedAchievements[index] = value;
    setContent({ ...content, achievements: updatedAchievements });
  };

  const addAchievement = () => {
    setContent({
      ...content,
      achievements: [...content.achievements, ""]
    });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = content.achievements.filter((_, i) => i !== index);
    setContent({ ...content, achievements: updatedAchievements });
  };

  const moveAchievement = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === content.achievements.length - 1)
    ) {
      return;
    }

    const updatedAchievements = [...content.achievements];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedAchievements[index], updatedAchievements[newIndex]] = [updatedAchievements[newIndex], updatedAchievements[index]];
    
    setContent({ ...content, achievements: updatedAchievements });
  };

  return (
    <div className="space-y-6">
      {/* Barra de abas */}
      <div className="flex space-x-1 border-b border-slate-700">
        <Tab 
          isActive={activeTab === 'bio'} 
          label="Biografia" 
          onClick={() => setActiveTab('bio')} 
        />
        <Tab 
          isActive={activeTab === 'info'} 
          label="Informações Pessoais" 
          onClick={() => setActiveTab('info')} 
        />
        <Tab 
          isActive={activeTab === 'skills'} 
          label="Habilidades" 
          onClick={() => setActiveTab('skills')} 
        />
        <Tab 
          isActive={activeTab === 'experience'} 
          label="Experiência" 
          onClick={() => setActiveTab('experience')} 
        />
        <Tab 
          isActive={activeTab === 'achievements'} 
          label="Conquistas" 
          onClick={() => setActiveTab('achievements')} 
        />
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="space-y-6">
        {activeTab === 'bio' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium">Minha História</h3>
            <p className="text-sm text-slate-400">
              Cada parágrafo será exibido separadamente na seção "Minha História". Adicione ou remova parágrafos conforme necessário.
            </p>

            {content.bioText.map((paragraph, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateBioText(index, e.target.value)}
                    className="w-full min-h-[100px] p-3 bg-slate-700 border border-slate-600 rounded-lg text-white resize-y"
                    placeholder="Digite o parágrafo aqui..."
                  />
                  <button 
                    onClick={() => removeBioParagraph(index)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                    title="Remover parágrafo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                onClick={addBioParagraph}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Adicionar Parágrafo</span>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'info' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Localização</h3>
              <input
                type="text"
                value={content.location}
                onChange={(e) => setContent({ ...content, location: e.target.value })}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                placeholder="Ex: Brasil • Trabalho Remoto"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Formação</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={content.education.title}
                  onChange={(e) => setContent({ 
                    ...content, 
                    education: { ...content.education, title: e.target.value } 
                  })}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Título da formação"
                />
                <input
                  type="text"
                  value={content.education.subtitle}
                  onChange={(e) => setContent({ 
                    ...content, 
                    education: { ...content.education, subtitle: e.target.value } 
                  })}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Subtítulo da formação"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Foco Atual</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={content.currentFocus.title}
                  onChange={(e) => setContent({ 
                    ...content, 
                    currentFocus: { ...content.currentFocus, title: e.target.value } 
                  })}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Título do foco atual"
                />
                <input
                  type="text"
                  value={content.currentFocus.subtitle}
                  onChange={(e) => setContent({ 
                    ...content, 
                    currentFocus: { ...content.currentFocus, subtitle: e.target.value } 
                  })}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Subtítulo do foco atual"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Principais Habilidades</h3>
              <button
                onClick={addSkill}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Adicionar Habilidade</span>
              </button>
            </div>

            {content.skills.map((skill, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Habilidade {index + 1}</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => moveSkill(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                      title="Mover para cima"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button 
                      onClick={() => moveSkill(index, 'down')}
                      disabled={index === content.skills.length - 1}
                      className={`p-1 rounded ${index === content.skills.length - 1 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                      title="Mover para baixo"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button 
                      onClick={() => removeSkill(index)}
                      className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                      title="Remover habilidade"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Nome</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(index, 'name', e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="Ex: Frontend Development"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm text-slate-400">Nível ({skill.level}%)</label>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateSkill(index, 'level', Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={skill.description}
                      onChange={(e) => updateSkill(index, 'description', e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="Ex: React, TypeScript, JavaScript"
                    />
                  </div>
                </div>
              </div>
            ))}

            {content.skills.length === 0 && (
              <p className="text-slate-500 text-center py-4">
                Nenhuma habilidade adicionada. Clique em "Adicionar Habilidade" acima.
              </p>
            )}
          </motion.div>
        )}

        {activeTab === 'experience' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Experiência Profissional</h3>
              <button
                onClick={addExperience}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Adicionar Experiência</span>
              </button>
            </div>

            {content.experience.map((exp, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Experiência {index + 1}</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => moveExperience(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                      title="Mover para cima"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button 
                      onClick={() => moveExperience(index, 'down')}
                      disabled={index === content.experience.length - 1}
                      className={`p-1 rounded ${index === content.experience.length - 1 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                      title="Mover para baixo"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button 
                      onClick={() => removeExperience(index)}
                      className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                      title="Remover experiência"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Cargo/Título</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="Ex: Desenvolvedor Frontend Freelancer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Período</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(index, 'period', e.target.value)}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="Ex: 2023 - Presente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Descrição</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full min-h-[80px] p-3 bg-slate-700 border border-slate-600 rounded-lg text-white resize-y"
                      placeholder="Descreva suas responsabilidades e realizações neste cargo..."
                    />
                  </div>
                </div>
              </div>
            ))}

            {content.experience.length === 0 && (
              <p className="text-slate-500 text-center py-4">
                Nenhuma experiência adicionada. Clique em "Adicionar Experiência" acima.
              </p>
            )}
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Conquistas</h3>
              <button
                onClick={addAchievement}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Adicionar Conquista</span>
              </button>
            </div>

            {content.achievements.map((achievement, index) => (
              <div key={index} className="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => updateAchievement(index, e.target.value)}
                    className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Digite a conquista aqui..."
                  />
                  <div className="flex flex-col space-y-1">
                    <button 
                      onClick={() => moveAchievement(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                      title="Mover para cima"
                    >
                      <ArrowUp size={18} />
                    </button>
                    <button 
                      onClick={() => moveAchievement(index, 'down')}
                      disabled={index === content.achievements.length - 1}
                      className={`p-1 rounded ${index === content.achievements.length - 1 ? 'text-slate-600' : 'text-slate-400 hover:bg-slate-700'}`}
                      title="Mover para baixo"
                    >
                      <ArrowDown size={18} />
                    </button>
                    <button 
                      onClick={() => removeAchievement(index)}
                      className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                      title="Remover conquista"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {content.achievements.length === 0 && (
              <p className="text-slate-500 text-center py-4">
                Nenhuma conquista adicionada. Clique em "Adicionar Conquista" acima.
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Botão de salvar */}
      <div className="pt-6 border-t border-slate-700">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
        >
          <Save size={18} />
          <span>Salvar Alterações</span>
        </button>
      </div>
    </div>
  );
}