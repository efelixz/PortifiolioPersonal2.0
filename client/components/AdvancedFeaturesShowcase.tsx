import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Importar hooks e componentes
import { AIChatButton } from '../hooks/useAIChat';
import { SmartAnimated, AnimationControlPanel, AnimatedText, ParticleCanvas } from '../hooks/useAdvancedAnimations';
import { AR3DGallery } from '../hooks/useAR3D';
import { CacheMonitor } from '../hooks/useSmartCache';
import { useWebRTCStreaming, StreamingStudio } from '../hooks/useWebRTCStreaming';
import { MLDashboard, RealTimeImageAnalysis } from '../hooks/useClientSideML';
import { Web3Dashboard, NFTInteraction } from '../hooks/useBlockchainIntegration';

// Tipos para o showcase
interface FeatureDemo {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  category: 'ai' | 'animations' | 'ar3d' | 'cache' | 'streaming' | 'ml' | 'blockchain' | 'integration';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

// Showcase principal das funcionalidades
export function AdvancedFeaturesShowcase() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showControlPanel, setShowControlPanel] = useState(false);

  const demos: FeatureDemo[] = [
    {
      id: 'ai-chat',
      title: 'AI Chat Assistant',
      description: 'Assistente de IA integrado com processamento de linguagem natural e respostas contextuais sobre o portfólio.',
      component: AIChatDemo,
      category: 'ai',
      difficulty: 'advanced',
      tags: ['IA', 'Chat', 'NLP', 'Automação']
    },
    {
      id: 'smart-animations',
      title: 'Animações Inteligentes',
      description: 'Sistema de animações com detecção de movimento reduzido, performance adaptativa e efeitos avançados.',
      component: SmartAnimationsDemo,
      category: 'animations',
      difficulty: 'intermediate',
      tags: ['Framer Motion', 'Performance', 'UX', 'Acessibilidade']
    },
    {
      id: 'particle-system',
      title: 'Sistema de Partículas',
      description: 'Efeitos visuais com partículas interativas, física simulada e otimização de performance.',
      component: ParticleSystemDemo,
      category: 'animations',
      difficulty: 'advanced',
      tags: ['Canvas', 'Física', 'Interação', 'WebGL']
    },
    {
      id: 'ar-3d',
      title: 'Realidade Aumentada',
      description: 'Experiências AR/3D para visualização de projetos e cartão de visitas digital interativo.',
      component: AR3DDemo,
      category: 'ar3d',
      difficulty: 'advanced',
      tags: ['WebXR', 'WebGL', 'AR', '3D', 'Inovação']
    },
    {
      id: 'animated-text',
      title: 'Texto Animado',
      description: 'Efeitos de texto com typewriter, stagger, wave e glitch para narrativas envolventes.',
      component: AnimatedTextDemo,
      category: 'animations',
      difficulty: 'beginner',
      tags: ['Tipografia', 'Efeitos', 'Storytelling']
    },
    {
      id: 'smart-cache',
      title: 'Cache Inteligente',
      description: 'Sistema de cache com ML, predição de comportamento e otimização automática de performance.',
      component: SmartCacheDemo,
      category: 'cache',
      difficulty: 'advanced',
      tags: ['Machine Learning', 'Performance', 'Cache', 'Predição']
    },
    {
      id: 'webrtc-streaming',
      title: 'Streaming WebRTC',
      description: 'Streaming em tempo real, compartilhamento de tela e anotações interativas.',
      component: WebRTCDemo,
      category: 'streaming',
      difficulty: 'advanced',
      tags: ['WebRTC', 'Streaming', 'Tempo Real', 'P2P']
    },
    {
      id: 'client-side-ml',
      title: 'Machine Learning Client-Side',
      description: 'Análise de imagens, reconhecimento de gestos e processamento ML no navegador.',
      component: MLDemo,
      category: 'ml',
      difficulty: 'advanced',
      tags: ['Machine Learning', 'Análise', 'Web Workers', 'IA']
    },
    {
      id: 'blockchain-integration',
      title: 'Integração Blockchain',
      description: 'Conectividade Web3, NFTs, DeFi e analytics blockchain em tempo real.',
      component: BlockchainDemo,
      category: 'blockchain',
      difficulty: 'advanced',
      tags: ['Web3', 'Blockchain', 'NFT', 'DeFi', 'Smart Contracts']
    },
    {
      id: 'integration-example',
      title: 'Exemplo de Integração',
      description: 'Demonstração de como todas as funcionalidades trabalham em conjunto de forma harmoniosa.',
      component: IntegrationDemo,
      category: 'integration',
      difficulty: 'advanced',
      tags: ['Full Stack', 'Sistema Completo', 'Arquitetura']
    }
  ];

  const filteredDemos = selectedCategory === 'all' 
    ? demos 
    : demos.filter(demo => demo.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'Todas', icon: '🎯' },
    { id: 'ai', label: 'Inteligência Artificial', icon: '🤖' },
    { id: 'animations', label: 'Animações', icon: '✨' },
    { id: 'ar3d', label: 'AR/3D', icon: '🥽' },
    { id: 'cache', label: 'Cache Inteligente', icon: '⚡' },
    { id: 'streaming', label: 'Streaming', icon: '📡' },
    { id: 'ml', label: 'Machine Learning', icon: '🧠' },
    { id: 'blockchain', label: 'Blockchain', icon: '⛓️' },
    { id: 'integration', label: 'Integração', icon: '🔗' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Partículas de fundo */}
        <ParticleCanvas
          config={{
            count: 3,
            color: 'rgba(255, 255, 255, 0.6)',
            size: { min: 2, max: 6 },
            speed: { min: 0.5, max: 2 },
            lifetime: 300,
            gravity: false
          }}
          trigger="auto"
          className="opacity-30"
        />

        <div className="relative z-10 container mx-auto px-6 py-16">
          <SmartAnimated preset="slideInDown" className="text-center">
            <AnimatedText
              text="Funcionalidades Avançadas"
              animation="stagger"
              className="text-5xl font-bold mb-4"
            />
            <AnimatedText
              text="Explore as inovações tecnológicas implementadas neste portfólio"
              animation="typewriter"
              speed={30}
              className="text-xl opacity-90 max-w-3xl mx-auto"
            />
          </SmartAnimated>

          {/* Estatísticas */}
          <SmartAnimated preset="slideInUp" delay={0.3} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { label: 'Funcionalidades', value: '6+', icon: '⚡' },
              { label: 'Tecnologias', value: '15+', icon: '🛠️' },
              { label: 'Componentes', value: '20+', icon: '🧩' },
              { label: 'Inovação', value: '100%', icon: '🚀' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </SmartAnimated>
        </div>
      </div>

      {/* Navegação de categorias */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de demos */}
      <div className="container mx-auto px-6 py-12">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredDemos.map((demo) => (
              <SmartAnimated
                key={demo.id}
                preset="scaleIn"
                className="group cursor-pointer"
                onClick={() => setActiveDemo(demo.id)}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 group-hover:shadow-2xl">
                  {/* Header do card */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {demo.title}
                      </h3>
                      <DifficultyBadge difficulty={demo.difficulty} />
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {demo.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex flex-wrap gap-2">
                      {demo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        Clique para demonstração
                      </span>
                      <svg className="w-5 h-5 text-blue-500 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </SmartAnimated>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal de demonstração */}
      <AnimatePresence>
        {activeDemo && (
          <DemoModal
            demo={demos.find(d => d.id === activeDemo)!}
            onClose={() => setActiveDemo(null)}
          />
        )}
      </AnimatePresence>

      {/* Controles flutuantes */}
      <div className="fixed bottom-6 left-6 space-y-3">
        <motion.button
          onClick={() => setShowControlPanel(!showControlPanel)}
          className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </motion.button>
      </div>

      {/* AI Chat Assistant sempre disponível */}
      <AIChatButton />

      {/* Painel de controle das animações */}
      {showControlPanel && <AnimationControlPanel />}
    </div>
  );
}

// Badge de dificuldade
function DifficultyBadge({ difficulty }: { difficulty: FeatureDemo['difficulty'] }) {
  const config = {
    beginner: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', label: 'Iniciante' },
    intermediate: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Intermediário' },
    advanced: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', label: 'Avançado' }
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${config[difficulty].color}`}>
      {config[difficulty].label}
    </span>
  );
}

// Modal de demonstração
function DemoModal({ demo, onClose }: { demo: FeatureDemo; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {demo.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {demo.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo da demo */}
        <div className="p-6 overflow-y-auto">
          <demo.component />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Componentes de demonstração
function AIChatDemo() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
        <h3 className="font-semibold mb-2">🤖 AI Chat Assistant</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          O assistente está sempre disponível no canto inferior direito. Ele pode responder perguntas sobre:
        </p>
        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
          <li>• Projetos e tecnologias do portfólio</li>
          <li>• Experiência profissional e habilidades</li>
          <li>• Informações de contato e disponibilidade</li>
          <li>• Demonstrações interativas das funcionalidades</li>
        </ul>
      </div>
      
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          💡 Clique no botão de chat para começar a conversar!
        </p>
      </div>
    </div>
  );
}

function SmartAnimationsDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <SmartAnimated preset="slideInLeft" className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">👈</div>
          <p className="text-sm">Slide Left</p>
        </SmartAnimated>
        
        <SmartAnimated preset="slideInRight" className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">👉</div>
          <p className="text-sm">Slide Right</p>
        </SmartAnimated>
        
        <SmartAnimated preset="scaleIn" className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">🎯</div>
          <p className="text-sm">Scale In</p>
        </SmartAnimated>
        
        <SmartAnimated preset="rotateIn" className="bg-pink-100 dark:bg-pink-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl mb-2">🔄</div>
          <p className="text-sm">Rotate In</p>
        </SmartAnimated>
      </div>
      
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        As animações respeitam as preferências de acessibilidade do usuário
      </div>
    </div>
  );
}

function ParticleSystemDemo() {
  return (
    <div className="space-y-4">
      <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg overflow-hidden">
        <ParticleCanvas
          config={{
            count: 5,
            color: '#8b5cf6',
            size: { min: 3, max: 8 },
            speed: { min: 1, max: 3 },
            lifetime: 200,
            gravity: true
          }}
          trigger="click"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-center text-gray-600 dark:text-gray-300">
            🖱️ Clique para gerar partículas
          </p>
        </div>
      </div>
    </div>
  );
}

function AnimatedTextDemo() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Typewriter Effect:</h4>
          <AnimatedText
            text="Este texto aparece como se estivesse sendo digitado..."
            animation="typewriter"
            className="text-blue-600 dark:text-blue-400 font-mono"
          />
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Stagger Animation:</h4>
          <AnimatedText
            text="Cada letra aparece individualmente"
            animation="stagger"
            className="text-purple-600 dark:text-purple-400 font-bold text-lg"
          />
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Wave Effect:</h4>
          <AnimatedText
            text="Texto ondulante"
            animation="wave"
            className="text-green-600 dark:text-green-400 font-bold text-xl"
          />
        </div>
      </div>
    </div>
  );
}

function AR3DDemo() {
  return (
    <div className="space-y-4">
      <AR3DGallery />
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Experiência completa de AR/3D com detecção de superfícies e modelos interativos
      </div>
    </div>
  );
}

function IntegrationDemo() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
        <SmartAnimated preset="fadeIn">
          <h3 className="font-bold text-lg mb-4">🔗 Sistema Integrado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Frontend:</h4>
              <ul className="text-sm space-y-1">
                <li>✨ Animações inteligentes</li>
                <li>🤖 Chat AI integrado</li>
                <li>🥽 Experiências AR/3D</li>
                <li>🎨 Sistema de temas</li>
                <li>⚡ Cache inteligente</li>
                <li>📡 Streaming WebRTC</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Tecnologias Avançadas:</h4>
              <ul className="text-sm space-y-1">
                <li>🧠 Machine Learning</li>
                <li>⛓️ Blockchain & Web3</li>
                <li>📱 Mobile otimizado</li>
                <li>🚀 SEO avançado</li>
                <li>📊 Analytics integrado</li>
                <li>🔔 Sistema de notificações</li>
              </ul>
            </div>
          </div>
        </SmartAnimated>
      </div>
      
      <AnimatedText
        text="Todas as funcionalidades trabalham em harmonia para criar uma experiência única e inovadora!"
        animation="stagger"
        className="text-center text-gray-700 dark:text-gray-300"
      />
    </div>
  );
}

// Novos componentes de demo
function SmartCacheDemo() {
  return (
    <div className="space-y-4">
      <CacheMonitor />
    </div>
  );
}

function WebRTCDemo() {
  return (
    <div className="space-y-4">
      <StreamingStudio
        onSessionStart={() => console.log('Session started')}
        onSessionEnd={() => console.log('Session ended')}
      />
    </div>
  );
}

function MLDemo() {
  return (
    <div className="space-y-6">
      <MLDashboard />
      <RealTimeImageAnalysis />
    </div>
  );
}

function BlockchainDemo() {
  return (
    <div className="space-y-6">
      <Web3Dashboard />
      <NFTInteraction />
    </div>
  );
}

export default AdvancedFeaturesShowcase;