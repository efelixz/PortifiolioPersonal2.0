# 🚀 Deploy no GitHub Pages

Este guia explica como fazer deploy do portfolio no GitHub Pages mantendo todas as funcionalidades.

## 📋 Pré-requisitos

### 1. Repositório GitHub
```bash
# Criar repositório no GitHub com nome 'portfolio-jefferson'
# Clonar localmente
git clone https://github.com/SEU_USUARIO/portfolio-jefferson.git
cd portfolio-jefferson

# Adicionar arquivos do projeto
git add .
git commit -m "Initial commit: Portfolio Jefferson Felix"
git push origin main
```

### 2. Dependências Instaladas
```bash
npm install
```

## 🔧 Configuração

### Scripts Disponíveis
```json
{
  "dev": "vite",                    // Servidor de desenvolvimento
  "build": "vite build --config vite.config.prod.ts", // Build otimizado
  "preview": "vite preview",        // Preview do build local
  "predeploy": "npm run build",     // Pre-hook do deploy
  "deploy": "gh-pages -d dist",     // Deploy manual
  "typecheck": "tsc"                // Verificação de tipos
}
```

### Configurações Implementadas

#### 1. Base Path
```typescript
// vite.config.ts
base: mode === 'production' ? '/portfolio-jefferson/' : '/',
```

#### 2. SPA Routing
- `public/404.html` - Redireciona rotas para index.html
- `index.html` - Script para processar redirecionamentos
- `.nojekyll` - Desabilita processamento Jekyll

#### 3. Build Otimizado
- **Code Splitting** - Chunks separados por funcionalidade
- **Tree Shaking** - Remove código não utilizado
- **Minificação** - Terser com otimizações agressivas
- **Asset Optimization** - Compressão de CSS e JS

## 🚀 Deploy Manual

### Opção 1: Via npm script
```bash
npm run deploy
```

### Opção 2: Passo a passo
```bash
# 1. Build do projeto
npm run build

# 2. Deploy para gh-pages branch
npx gh-pages -d dist

# 3. Verificar deploy
# Acesse: https://SEU_USUARIO.github.io/portfolio-jefferson/
```

## 🤖 Deploy Automático (GitHub Actions)

### Configuração
O arquivo `.github/workflows/deploy.yml` está configurado para:

1. **Trigger**: Push na branch `main`
2. **Build**: Instala dependências e faz build
3. **Deploy**: Publica na branch `gh-pages`
4. **Verificação**: Type checking antes do deploy

### Ativação
1. Vá em **Settings** > **Pages** no seu repositório
2. Selecione **Source**: Deploy from a branch
3. Selecione **Branch**: gh-pages / (root)
4. Clique em **Save**

### Monitoramento
- **Actions tab** - Ver status dos deploys
- **Environments** - Ver histórico de deploys
- **Pages** - Ver URL e status da página

## 🔍 Verificação Pós-Deploy

### Checklist de Funcionalidades

#### ✅ Básicas
- [ ] Página carrega corretamente
- [ ] Navegação entre páginas funciona
- [ ] Tema dark/light persiste
- [ ] Responsividade em mobile

#### ✅ Avançadas
- [ ] Avatar 3D carrega (lazy loading)
- [ ] Demos interativas funcionam
- [ ] Formulário de contato funciona
- [ ] PDFs são gerados corretamente
- [ ] Animações Framer Motion funcionam

#### ✅ Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### Ferramentas de Teste
```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --upload.target=temporary-public-storage

# Bundle Analyzer
npm install -g vite-bundle-analyzer
npx vite-bundle-analyzer

# Performance Testing
npm install -g web-vitals-cli
web-vitals https://SEU_USUARIO.github.io/portfolio-jefferson/
```

## 🐛 Troubleshooting

### Problema: Página em branco
**Causa**: Base path incorreto
**Solução**:
```typescript
// vite.config.ts - verificar se o nome do repo está correto
base: '/portfolio-jefferson/', // Deve coincidir com nome do repo
```

### Problema: Rotas 404
**Causa**: SPA routing não configurado
**Solução**:
1. Verificar se `public/404.html` existe
2. Verificar script no `index.html`
3. Verificar se `.nojekyll` existe

### Problema: Assets não carregam
**Causa**: Paths relativos incorretos
**Solução**:
```typescript
// Usar paths absolutos ou relativos ao base
const imagePath = '/portfolio-jefferson/assets/image.jpg';
// ou usar import
import imagePath from '@/assets/image.jpg';
```

### Problema: TypeScript errors
**Causa**: Tipos não encontrados
**Solução**:
```bash
# Verificar tipos
npm run typecheck

# Instalar tipos faltantes
npm install --save-dev @types/node @types/react @types/react-dom
```

### Problema: Tailwind não funciona
**Causa**: PostCSS não configurado
**Solução**:
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Problema: Framer Motion não anima
**Causa**: Reduced motion ou SSR
**Solução**:
```typescript
// Verificar se está no cliente
if (typeof window !== 'undefined') {
  // Animações aqui
}
```

## 📊 Otimizações Implementadas

### Code Splitting
```typescript
// Chunks otimizados
manualChunks: {
  vendor: ['react', 'react-dom'],           // ~45KB
  router: ['react-router-dom'],             // ~15KB
  motion: ['framer-motion'],                // ~60KB
  three: ['three', '@react-three/fiber'],  // ~150KB (lazy)
  ui: ['@radix-ui/...'],                   // ~30KB
}
```

### Lazy Loading
```typescript
// Componentes pesados carregados sob demanda
const Avatar3DCanvas = lazy(() => import('./Avatar3DCanvas'));
const CodeEditor = lazy(() => import('./demos/CodeEditor'));
```

### Asset Optimization
```typescript
// Compressão de assets
terserOptions: {
  compress: {
    drop_console: true,    // Remove console.logs
    drop_debugger: true,   // Remove debuggers
  },
}
```

## 🔄 Atualizações

### Deploy de Hotfix
```bash
# 1. Fazer alterações
git add .
git commit -m "hotfix: correção crítica"

# 2. Push (trigger automático)
git push origin main

# 3. Aguardar deploy (2-5 minutos)
```

### Deploy Manual de Emergência
```bash
# Se GitHub Actions falhar
npm run build
npm run deploy
```

### Rollback
```bash
# Voltar para commit anterior
git revert HEAD
git push origin main

# Ou deploy manual de versão específica
git checkout COMMIT_HASH
npm run deploy
git checkout main
```

## 📈 Monitoramento

### Analytics
```html
<!-- Google Analytics (opcional) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking
```typescript
// Sentry (opcional)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  environment: "production",
});
```

### Performance Monitoring
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🎯 Próximos Passos

1. **Custom Domain** - Configurar domínio personalizado
2. **CDN** - Usar Cloudflare para cache global
3. **PWA** - Adicionar Service Worker
4. **SEO** - Meta tags dinâmicas
5. **Analytics** - Implementar tracking
6. **Monitoring** - Alertas de uptime

## 📞 Suporte

Se encontrar problemas:

1. **Verificar Actions** - GitHub Actions tab
2. **Verificar Logs** - Console do navegador
3. **Testar Local** - `npm run preview`
4. **Verificar Docs** - [GitHub Pages Docs](https://docs.github.com/en/pages)

---

**URL Final**: https://SEU_USUARIO.github.io/portfolio-jefferson/

**Status**: ✅ Pronto para deploy