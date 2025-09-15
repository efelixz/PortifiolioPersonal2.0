# Portfolio Jefferson Felix

Portfolio pessoal desenvolvido com React, TypeScript, Tailwind CSS e Vite. Projeto exportado do Builder.io e reorganizado com estrutura escalável.

## 🚀 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── Header.tsx      # Header com navegação e toggle de tema
│   ├── Footer.tsx      # Footer global
│   ├── Layout.tsx      # Layout base da aplicação
│   ├── CardProjeto.tsx # Card de projeto
│   ├── Skills.tsx      # Seção de habilidades
│   └── BotaoHiringPack.tsx # Botão para gerar hiring pack
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── Projetos.tsx    # Lista de projetos
│   ├── Sobre.tsx       # Sobre mim
│   ├── Contato.tsx     # Formulário de contato
│   └── NotFound.tsx    # Página 404
├── hooks/              # Hooks customizados
│   └── useTheme.tsx    # Hook para gerenciar tema dark/light
├── utils/              # Funções utilitárias
│   ├── emailjs.ts      # Configuração EmailJS
│   ├── pdfGenerator.ts # Geração de PDFs
│   └── helpers.ts      # Funções auxiliares
├── styles/             # Estilos globais
│   └── global.css      # CSS global com Tailwind
└── lib/                # Bibliotecas e configurações
    └── utils.ts        # Utilitários do shadcn/ui
```

## 🛠️ Tecnologias

- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool e dev server
- **React Router v6** - Roteamento
- **Framer Motion** - Animações
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## 🎨 Funcionalidades

- ✅ **Sistema de Temas Avançado** - Dark/Light/System mode com persistência
  - Toggle persistente no localStorage
  - Transições suaves entre temas
  - Cores adaptativas em todos os componentes
  - Meta theme-color para mobile
  - Hooks utilitários (useThemeValue, useThemeClasses)
- ✅ **Responsivo** - Design adaptável para todos os dispositivos
- ✅ **Roteamento** - Navegação SPA com React Router
- ✅ **Animações Performance-Friendly** - Transições suaves com Framer Motion
  - Hero com fade + slide in otimizado
  - Cards com hover scale + sombra + cor da borda
  - Skills com barra de progresso animada ao scroll
  - Botões com hover effects e movimento suave
  - Footer com fade-in ao aparecer na tela
  - Suporte a `prefers-reduced-motion`
- ✅ **Componentes Reutilizáveis** - Arquitetura modular
- ✅ **TypeScript** - Tipagem completa
- ✅ **Otimização de Performance** - Will-change, viewport margins, once animations
- 🔄 **EmailJS** - Formulário de contato funcional (a implementar)
- 🔄 **PDF Generator** - Geração de CV e Hiring Pack (a implementar)

## 🚀 Como Executar

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Verificar tipos TypeScript
npm run typecheck
```

### Produção
```bash
# Build otimizado para produção
npm run build

# Preview do build local
npm run preview

# Deploy no GitHub Pages
npm run deploy
```

### Deploy Automático
O projeto está configurado para deploy automático no GitHub Pages via GitHub Actions:

1. **Push para main** → Deploy automático
2. **Pull Request** → Build de verificação
3. **URL**: `https://username.github.io/portfolio-jefferson/`

Ver [DEPLOY.md](DEPLOY.md) para instruções detalhadas.

## 📱 Páginas

- **/** - Home com hero, skills e projetos destacados
- **/projetos** - Lista completa de projetos com filtros
- **/sobre** - Informações pessoais, experiência e skills
- **/contato** - Formulário de contato e informações

## ✨ Animações Implementadas

### Performance-Friendly Features:
- **Viewport Margins** - Animações começam antes do elemento aparecer
- **Once Animations** - Executam apenas uma vez para melhor performance
- **Reduced Motion Support** - Respeita preferências de acessibilidade
- **Will-Change Optimization** - Otimização de GPU para transforms
- **Easing Curves** - Curvas de animação naturais e suaves

### Tipos de Animação:
- **Hero Section**: Fade + slide com stagger timing
- **Cards**: Hover com scale, sombra e border glow
- **Skills**: Barras de progresso animadas com delay sequencial
- **Buttons**: Hover lift + scale + shadow enhancement
- **Footer**: Fade-in suave ao scroll
- **404 Page**: Gradient text animation + scale entrance

## 📧 Configuração do Formulário de Contato

