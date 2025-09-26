import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Upload, Trash2, File, FilePlus2, FileText } from 'lucide-react';

interface CVData {
  name: string;
  title: string;
  summary: string;
  skills: string[];
  experiences: {
    company: string;
    position: string;
    period: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    period: string;
  }[];
  languages: {
    language: string;
    level: string;
  }[];
}

const CV_STORAGE_KEY = 'cv_data';

export function CVManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [cvFile, setCVFile] = useState<File | null>(null);
  const [cvFileName, setCVFileName] = useState<string>(() => {
    return localStorage.getItem('cv_file_name') || "Currículo";
  });
  const [cvFileUrl, setCVFileUrl] = useState<string | null>(() => {
    const savedUrl = localStorage.getItem('cv_file_url');
    return savedUrl || null;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [cvData, setCVData] = useState<CVData>(() => {
    const savedData = localStorage.getItem(CV_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Erro ao carregar dados do CV:', e);
      }
    }
    
    // Dados padrão
    return {
      name: 'Jefferson Felix',
      title: 'Desenvolvedor Frontend & Automação',
      summary: 'Construindo interfaces rápidas, escaláveis e com impacto real.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'RPA', 'AI Integration'],
      experiences: [
        {
          company: 'Empresa Atual',
          position: 'Desenvolvedor Frontend Senior',
          period: '2022 - Presente',
          description: 'Desenvolvimento de aplicações web modernas utilizando React, TypeScript e Tailwind.'
        }
      ],
      education: [
        {
          institution: 'Universidade XYZ',
          degree: 'Bacharelado em Ciência da Computação',
          period: '2016 - 2020'
        }
      ],
      languages: [
        {
          language: 'Português',
          level: 'Nativo'
        },
        {
          language: 'Inglês',
          level: 'Avançado'
        }
      ]
    };
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  // Salvar no localStorage sempre que o CV for atualizado
  useEffect(() => {
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvData));
  }, [cvData]);
  
  // Configurar eventos de drag and drop
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    
    const handleDragLeave = () => {
      setIsDragging(false);
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        processFile(file);
      }
    };
    
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    
    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);
  
  // Função para processar o arquivo (comum entre upload e drag-n-drop)
  const processFile = (file: File) => {
    // Verificar se é um arquivo PDF ou DOCX
    if (
      file.type !== 'application/pdf' && 
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      alert('Por favor, faça upload de um arquivo PDF ou DOCX.');
      return;
    }
    
    // Limite de tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('O arquivo é muito grande. O tamanho máximo é 2MB.');
      return;
    }
    
    setCVFile(file);
    
    // Criar URL para o arquivo
    const fileUrl = URL.createObjectURL(file);
    setCVFileUrl(fileUrl);
    setCVFileName(file.name);
    localStorage.setItem('cv_file_url', fileUrl);
    localStorage.setItem('cv_file_name', file.name); // Salvar o nome do arquivo
  };
  
  // Função para lidar com o upload de arquivo
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };
  
  // Função para remover arquivo
  const handleRemoveFile = () => {
    setCVFile(null);
    if (cvFileUrl) {
      URL.revokeObjectURL(cvFileUrl);
    }
    setCVFileUrl(null);
    setCVFileName("Currículo");
    localStorage.removeItem('cv_file_url');
    localStorage.removeItem('cv_file_name');
    
    // Limpar o input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Gerar arquivo de texto do CV
  const generateTextCV = () => {
    let content = `CURRÍCULO - ${cvData.name}\n\n`;
    content += `Cargo: ${cvData.title}\n\n`;
    content += `Resumo: ${cvData.summary}\n\n`;
    
    content += 'HABILIDADES\n';
    cvData.skills.forEach(skill => {
      content += `• ${skill}\n`;
    });
    content += '\n';
    
    content += 'EXPERIÊNCIA PROFISSIONAL\n';
    cvData.experiences.forEach(exp => {
      content += `${exp.position} - ${exp.company} (${exp.period})\n`;
      content += `${exp.description}\n\n`;
    });
    
    content += 'FORMAÇÃO\n';
    cvData.education.forEach(edu => {
      content += `${edu.degree} - ${edu.institution} (${edu.period})\n`;
    });
    content += '\n';
    
    content += 'IDIOMAS\n';
    cvData.languages.forEach(lang => {
      content += `${lang.language}: ${lang.level}\n`;
    });
    
    return content;
  };
  
  // Download do CV como arquivo de texto
  const handleDownloadCV = () => {
    const content = generateTextCV();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Jefferson-Felix-CV.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  
  // Adicionar nova habilidade
  const handleAddSkill = () => {
    if (skillInput.trim() !== '' && !cvData.skills.includes(skillInput.trim())) {
      setCVData({
        ...cvData,
        skills: [...cvData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };
  
  // Remover habilidade
  const handleRemoveSkill = (skillToRemove: string) => {
    setCVData({
      ...cvData,
      skills: cvData.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  // Adicionar experiência
  const handleAddExperience = () => {
    setCVData({
      ...cvData,
      experiences: [
        ...cvData.experiences,
        {
          company: '',
          position: '',
          period: '',
          description: ''
        }
      ]
    });
  };
  
  // Atualizar experiência
  const handleUpdateExperience = (index: number, field: string, value: string) => {
    const updatedExperiences = [...cvData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    setCVData({
      ...cvData,
      experiences: updatedExperiences
    });
  };
  
  // Remover experiência
  const handleRemoveExperience = (index: number) => {
    setCVData({
      ...cvData,
      experiences: cvData.experiences.filter((_, i) => i !== index)
    });
  };
  
  // Adicionar formação
  const handleAddEducation = () => {
    setCVData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          institution: '',
          degree: '',
          period: ''
        }
      ]
    });
  };
  
  // Atualizar formação
  const handleUpdateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...cvData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setCVData({
      ...cvData,
      education: updatedEducation
    });
  };
  
  // Remover formação
  const handleRemoveEducation = (index: number) => {
    setCVData({
      ...cvData,
      education: cvData.education.filter((_, i) => i !== index)
    });
  };
  
  // Adicionar idioma
  const handleAddLanguage = () => {
    setCVData({
      ...cvData,
      languages: [
        ...cvData.languages,
        {
          language: '',
          level: ''
        }
      ]
    });
  };
  
  // Atualizar idioma
  const handleUpdateLanguage = (index: number, field: string, value: string) => {
    const updatedLanguages = [...cvData.languages];
    updatedLanguages[index] = {
      ...updatedLanguages[index],
      [field]: value
    };
    
    setCVData({
      ...cvData,
      languages: updatedLanguages
    });
  };
  
  // Remover idioma
  const handleRemoveLanguage = (index: number) => {
    setCVData({
      ...cvData,
      languages: cvData.languages.filter((_, i) => i !== index)
    });
  };
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Gerenciador de CV</h3>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-md ${
                isEditing
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isEditing ? "Visualizar" : "Editar"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadCV}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Baixar CV
            </motion.button>
          </div>
        </div>
        
        {/* Seção de Upload de CV */}
        <div className="border-t border-b border-slate-700 py-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Upload de CV</h4>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1">
              {cvFileUrl ? (
                <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <span className="text-sm truncate">{cvFile?.name || cvFileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={cvFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={handleRemoveFile}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  ref={dropAreaRef}
                  className={`bg-slate-700 border border-dashed ${
                    isDragging ? 'border-blue-500 bg-slate-600' : 'border-slate-500'
                  } rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-600 transition-colors`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FilePlus2 className={`w-8 h-8 ${isDragging ? 'text-blue-400' : 'text-slate-400'} mb-2`} />
                  <p className={`text-sm ${isDragging ? 'text-blue-400' : 'text-slate-400'}`}>
                    {isDragging ? 'Solte o arquivo aqui' : 'Arraste um arquivo PDF ou DOCX aqui ou clique para fazer upload'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    (Tamanho máximo: 2MB)
                  </p>
                </div>
              )}
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                id="cv-file-upload"
              />
            </div>
            
            {!cvFileUrl && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center gap-2 whitespace-nowrap"
              >
                <Upload className="w-4 h-4" /> Upload
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                value={cvData.name}
                onChange={(e) => setCVData({ ...cvData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cargo/Título
              </label>
              <input
                type="text"
                value={cvData.title}
                onChange={(e) => setCVData({ ...cvData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resumo Profissional
            </label>
            <textarea
              value={cvData.summary}
              onChange={(e) => setCVData({ ...cvData, summary: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>

          {/* Habilidades */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Habilidades
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {cvData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-slate-700 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span className="text-sm text-white">{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                placeholder="Adicionar nova habilidade"
              />
              <button
                onClick={handleAddSkill}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Experiências */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Experiências Profissionais
              </label>
              <button
                onClick={handleAddExperience}
                className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-4">
              {cvData.experiences.map((exp, index) => (
                <div key={index} className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-white">
                      Experiência {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemoveExperience(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      placeholder="Empresa"
                      value={exp.company}
                      onChange={(e) =>
                        handleUpdateExperience(index, "company", e.target.value)
                      }
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    />
                    <input
                      placeholder="Cargo"
                      value={exp.position}
                      onChange={(e) =>
                        handleUpdateExperience(index, "position", e.target.value)
                      }
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    />
                  </div>
                  <input
                    placeholder="Período (ex: 2020 - Presente)"
                    value={exp.period}
                    onChange={(e) =>
                      handleUpdateExperience(index, "period", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm mb-3"
                  />
                  <textarea
                    placeholder="Descrição das atividades"
                    value={exp.description}
                    onChange={(e) =>
                      handleUpdateExperience(index, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Formação */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Formação Acadêmica
              </label>
              <button
                onClick={handleAddEducation}
                className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-4">
              {cvData.education.map((edu, index) => (
                <div key={index} className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-white">
                      Formação {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemoveEducation(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      placeholder="Instituição"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(index, "institution", e.target.value)
                      }
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    />
                    <input
                      placeholder="Curso/Grau"
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEducation(index, "degree", e.target.value)
                      }
                      className="px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                    />
                  </div>
                  <input
                    placeholder="Período (ex: 2016 - 2020)"
                    value={edu.period}
                    onChange={(e) =>
                      handleUpdateEducation(index, "period", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">
                Idiomas
              </label>
              <button
                onClick={handleAddLanguage}
                className="text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-3">
              {cvData.languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    placeholder="Idioma"
                    value={lang.language}
                    onChange={(e) =>
                      handleUpdateLanguage(index, "language", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                  <input
                    placeholder="Nível"
                    value={lang.level}
                    onChange={(e) =>
                      handleUpdateLanguage(index, "level", e.target.value)
                    }
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                  <button
                    onClick={() => handleRemoveLanguage(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Salvar Alterações
            </motion.button>
          </div>
        </div>
      ) : (
        // Visualização do CV
        <div className="space-y-6 text-white">
          <div className="border-b border-slate-700 pb-4">
            <h2 className="text-2xl font-bold">{cvData.name}</h2>
            <p className="text-lg text-blue-400">{cvData.title}</p>
            <p className="mt-2 text-gray-300">{cvData.summary}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Habilidades</h3>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-slate-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-300">
              Experiência Profissional
            </h3>
            <div className="space-y-4">
              {cvData.experiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium">
                    {exp.position} • {exp.company}
                  </h4>
                  <p className="text-sm text-gray-400">{exp.period}</p>
                  <p className="mt-1 text-sm text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-blue-300">
              Formação Acadêmica
            </h3>
            <div className="space-y-3">
              {cvData.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-green-500 pl-4">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-gray-400">
                    {edu.institution} • {edu.period}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-300">Idiomas</h3>
            <div className="grid grid-cols-2 gap-2">
              {cvData.languages.map((lang, index) => (
                <div key={index} className="bg-slate-700 px-3 py-2 rounded-lg">
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-sm text-gray-400 ml-2">
                    ({lang.level})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}