// Integration configurations for external services
// This file contains placeholders for various integration services

export interface IntegrationConfig {
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  zapier: {
    webhookUrl: string;
  };
  googleSheets: {
    sheetId: string;
    apiKey: string;
    range: string;
  };
  notion: {
    databaseId: string;
    apiKey: string;
  };
  airtable: {
    baseId: string;
    tableId: string;
    apiKey: string;
  };
}

// Default configuration (replace with your actual values)
export const integrationConfig: IntegrationConfig = {
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
  },
  zapier: {
    webhookUrl: import.meta.env.VITE_ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/',
  },
  googleSheets: {
    sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || 'your_google_sheet_id',
    apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'your_google_sheets_api_key',
    range: 'Sheet1!A:E', // Adjust range as needed
  },
  notion: {
    databaseId: import.meta.env.VITE_NOTION_DATABASE_ID || 'your_notion_database_id',
    apiKey: import.meta.env.VITE_NOTION_API_KEY || 'your_notion_api_key',
  },
  airtable: {
    baseId: import.meta.env.VITE_AIRTABLE_BASE_ID || 'your_airtable_base_id',
    tableId: import.meta.env.VITE_AIRTABLE_TABLE_ID || 'your_airtable_table_id',
    apiKey: import.meta.env.VITE_AIRTABLE_API_KEY || 'your_airtable_api_key',
  },
};

// Validation functions
export const validateConfig = (): { isValid: boolean; missingKeys: string[] } => {
  const missingKeys: string[] = [];
  
  if (integrationConfig.emailjs.serviceId === 'your_service_id') {
    missingKeys.push('VITE_EMAILJS_SERVICE_ID');
  }
  if (integrationConfig.emailjs.templateId === 'your_template_id') {
    missingKeys.push('VITE_EMAILJS_TEMPLATE_ID');
  }
  if (integrationConfig.emailjs.publicKey === 'your_public_key') {
    missingKeys.push('VITE_EMAILJS_PUBLIC_KEY');
  }
  
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
};

// Environment setup instructions
export const getSetupInstructions = (): string => {
  return `
# Environment Setup Instructions

## 1. EmailJS Setup
1. Create account at https://www.emailjs.com/
2. Create a service (Gmail, Outlook, etc.)
3. Create an email template
4. Add to .env:
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key

## 2. Zapier Setup (Optional)
1. Create a Zapier account
2. Create a webhook trigger
3. Add to .env:
   VITE_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/YOUR_ID/

## 3. Google Sheets Setup (Optional)
1. Enable Google Sheets API
2. Create API credentials
3. Share sheet with service account
4. Add to .env:
   VITE_GOOGLE_SHEET_ID=your_sheet_id
   VITE_GOOGLE_SHEETS_API_KEY=your_api_key

## 4. Notion Setup (Optional)
1. Create Notion integration
2. Create database with properties: Name, Email, Message, Date
3. Add to .env:
   VITE_NOTION_DATABASE_ID=your_database_id
   VITE_NOTION_API_KEY=your_integration_token

## 5. Airtable Setup (Optional)
1. Create Airtable base
2. Get API key from account settings
3. Add to .env:
   VITE_AIRTABLE_BASE_ID=your_base_id
   VITE_AIRTABLE_TABLE_ID=your_table_id
   VITE_AIRTABLE_API_KEY=your_api_key
`;
};