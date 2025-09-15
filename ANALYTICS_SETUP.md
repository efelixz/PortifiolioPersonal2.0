# 📊 Sistema de Analytics e Tracking

Este guia explica como configurar e usar o sistema completo de analytics com consent banner e tracking de eventos.

## 🚀 Funcionalidades Implementadas

### Analytics Providers
- ✅ **Plausible Analytics** - Privacy-focused, GDPR compliant
- ✅ **Google Analytics 4** - Comprehensive tracking
- ✅ **Dual Provider** - Use both simultaneously
- ✅ **LocalStorage Fallback** - Backup quando providers falham

### Consent Management
- ✅ **Consent Banner** - GDPR/LGPD compliant
- ✅ **Granular Permissions** - Functional, Analytics, Marketing
- ✅ **Persistent Storage** - Lembra preferências por 6 meses
- ✅ **Easy Revocation** - Usuário pode revogar a qualquer momento

### Event Tracking
- ✅ **Predefined Events** - Eventos importantes pré-configurados
- ✅ **Custom Events** - Sistema flexível para novos eventos
- ✅ **Error Tracking** - Captura automática de erros
- ✅ **Performance Metrics** - Core Web Vitals automáticos

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local`:

```bash
# Analytics Provider: 'plausible', 'ga4', 'both', or 'none'
VITE_ANALYTICS_PROVIDER=plausible

# Plausible Configuration
VITE_PLAUSIBLE_DOMAIN=seu-dominio.com
VITE_PLAUSIBLE_API_HOST=https://plausible.io

# Google Analytics 4 Configuration
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Development Settings
VITE_ANALYTICS_DEV=true
```

### 2. Plausible Setup

1. **Criar Conta**: [plausible.io](https://plausible.io)
2. **Adicionar Site**: Configurar domínio
3. **Configurar Variáveis**:
   ```bash
   VITE_ANALYTICS_PROVIDER=plausible
   VITE_PLAUSIBLE_DOMAIN=seu-dominio.com
   ```

### 3. Google Analytics 4 Setup

1. **Criar Propriedade**: [analytics.google.com](https://analytics.google.com)
2. **Obter Measurement ID**: GA_MEASUREMENT_ID
3. **Configurar Variáveis**:
   ```bash
   VITE_ANALYTICS_PROVIDER=ga4
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### 4. Dual Provider Setup

```bash
VITE_ANALYTICS_PROVIDER=both
VITE_PLAUSIBLE_DOMAIN=seu-dominio.com
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 📋 Eventos Implementados

### Navegação
```typescript
// Visualização de página (automático)
trackEvent.pageView('/projetos', 'Projetos - Jefferson Felix');

// Clique em navegação
trackEvent.clickNavigation('/sobre', 'header_menu');
```

### Projetos
```typescript
// Ver case de projeto
trackEvent.clickVerCase('Dashboard SaaS', 'portfolio');

// Ver código fonte
trackEvent.clickVerCodigo('Dashboard SaaS', 'github');

// Abrir demo
trackEvent.clickDemo('Dashboard SaaS', 'live');
```

### Downloads
```typescript
// Baixar CV
trackEvent.clickBaixarCV('pdf');

// Baixar Hiring Pack
trackEvent.clickHiringPack('complete');
```

### Formulário de Contato
```typescript
// Envio bem-sucedido
trackEvent.submitContact({
  name: 'João Silva',
  email: 'joao@email.com',
  hasMessage: true
});

// Erro no formulário
trackEvent.contactFormError('validation_failed', 'email');
```

### Tema
```typescript
// Mudança de tema
trackEvent.changeTheme('dark', 'light');
```

### Interações 3D
```typescript
// Interação com avatar 3D
trackEvent.interact3DAvatar('hover');
```

### Demos Interativas
```typescript
// Uso do editor de código
trackEvent.useDemoEditor('javascript', 150);

// Uso do preview responsivo
trackEvent.useLivePreview('mobile');
```

### Links Sociais
```typescript
// Clique em link social
trackEvent.clickSocialLink('linkedin', 'footer');
```

### Performance
```typescript
// Métrica de performance (automático)
trackEvent.performanceMetric('LCP', 1250, 'ms');
```

### Erros
```typescript
// Erro capturado (automático)
trackEvent.error('javascript_error', 'Cannot read property', 'Avatar3D');
```

## 🎯 Uso nos Componentes

### Hook Principal
```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { hasConsent, track } = useAnalytics();
  
  const handleClick = () => {
    track.clickNavigation('/projetos', 'button');
  };
  
  return (
    <button onClick={handleClick}>
      Ver Projetos
    </button>
  );
}
```

### Hook de Interações
```typescript
import { useTrackInteraction } from '@/hooks/useAnalytics';

function ProjectCard({ title }) {
  const { trackProjectInteraction } = useTrackInteraction();
  
  const handleCaseClick = () => {
    trackProjectInteraction('case', title, { type: 'portfolio' });
  };
  
  return (
    <button onClick={handleCaseClick}>
      Ver Case
    </button>
  );
}
```

### Hook de Performance
```typescript
import { usePerformanceTracking } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackCustomMetric } = usePerformanceTracking();
  
  useEffect(() => {
    const startTime = performance.now();
    
    // Alguma operação pesada
    heavyOperation().then(() => {
      const duration = performance.now() - startTime;
      trackCustomMetric('heavy_operation_duration', duration, 'ms');
    });
  }, []);
}
```

## 🍪 Consent Banner

### Configuração Automática
O consent banner aparece automaticamente quando:
- Usuário nunca deu consentimento
- Consentimento expirou (6 meses)
- Configuração de consent mudou

### Personalização
```typescript
import ConsentBanner from '@/components/ConsentBanner';

