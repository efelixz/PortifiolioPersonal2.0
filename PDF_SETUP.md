# 📄 Setup da Geração de PDF

Este guia explica como configurar e usar a funcionalidade de geração de PDF do Hiring Pack e CV.

## 🚀 Instalação

### Dependências Necessárias
```bash
npm install jspdf html2canvas
```

### Tipos TypeScript (opcional)
```bash
npm install --save-dev @types/jspdf
```

## 🎯 Funcionalidades

### 1. Hiring Pack PDF
- Documento completo com todos os projetos
- Layout profissional com cores e tipografia otimizada
- Seções: Header, Habilidades, Experiência, Projetos
- Metadata incluída (título, autor, data)

### 2. CV PDF
- Versão compacta para recrutadores
- Máximo 3 projetos principais
- Layout condensado em uma página
- Informações essenciais apenas

### 3. Export de Elementos
- Qualquer elemento HTML pode ser exportado
- Configurações personalizáveis
- Otimização automática para PDF

## 🔧 Como Usar

### Componente BotaoHiringPack

```tsx
import BotaoHiringPack from '@/components/BotaoHiringPack';

// Hiring Pack completo
<BotaoHiringPack 
  label="Hiring Pack Completo"
  data={{
    name: "Seu Nome",
    role: "Seu Cargo",
    skills: ["React", "TypeScript", "Node.js"],
    experience: "Sua experiência profissional...",
    projects: [
      {
        title: "Projeto 1",
        description: "Descrição do projeto...",
        tech: ["React", "TypeScript"],
        caseUrl: "#",
        codeUrl: "#",
        demoUrl: "#"
      }
    ],
    contact: {
      email: "seu@email.com",
      linkedin: "linkedin.com/in/seu-perfil",
      github: "github.com/seu-usuario"
    }
  }}
/>

// CV compacto
<BotaoHiringPack 
  variant="cv"
  label="Baixar CV"
  data={userData}
/>
```

### Hook usePDFGenerator

```tsx
import { usePDFGenerator } from '@/hooks/usePDFGenerator';

function MeuComponente() {
  const { 
    isGenerating, 
    error, 
    progress,
    generateFromElement,
    generateHiringPackPDF 
  } = usePDFGenerator();

  const handleExport = async () => {
    const element = document.getElementById('minha-secao');
    if (element) {
      await generateFromElement(element, {
        filename: 'meu-documento.pdf',
        format: 'a4',
        quality: 0.95
      });
    }
  };

  return (
    <div>
      <button onClick={handleExport} disabled={isGenerating}>
        {isGenerating ? `Gerando... ${progress}%` : 'Exportar PDF'}
      </button>
      {error && <p>Erro: {error}</p>}
    </div>
  );
}
```

### Função Direta

```tsx
import { exportElementToPDF, generateHiringPack } from '@/utils/pdfGenerator';

// Exportar elemento específico
const element = document.getElementById('minha-secao');
await exportElementToPDF(element, {
  filename: 'documento.pdf',
  format: 'a4',
  orientation: 'portrait',
  quality: 0.95,
  scale: 2,
  margin: 20
});

// Gerar hiring pack
await generateHiringPack({
  name: "Nome",
  role: "Cargo",
  skills: ["Skill1", "Skill2"],
  experience: "Experiência...",
  projects: [...]
});
```

## ⚙️ Configurações

### Opções de PDF

```tsx
interface PDFOptions {
  filename?: string;        // Nome do arquivo (padrão: 'document.pdf')
  format?: 'a4' | 'letter'; // Formato do papel (padrão: 'a4')
  orientation?: 'portrait' | 'landscape'; // Orientação (padrão: 'portrait')
  quality?: number;         // Qualidade JPEG 0-1 (padrão: 0.95)
  scale?: number;          // Escala de captura (padrão: 2)
  margin?: number;         // Margem em mm (padrão: 20)
}
```

### Otimizações Automáticas

O sistema aplica automaticamente:
- **Largura fixa**: 800px para consistência
- **Cores otimizadas**: Texto preto, fundo branco
- **Fontes web-safe**: Inter, Arial como fallback
- **Espaçamento**: Padding e margens adequados
- **Qualidade alta**: Scale 2x para nitidez

## 🎨 Personalização de Layout

### CSS para PDF

```css
/* Estilos específicos para PDF */
.pdf-section {
  width: 800px !important;
  background: white !important;
  color: black !important;
  font-family: 'Inter', Arial, sans-serif !important;
  padding: 40px !important;
}

/* Ocultar elementos no PDF */
.no-pdf {
  display: none !important;
}

/* Quebra de página */
.page-break {
  page-break-before: always;
}
```

### Preparação de Elementos

O sistema automaticamente:
1. Define largura fixa (800px)
2. Aplica fundo branco
3. Converte texto para preto
4. Aguarda carregamento de imagens
5. Otimiza para impressão

## 🐛 Troubleshooting

### Problemas Comuns

**PDF em branco ou cortado:**
- Verifique se o elemento existe no DOM
- Aguarde o carregamento completo das imagens
- Teste com elementos menores primeiro

**Qualidade baixa:**
- Aumente o `scale` (padrão: 2)
- Aumente a `quality` (padrão: 0.95)
- Use imagens de alta resolução

**Cores incorretas:**
- O sistema força fundo branco e texto preto
- Verifique se há estilos CSS conflitantes
- Use `!important` se necessário

**Demora na geração:**
- Imagens grandes podem demorar
- Use timeout de 3 segundos para imagens
- Considere otimizar imagens antes

### Logs de Debug

```tsx
// Ativar logs detalhados
const canvas = await html2canvas(element, {
  logging: true, // Ativar para debug
  scale: 2,
  useCORS: true
});
```

## 📱 Responsividade

### Mobile
- Funciona em dispositivos móveis
- Pode ser mais lento devido ao processamento
- Recomendado usar em desktop para melhor UX

### Performance
- Elementos grandes (>2000px) podem ser lentos
- Use `scale: 1` para elementos muito grandes
- Considere dividir em múltiplas páginas

## 🔒 Segurança

### CORS
- Imagens externas podem falhar por CORS
- Use `useCORS: true` na configuração
- Considere proxy para imagens externas

### Dados Sensíveis
- PDFs são gerados no cliente
- Nenhum dado é enviado para servidores
- Arquivos são salvos localmente

## 📊 Métricas

### Tamanhos Típicos
- CV: ~200-500KB
- Hiring Pack: ~500KB-1MB
- Depende das imagens incluídas

### Tempo de Geração
- CV: 2-5 segundos
- Hiring Pack: 3-8 segundos
- Varia com complexidade e imagens

## 🚀 Deploy

### Build
As dependências são incluídas automaticamente no build:
```bash
npm run build
```

### Lazy Loading
As bibliotecas são carregadas dinamicamente:
```tsx
const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
  import('html2canvas'),
  import('jspdf'),
]);
```

Isso reduz o bundle inicial e melhora a performance.