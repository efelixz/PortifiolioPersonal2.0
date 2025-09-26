import { useCallback, useState } from 'react';
import emailjs from '@emailjs/browser';

// Configurações do EmailJS (você precisa configurar no site do EmailJS)
const EMAILJS_CONFIG = {
  serviceId: 'service_portfolio', // Substitua pelo seu Service ID
  templateId: 'template_contact', // Substitua pelo seu Template ID
  publicKey: 'YOUR_PUBLIC_KEY', // Substitua pela sua Public Key
};

interface ContactFormData {
  nome: string;
  email: string;
  assunto?: string;
  mensagem: string;
}

interface UseContactFormReturn {
  sendEmail: (data: ContactFormData) => Promise<boolean>;
  isLoading: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export function useContactForm(): UseContactFormReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const sendEmail = useCallback(async (data: ContactFormData): Promise<boolean> => {
    setIsLoading(true);
    setStatus('loading');
    setMessage('');

    try {
      // Verificar se as configurações estão definidas
      if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
        // Modo demo - simular envio bem-sucedido
        await new Promise(resolve => setTimeout(resolve, 2000));
        setStatus('success');
        setMessage('Mensagem enviada com sucesso! (Modo demo - configure o EmailJS para envio real)');
        console.log('📧 Dados do formulário (modo demo):', data);
        return true;
      }

      // Envio real via EmailJS
      const templateParams = {
        from_name: data.nome,
        from_email: data.email,
        subject: data.assunto || 'Contato via Portfolio',
        message: data.mensagem,
        to_name: 'Jefferson Felix',
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      if (response.status === 200) {
        setStatus('success');
        setMessage('Mensagem enviada com sucesso! Retornarei em breve.');
        return true;
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setStatus('error');
      setMessage('Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sendEmail,
    isLoading,
    status,
    message,
  };
}

// Função para configurar o EmailJS (chame uma vez na inicialização da app)
export function initEmailJS() {
  if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
}

// Instruções para configuração do EmailJS
export const EMAIL_SETUP_INSTRUCTIONS = `
🔧 Para configurar o EmailJS:

1. Acesse https://www.emailjs.com/ e crie uma conta
2. Crie um Service (Gmail, Outlook, etc.)
3. Crie um Template de email
4. Obtenha sua Public Key
5. Substitua as configurações em useContactForm.tsx:
   - serviceId: 'seu_service_id'
   - templateId: 'seu_template_id' 
   - publicKey: 'sua_public_key'

Template de exemplo:
Assunto: Novo contato via Portfolio - {{subject}}
Corpo:
Nome: {{from_name}}
Email: {{from_email}}
Mensagem: {{message}}
`;