function App() {
  const handleConsentChange = (granted: boolean) => {
    console.log('Consent changed:', granted);
  };
  
  return (
    <div>
      {/* Seu app */}
      <ConsentBanner onConsentChange={handleConsentChange} />
    </div>
  );
}
```

### Configurações de Privacidade
```typescript
import { PrivacySettings } from '@/components/ConsentBanner';

function SettingsPage() {
  return (
    <div>
      <h1>Configurações</h1>
      <PrivacySettings />
    </div>
  );
}
```

## 📊 Dados Coletados

### Dados Automáticos
- **Page Views**: URL, título, timestamp
- **Session Data**: Duração, atividade, dispositivo
- **Performance**: Core Web Vitals, métricas customizadas
- **Errors**: Tipo, mensagem, componente
- **Device Info**: Resolução, viewport, user agent

### Dados de Interação
- **Clicks**: Elemento, contexto, timestamp
- **Form Submissions**: Sucesso/falha, campos preenchidos
- **Downloads**: Tipo, formato
- **Theme Changes**: De/para tema
- **Social Links**: Plataforma, localização

### Dados NÃO Coletados
- ❌ Informações pessoais identificáveis
- ❌ Conteúdo de formulários (apenas metadados)
- ❌ Senhas ou dados sensíveis
- ❌ Localização precisa
- ❌ Dados sem consentimento

## 🔒 Privacidade e Segurança

### GDPR/LGPD Compliance
- ✅ Consentimento explícito antes da coleta
- ✅ Opção de revogar consentimento
- ✅ Dados anonimizados
- ✅ Retenção limitada (localStorage: 100 eventos)
- ✅ Transparência sobre dados coletados

### Segurança
- ✅ Dados enviados via HTTPS
- ✅ Rate limiting básico
- ✅ Sanitização de dados
- ✅ Error boundaries para falhas

### Fallbacks
- ✅ LocalStorage quando providers falham
- ✅ Graceful degradation sem analytics
- ✅ Console logging em desenvolvimento
- ✅ Retry mechanisms

## 🧪 Testes e Debug

### Modo Desenvolvimento
```bash
# Habilitar logs detalhados
VITE_ANALYTICS_DEV=true

# Desabilitar analytics
VITE_ANALYTICS_PROVIDER=none
```

### Console Commands
```javascript
// Ver resumo de analytics
console.log(analytics.getAnalyticsSummary());

// Ver eventos armazenados
console.log(analytics.getStoredEvents());

// Limpar eventos armazenados
analytics.clearStoredEvents();

// Revogar consentimento (teste)
analytics.revokeConsent();
```

### Verificação de Eventos
1. **Abra DevTools** → Console
2. **Interaja com o site** (cliques, navegação, etc.)
3. **Veja logs** no formato: `📊 Analytics Event: {...}`
4. **Verifique providers** (Plausible dashboard, GA4 real-time)

## 📈 Métricas Importantes

### Engagement
- **Page Views**: Páginas mais visitadas
- **Session Duration**: Tempo médio no site
- **Bounce Rate**: Taxa de rejeição
- **Return Visitors**: Visitantes recorrentes

### Conversions
- **Contact Form**: Taxa de conversão do formulário
- **CV Downloads**: Quantos baixaram o CV
- **Project Interactions**: Engajamento com projetos
- **Social Clicks**: Cliques em redes sociais

### Technical
- **Performance**: Core Web Vitals
- **Errors**: Taxa de erro por componente
- **Theme Usage**: Preferência dark/light
- **Device Types**: Mobile vs Desktop

### User Experience
- **Navigation Patterns**: Fluxo de navegação
- **Feature Usage**: Demos mais usadas
- **Interaction Depth**: Nível de engajamento
- **Exit Points**: Onde usuários saem

## 🔄 Manutenção

### Atualizações Regulares
- **Mensal**: Revisar métricas e otimizar
- **Trimestral**: Atualizar eventos baseado em uso
- **Semestral**: Revisar compliance e privacidade
- **Anual**: Audit completo do sistema

### Monitoramento
- **Plausible Dashboard**: Métricas em tempo real
- **GA4 Reports**: Análises detalhadas
- **Console Logs**: Erros e warnings
- **LocalStorage**: Eventos não enviados

### Troubleshooting
```bash
# Verificar configuração
npm run check-analytics

# Testar eventos
npm run test-analytics

# Limpar dados de teste
npm run clean-analytics
```

## 🚀 Próximas Melhorias

### Roadmap
1. **Heatmaps** - Mapas de calor de interação
2. **A/B Testing** - Testes A/B automáticos
3. **Cohort Analysis** - Análise de coortes
4. **Custom Dashboards** - Dashboards personalizados
5. **Real-time Alerts** - Alertas em tempo real

### Integrações Futuras
- **Hotjar** - Heatmaps e session recordings
- **Mixpanel** - Event tracking avançado
- **Amplitude** - Product analytics
- **PostHog** - Open-source analytics

---

**Status**: ✅ Implementado e funcional
**Compliance**: GDPR/LGPD ready
**Performance**: Otimizado com lazy loading