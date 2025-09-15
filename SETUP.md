# 📧 Setup do Formulário de Contato

Este guia te ajudará a configurar o formulário de contato com EmailJS e serviços alternativos.

## 🚀 Setup Rápido (EmailJS)

### 1. Criar Conta EmailJS
1. Acesse [EmailJS](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email
1. No dashboard, vá em **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta
5. Anote o **Service ID**

### 3. Criar Template de Email
1. Vá em **Email Templates**
2. Clique em **Create New Template**
3. Use este template básico:

```html
Assunto: Nova mensagem do portfolio - {{subject}}

Olá Jefferson,

Você recebeu uma nova mensagem através do seu portfolio:

Nome: {{from_name}}
Email: {{from_email}}
Mensagem:
{{message}}

---
Enviado em: {{timestamp}}
```

4. Anote o **Template ID**

### 4. Configurar Chaves
1. Vá em **Account** > **General**
2. Anote sua **Public Key**

### 5. Configurar Variáveis de Ambiente
1. Copie `.env.example` para `.env`
2. Preencha as variáveis:

```bash
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

### 6. Instalar Dependência
```bash
npm install @emailjs/browser
```

## 🔧 Configurações Avançadas

### Zapier Integration
1. Crie uma conta no [Zapier](https://zapier.com/)
2. Crie um novo Zap com Webhook trigger
3. Copie a URL do webhook
4. Adicione ao `.env`:
```bash
VITE_ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/
```

### Google Sheets Integration
1. Ative a Google Sheets API no [Google Cloud Console](https://console.cloud.google.com/)
2. Crie credenciais de API
3. Crie uma planilha e compartilhe com a conta de serviço
4. Adicione ao `.env`:
```bash
VITE_GOOGLE_SHEET_ID=1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GOOGLE_SHEETS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Notion Integration
1. Crie uma integração no [Notion Developers](https://developers.notion.com/)
2. Crie um database com as propriedades: Name (title), Email (email), Message (rich_text), Date (date)
3. Compartilhe o database com sua integração
4. Adicione ao `.env`:
```bash
VITE_NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Airtable Integration
1. Crie uma base no [Airtable](https://airtable.com/)
2. Obtenha sua API key em Account > Developer Hub
3. Adicione ao `.env`:
```bash
VITE_AIRTABLE_BASE_ID=appxxxxxxxxxxxxxxx
VITE_AIRTABLE_TABLE_ID=tblxxxxxxxxxxxxxxx
VITE_AIRTABLE_API_KEY=keyxxxxxxxxxxxxxxx
```

## 🧪 Testando

### Modo Demo
- O formulário funciona em modo demo sem configuração
- Simula envio com 80% de taxa de sucesso
- Útil para desenvolvimento e testes

### Teste Real
1. Configure pelo menos o EmailJS
2. Preencha e envie o formulário
3. Verifique se recebeu o email
4. Verifique o console para logs dos serviços alternativos

## 🔒 Segurança

### Rate Limiting
- Máximo 3 tentativas por email por hora
- Implementado em memória (resetado ao reiniciar)
- Para produção, considere usar Redis ou similar

### Validação
- Validação no frontend e backend
- Sanitização de dados de entrada
- Proteção contra XSS básica

### Variáveis de Ambiente
- Nunca commite o arquivo `.env`
- Use variáveis de ambiente no deploy
- As chaves do EmailJS são públicas por design

## 🚀 Deploy

### Vercel
1. Conecte seu repositório
2. Adicione as variáveis de ambiente no dashboard
3. Deploy automático

### Netlify
1. Conecte seu repositório
2. Configure as variáveis em Site Settings > Environment Variables
3. Deploy automático

## 🐛 Troubleshooting

### EmailJS não funciona
- Verifique se as variáveis estão corretas
- Confirme se o serviço está ativo no dashboard
- Verifique se o template tem as variáveis corretas

### Formulário não envia
- Abra o console do navegador
- Verifique se há erros de CORS
- Confirme se a validação está passando

### Serviços alternativos falham
- Eles são opcionais e não afetam o EmailJS
- Verifique as configurações específicas de cada serviço
- Logs aparecem no console

## 📞 Suporte

Se precisar de ajuda:
1. Verifique os logs no console
2. Confirme as configurações no `.env`
3. Teste em modo demo primeiro
4. Consulte a documentação do EmailJS