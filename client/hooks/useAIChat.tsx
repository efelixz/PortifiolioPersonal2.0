import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos para o chat AI
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  type?: 'text' | 'code' | 'link' | 'image';
  metadata?: {
    language?: string;
    confidence?: number;
    intent?: string;
    entities?: Array<{ type: string; value: string }>;
  };
}

interface ChatState {
  isOpen: boolean;
  isTyping: boolean;
  messages: Message[];
  context: string[];
  personality: 'professional' | 'friendly' | 'technical';
}

interface AIResponse {
  content: string;
  type: 'text' | 'code' | 'link';
  confidence: number;
  intent: string;
  followUp?: string[];
}

// Hook principal do AI Chat
export function useAIChat() {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    isTyping: false,
    messages: [],
    context: [],
    personality: 'professional'
  });

  const conversationHistory = useRef<Message[]>([]);
  const abortController = useRef<AbortController | null>(null);

  // Inicializar chat com mensagem de boas-vindas
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateMessageId(),
      content: "👋 Olá! Sou o assistente AI do Jefferson. Posso te ajudar com informações sobre projetos, tecnologias, experiência profissional ou qualquer dúvida sobre o portfólio. Como posso te ajudar?",
      sender: 'ai',
      timestamp: Date.now(),
      type: 'text',
      metadata: {
        intent: 'greeting',
        confidence: 1.0
      }
    };

    setChatState(prev => ({
      ...prev,
      messages: [welcomeMessage]
    }));
  }, []);

  // Abrir/fechar chat
  const toggleChat = useCallback(() => {
    setChatState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  // Enviar mensagem
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: generateMessageId(),
      content: content.trim(),
      sender: 'user',
      timestamp: Date.now(),
      type: 'text'
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));

    conversationHistory.current.push(userMessage);

    // Cancelar requisição anterior se existir
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    try {
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Gerar resposta da AI
      const aiResponse = await generateAIResponse(content, conversationHistory.current);

      const aiMessage: Message = {
        id: generateMessageId(),
        content: aiResponse.content,
        sender: 'ai',
        timestamp: Date.now(),
        type: aiResponse.type,
        metadata: {
          confidence: aiResponse.confidence,
          intent: aiResponse.intent
        }
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false,
        context: [...prev.context, content].slice(-5) // Manter últimas 5 mensagens no contexto
      }));

      conversationHistory.current.push(aiMessage);

      // Adicionar follow-up se disponível
      if (aiResponse.followUp && aiResponse.followUp.length > 0) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: generateMessageId(),
            content: `💡 Você também pode perguntar: ${aiResponse.followUp!.join(', ')}`,
            sender: 'ai',
            timestamp: Date.now(),
            type: 'text',
            metadata: {
              intent: 'follow_up',
              confidence: 0.8
            }
          };

          setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, followUpMessage]
          }));
        }, 2000);
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Requisição foi cancelada
      }

      // Mensagem de erro
      const errorMessage: Message = {
        id: generateMessageId(),
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        sender: 'ai',
        timestamp: Date.now(),
        type: 'text',
        metadata: {
          intent: 'error',
          confidence: 1.0
        }
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false
      }));
    }
  }, []);

  // Limpar conversa
  const clearChat = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.slice(0, 1), // Manter apenas mensagem de boas-vindas
      context: []
    }));
    conversationHistory.current = [];
  }, []);

  // Alterar personalidade
  const setPersonality = useCallback((personality: 'professional' | 'friendly' | 'technical') => {
    setChatState(prev => ({ ...prev, personality }));
  }, []);

  return {
    chatState,
    toggleChat,
    sendMessage,
    clearChat,
    setPersonality
  };
}