### EmailJS Setup (Principal)
1. Crie uma conta em [EmailJS](https://www.emailjs.com/)
2. Configure um serviço (Gmail, Outlook, etc.)
3. Crie um template de email
4. Copie `.env.example` para `.env` e configure:
   ```bash
   VITE_EMAILJS_SERVICE_ID=seu_service_id
   VITE_EMAILJS_TEMPLATE_ID=seu_template_id
   VITE_EMAILJS_PUBLIC_KEY=sua_public_key
   ```

### Integrações Alternativas (Opcionais)
- **Zapier**: Webhook para automações
- **Google Sheets**: Salvar contatos em planilha
- **Notion**: Database de contatos
- **Airtable**: Base de dados estruturada

### Funcionalidades do Formulário
- ✅ **Validação HTML5 + Custom** - Campos obrigatórios com feedback
- ✅ **Rate Limiting** - Máximo 3 tentativas por hora
- ✅ **Sanitização** - Limpeza de dados de entrada
- ✅ **Feedback Visual** - Loading, sucesso e erro
- ✅ **Múltiplos Serviços** - EmailJS + backups automáticos
- ✅ **Modo Demo** - Funciona sem configuração para testes

## 📄 Geração de PDF

### Funcionalidades Implementadas
- ✅ **Hiring Pack PDF** - Documento completo com projetos e habilidades
- ✅ **CV PDF** - Versão compacta para recrutadores
- ✅ **Export de Seções** - Qualquer elemento HTML pode ser exportado
- ✅ **Layout Consistente** - Largura fixa e cores otimizadas para PDF
- ✅ **Progress Feedback** - Indicador visual durante geração

### Tecnologias Utilizadas
- **html2canvas** - Captura de elementos HTML
- **jsPDF** - Geração de arquivos PDF
- **Otimizações** - Qualidade alta, compressão e metadata

## 🎮 Demos Interativas

### Avatar 3D Lazy-Load
- ✅ **Three.js Integration** - Renderização 3D com @react-three/fiber
- ✅ **Lazy Loading** - Carregamento sob demanda para performance
- ✅ **Fallback Animado** - Placeholder com pulse enquanto carrega
- ✅ **Error Boundaries** - Tratamento robusto de erros
- ✅ **Intersection Observer** - Carrega apenas quando visível

### Editor de Código Interativo
- ✅ **Execução em Tempo Real** - JavaScript executado no navegador
- ✅ **Syntax Highlighting** - Destaque de sintaxe (placeholder)
- ✅ **Copy/Paste** - Funcionalidades de clipboard
- ✅ **Exemplos Pré-definidos** - Templates para começar rapidamente

### Preview Responsivo
- ✅ **Multi-viewport** - Mobile, tablet e desktop
- ✅ **Live Reload** - Atualização automática do preview
- ✅ **Sandbox Seguro** - Execução isolada do código
- ✅ **External Window** - Abrir preview em nova janela

### WASM Integration (Placeholder)
- ✅ **esbuild-wasm Ready** - Preparado para compilação WASM
- ✅ **Progress Feedback** - Indicador de compilação
- ✅ **Performance Optimized** - Lazy loading de bibliotecas WASM

## 📊 Analytics & Tracking

### Sistema Completo de Analytics
- ✅ **Plausible Analytics** - Privacy-focused, GDPR compliant
- ✅ **Google Analytics 4** - Comprehensive tracking
- ✅ **Consent Banner** - GDPR/LGPD compliant com opt-in
- ✅ **Event Tracking** - Eventos predefinidos para todas as interações
- ✅ **LocalStorage Fallback** - Backup quando providers falham
- ✅ **Performance Tracking** - Core Web Vitals automáticos
- ✅ **Error Tracking** - Captura automática de erros

### Eventos Implementados
- `click_ver_case` - Clique em "Ver Case" dos projetos
- `click_baixar_cv` - Download do CV
- `submit_contact` - Envio do formulário de contato
- `change_theme` - Mudança de tema
- `interact_3d_avatar` - Interação com avatar 3D
- `use_demo_editor` - Uso do editor de código
- `click_social_link` - Cliques em redes sociais

### Configuração
```bash
# Variáveis de ambiente (.env.local)
VITE_ANALYTICS_PROVIDER=plausible
VITE_PLAUSIBLE_DOMAIN=seu-dominio.com
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Como Usar
```tsx
import { useTrackInteraction } from '@/hooks/useAnalytics';

const { trackProjectInteraction } = useTrackInteraction();
trackProjectInteraction('case', 'Projeto X', { type: 'portfolio' });
```

Ver [ANALYTICS_SETUP.md](ANALYTICS_SETUP.md) para configuração completa.

## 🎯 Status do Projeto

### ✅ Implementado
1. **Formulário de Contato** - EmailJS + validação completa
2. **Geração de PDF** - Hiring Pack e CV com html2canvas + jsPDF
3. **Demos Interativas** - Avatar 3D, editor de código, preview responsivo
4. **Sistema de Temas** - Dark/light mode com persistência
5. **Analytics & Tracking** - Sistema completo com consent banner
6. **Deploy GitHub Pages** - Configuração completa com GitHub Actions

### 🔄 Em Desenvolvimento
1. **Conteúdo Real** - Adicionar projetos e experiências reais
2. **Otimizações** - Lazy loading de imagens e performance
3. **Testes** - Unitários e de integração
4. **SEO** - Meta tags dinâmicas e sitemap
5. **PWA** - Service Worker e offline support

### 🚀 Deploy
- **GitHub Pages**: Configurado com deploy automático
- **Custom Domain**: Pronto para configuração
- **Performance**: Otimizado com code splitting e lazy loading

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Desenvolvido com ❤️ por Jefferson Felix