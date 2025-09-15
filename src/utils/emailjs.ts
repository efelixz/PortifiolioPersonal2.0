// EmailJS configuration and utilities
// Install: npm install @emailjs/browser

interface EmailData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

import { integrationConfig, validateConfig } from './integrations';

// EmailJS Configuration
const EMAILJS_CONFIG = integrationConfig.emailjs;

export const sendEmail = async (data: EmailData): Promise<EmailResponse> => {
  try {
    // Validate data before sending
    const validation = validateFormData(data);
    if (!validation.isValid) {
      return {
        success: false,
        message: validation.message,
      };
    }

    // Check if EmailJS is configured
    const configValidation = validateConfig();
    const isConfigured = configValidation.isValid;

    if (isConfigured) {
      // Use real EmailJS when configured
      try {
        const { default: emailjs } = await import('@emailjs/browser');
        
        const result = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          {
            from_name: data.name,
            from_email: data.email,
            message: data.message,
            subject: data.subject || 'Nova mensagem do portfolio',
            to_name: 'Jefferson Felix',
            reply_to: data.email,
          },
          EMAILJS_CONFIG.publicKey
        );

        console.log('EmailJS success:', result);
        
        // Also send to alternative services
        await sendToAlternativeServices(data);
        
        return {
          success: true,
          message: 'Mensagem enviada com sucesso! Retornarei em breve.',
        };
      } catch (emailError) {
        console.error('EmailJS error:', emailError);
        
        // Try alternative services as fallback
        try {
          await sendToAlternativeServices(data);
          return {
            success: true,
            message: 'Mensagem enviada via serviço alternativo. Retornarei em breve.',
          };
        } catch (fallbackError) {
          throw emailError; // Throw original error
        }
      }
    } else {
      // Demo mode when not configured
      console.log('Demo mode - EmailJS not configured');
      console.log('Missing config keys:', configValidation.missingKeys);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Email would be sent:', data);
      
      // Simulate success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate for demo
      
      if (isSuccess) {
        // Also send to alternative services
        await sendToAlternativeServices(data);
        
        return {
          success: true,
          message: 'Mensagem enviada com sucesso! (Modo demonstração) Retornarei em breve.',
        };
      } else {
        throw new Error('Simulated failure for demo');
      }
    }
    
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: 'Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Alternative services for backup (Zapier, Google Sheets, etc.)
const sendToAlternativeServices = async (data: EmailData): Promise<void> => {
  const promises: Promise<void>[] = [];

  // Send to Zapier if configured
  if (integrationConfig.zapier.webhookUrl !== 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/') {
    promises.push(sendToZapier(data));
  }

  // Send to Google Sheets if configured
  if (integrationConfig.googleSheets.sheetId !== 'your_google_sheet_id') {
    promises.push(sendToGoogleSheets(data));
  }

  // Send to Notion if configured
  if (integrationConfig.notion.databaseId !== 'your_notion_database_id') {
    promises.push(sendToNotion(data));
  }

  // Send to Airtable if configured
  if (integrationConfig.airtable.baseId !== 'your_airtable_base_id') {
    promises.push(sendToAirtable(data));
  }

  // Execute all promises but don't fail if some services are down
  const results = await Promise.allSettled(promises);
  
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.warn(`Alternative service ${index} failed:`, result.reason);
    }
  });

  console.log('Alternative services notified:', data);
};

const sendToZapier = async (data: EmailData): Promise<void> => {
  const response = await fetch(integrationConfig.zapier.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: new Date().toISOString(),
      source: 'portfolio_contact_form',
    }),
  });

  if (!response.ok) {
    throw new Error(`Zapier webhook failed: ${response.statusText}`);
  }
};

const sendToGoogleSheets = async (data: EmailData): Promise<void> => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${integrationConfig.googleSheets.sheetId}/values/${integrationConfig.googleSheets.range}:append?valueInputOption=RAW&key=${integrationConfig.googleSheets.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          new Date().toISOString(),
          data.name,
          data.email,
          data.message,
          'portfolio_contact_form'
        ]]
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google Sheets API failed: ${response.statusText}`);
  }
};

const sendToNotion = async (data: EmailData): Promise<void> => {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${integrationConfig.notion.apiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: {
        database_id: integrationConfig.notion.databaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: data.name,
              },
            },
          ],
        },
        Email: {
          email: data.email,
        },
        Message: {
          rich_text: [
            {
              text: {
                content: data.message,
              },
            },
          ],
        },
        Date: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Notion API failed: ${response.statusText}`);
  }
};

const sendToAirtable = async (data: EmailData): Promise<void> => {
  const response = await fetch(
    `https://api.airtable.com/v0/${integrationConfig.airtable.baseId}/${integrationConfig.airtable.tableId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integrationConfig.airtable.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name: data.name,
          Email: data.email,
          Message: data.message,
          Date: new Date().toISOString(),
          Source: 'portfolio_contact_form',
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Airtable API failed: ${response.statusText}`);
  }
};

// Form validation
interface ValidationResult {
  isValid: boolean;
  message: string;
  errors: Record<string, string>;
}

export const validateFormData = (data: EmailData): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres';
  }

  // Email validation
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Email deve ter um formato válido';
  }

  // Message validation
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Mensagem deve ter pelo menos 10 caracteres';
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    message: isValid ? 'Dados válidos' : 'Por favor, corrija os erros no formulário',
    errors,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Utility to sanitize input data
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

// Rate limiting (simple in-memory implementation)
const emailAttempts = new Map<string, number[]>();

export const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const attempts = emailAttempts.get(email) || [];
  
  // Remove attempts older than 1 hour
  const recentAttempts = attempts.filter(time => now - time < 60 * 60 * 1000);
  
  // Allow max 3 attempts per hour
  if (recentAttempts.length >= 3) {
    return false;
  }
  
  recentAttempts.push(now);
  emailAttempts.set(email, recentAttempts);
  return true;
};