// Componente do Chat AI
interface AIChatProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export function AIChat({ isOpen, onToggle, className = '' }: AIChatProps) {
  const { chatState, sendMessage, clearChat, setPersonality } = useAIChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Focar input quando abrir
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  }, [inputValue, sendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Sugestões rápidas
  const quickSuggestions = [
    "Quais são as principais tecnologias?",
    "Mostre alguns projetos interessantes",
    "Como posso entrar em contato?",
    "Qual é a experiência profissional?",
    "Tem disponibilidade para freelance?"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className={`fixed bottom-20 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {chatState.isTyping ? 'Digitando...' : 'Online'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Personalidade */}
              <select 
                value={chatState.personality}
                onChange={(e) => setPersonality(e.target.value as any)}
                className="text-xs bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
              >
                <option value="professional">Profissional</option>
                <option value="friendly">Amigável</option>
                <option value="technical">Técnico</option>
              </select>
              
              <button
                onClick={clearChat}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Limpar conversa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              
              <button
                onClick={onToggle}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatState.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {chatState.isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                    <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {chatState.messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sugestões:</p>
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                className="flex-1 resize-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-20"
                rows={1}
                disabled={chatState.isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || chatState.isTyping}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Componente para renderizar mensagens
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
        }`}
      >
        {message.type === 'code' ? (
          <pre className="text-sm overflow-x-auto">
            <code>{message.content}</code>
          </pre>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        )}
        
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {message.metadata?.confidence && message.metadata.confidence < 0.8 && (
            <span className="ml-2">⚠️</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Botão flutuante para abrir o chat
export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Simular notificação após um tempo
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnread(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleToggle}
        className={`fixed bottom-6 right-24 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg z-40 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}

        {hasUnread && !isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </motion.button>

      <AIChat isOpen={isOpen} onToggle={handleToggle} />
    </>
  );
}

// Funções auxiliares
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Simulação de AI - em produção, conectar com OpenAI/Claude/etc
async function generateAIResponse(userMessage: string, history: Message[]): Promise<AIResponse> {
  const lowerMessage = userMessage.toLowerCase();
  
  // Análise de intenção simples
  const intents = {
    greeting: /\b(olá|oi|hello|hi|bom dia|boa tarde|boa noite)\b/,
    projects: /\b(projeto|portfolio|trabalho|desenvolvimento|aplicação)\b/,
    technologies: /\b(tecnologia|stack|linguagem|framework|react|node|javascript|typescript)\b/,
    contact: /\b(contato|email|telefone|linkedin|whatsapp|contratar)\b/,
    experience: /\b(experiência|tempo|anos|carreira|profissional)\b/,
    availability: /\b(disponível|freelance|trabalho|vaga|oportunidade)\b/,
    skills: /\b(habilidade|skill|competência|conhecimento)\b/
  };

  let intent = 'general';
  let confidence = 0.7;

  for (const [key, regex] of Object.entries(intents)) {
    if (regex.test(lowerMessage)) {
      intent = key;
      confidence = 0.9;
      break;
    }
  }

  // Gerar resposta baseada na intenção
  const responses: Record<string, { content: string; followUp?: string[] }> = {
    greeting: {
      content: "Olá! É um prazer falar com você! 😊 Estou aqui para te ajudar com qualquer informação sobre o Jefferson e seus projetos. O que gostaria de saber?",
      followUp: ["Quais são os principais projetos?", "Tecnologias utilizadas", "Como entrar em contato?"]
    },
    
    projects: {
      content: `🚀 O Jefferson trabalhou em diversos projetos interessantes! Alguns destaques:

• **Portfolio 2.0** - Sistema completo com temas, mobile optimization e SEO avançado
• **E-commerce Platform** - Plataforma completa com painel admin e pagamentos
• **Task Management App** - Aplicação de produtividade com colaboração em tempo real
• **API Gateway** - Microserviços com autenticação JWT e rate limiting

Todos os projetos utilizam tecnologias modernas como React, Node.js, TypeScript e AWS.`,
      followUp: ["Ver código no GitHub", "Tecnologias específicas", "Processo de desenvolvimento"]
    },
    
    technologies: {
      content: `💻 Stack principal do Jefferson:

**Frontend:**
• React/Next.js • TypeScript • Tailwind CSS
• Framer Motion • Zustand/Redux • PWA

**Backend:**
• Node.js • Express/Fastify • PostgreSQL/MongoDB
• JWT Auth • Docker • AWS/Vercel

**Mobile:**
• React Native • Expo • Gesture Handler

**DevOps:**
• GitHub Actions • Docker • AWS EC2/S3`,
      followUp: ["Experiência com cada tecnologia", "Projetos usando essas techs", "Está aprendendo algo novo?"]
    },
    
    contact: {
      content: `📞 Formas de contato com o Jefferson:

• **Email:** jefferson@email.com
• **LinkedIn:** /in/jefferson-araujo
• **GitHub:** /efelixz
• **WhatsApp:** (11) 99999-9999

Ele responde rapidamente e está sempre aberto para discutir novos projetos e oportunidades! 🤝`,
      followUp: ["Melhor horário para contato", "Disponibilidade atual", "Tipos de projeto de interesse"]
    },
    
    experience: {
      content: `👨‍💻 Experiência profissional do Jefferson:

• **3+ anos** como Desenvolvedor Full Stack
• **50+ projetos** entregues com sucesso
• **Especialização** em React e Node.js
• **Experiência** com equipes remotas e metodologias ágeis
• **Mentoria** de desenvolvedores júnior

Foco em código limpo, testes automatizados e melhores práticas de desenvolvimento.`,
      followUp: ["Empresas onde trabalhou", "Principais conquistas", "Certificações"]
    },
    
    availability: {
      content: `✅ Status atual de disponibilidade:

• **Freelance:** Disponível para projetos
• **Tempo parcial:** Aceita consultorias
• **Projetos de interesse:** Web apps, APIs, Mobile
• **Orçamento:** Baseado no escopo do projeto

Prefere projetos com pelo menos 2-3 meses de duração para entregar valor máximo. Sempre disposto a discutir ideias inovadoras! 💡`,
      followUp: ["Solicitar orçamento", "Portfólio de clientes", "Processo de trabalho"]
    },
    
    general: {
      content: `Hmm, não tenho certeza sobre isso específicamente. Você poderia reformular a pergunta? 

Posso te ajudar com informações sobre:
• Projetos e portfolio
• Tecnologias e habilidades  
• Experiência profissional
• Contato e disponibilidade

O que mais te interessa saber sobre o Jefferson? 🤔`,
      followUp: ["Ver projetos", "Tecnologias", "Entrar em contato"]
    }
  };

  const response = responses[intent] || responses.general;
  
  return {
    content: response.content,
    type: 'text',
    confidence,
    intent,
    followUp: response.followUp
  };
}