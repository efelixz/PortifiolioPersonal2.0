# 🎮 Setup das Demos Interativas

Este guia explica como configurar e usar as funcionalidades de demos interativas, incluindo Avatar 3D, editor de código e integrações WASM.

## 🚀 Instalação

### Dependências Principais
```bash
# Three.js para renderização 3D
npm install three @react-three/fiber @react-three/drei

# Para integrações WASM futuras
npm install esbuild-wasm

# Tipos TypeScript
npm install --save-dev @types/three
```

## 🎯 Componentes Implementados

### 1. Avatar3DLazy
Avatar 3D com lazy loading e fallback animado.

**Características:**
- Lazy loading com Intersection Observer
- Fallback animado com pulse effect
- Error boundaries para tratamento de erros
- Performance otimizada com dynamic imports

**Uso:**
```tsx
import Avatar3DLazy from '@/components/Avatar3DLazy';

<Avatar3DLazy 
  enableLazyLoad={true}
  className="custom-class"
/>
```

### 2. InteractiveDemo
Sistema de demos interativas com múltiplos tipos.

**Tipos Disponíveis:**
- `code-editor` - Editor de código com execução
- `live-preview` - Preview responsivo em tempo real
- `wasm-demo` - Placeholder para demos WASM

**Uso:**
```tsx
import InteractiveDemo from '@/components/InteractiveDemo';

<InteractiveDemo
  title="Minha Demo"
  description="Descrição da demo"
  demoType="code-editor"
  initialCode="console.log('Hello!');"
  language="javascript"
/>
```

### 3. CodeEditor
Editor de código com execução em tempo real.

**Funcionalidades:**
- Execução de JavaScript no navegador
- Copy/paste de código
- Exemplos pré-definidos
- Output em tempo real

### 4. LivePreview
Preview responsivo com múltiplos viewports.

**Funcionalidades:**
- Viewports: Mobile (375px), Tablet (768px), Desktop (1200px)
- Refresh manual e automático
- Abertura em nova janela
- Sandbox seguro para execução

## ⚙️ Configurações de Performance

### Lazy Loading Strategy

```tsx
// Avatar 3D com lazy loading
const Avatar3DCanvas = lazy(() => import('./Avatar3DCanvas'));

// Carregamento baseado em Intersection Observer
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );
}, []);
```

### Error Boundaries

```tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Demo Error:', error, errorInfo);
    this.props.onError();
  }
  
  render() {
    if (this.state.hasError) {
      return <FallbackComponent />;
    }
    return this.props.children;
  }
}
```

## 🎨 Customização

### Fallback Animations

```tsx
// Fallback animado para Avatar 3D
function Avatar3DFallback() {
  return (
    <div className="relative w-32 h-32">
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
```

### Three.js Scene Configuration

```tsx
// Configuração otimizada do Canvas
<Canvas 
  camera={{ position: [0, 0, 5], fov: 45 }} 
  shadows
  dpr={[1, 2]} // Responsive pixel ratio
  performance={{ min: 0.5 }} // Performance optimization
>
  <ambientLight intensity={0.4} />
  <pointLight 
    position={[5, 5, 5]} 
    intensity={1.2} 
    castShadow
    shadow-mapSize={[1024, 1024]}
  />
  <Environment preset="city" />
</Canvas>
```

## 🔧 WASM Integration (Futuro)

### esbuild-wasm Setup

```tsx
// Placeholder para integração WASM
import { initialize, transform } from 'esbuild-wasm';

const initializeWASM = async () => {
  await initialize({
    wasmURL: '/node_modules/esbuild-wasm/esbuild.wasm'
  });
};

const compileCode = async (code: string) => {
  const result = await transform(code, {
    loader: 'tsx',
    target: 'es2020',
  });
  return result.code;
};
```

### Rust/WASM Example

```rust
// Exemplo de código Rust para WASM
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
```

## 📱 Responsividade

### Viewport Configurations

```tsx
const viewportSizes = {
  mobile: { width: 375, height: 667, icon: Smartphone },
  tablet: { width: 768, height: 1024, icon: Tablet },
  desktop: { width: 1200, height: 800, icon: Monitor },
};
```

### Adaptive Loading

```tsx
// Carregamento adaptativo baseado na conexão
const connection = navigator.connection;
const shouldLoadHeavyContent = 
  !connection || 
  connection.effectiveType === '4g' || 
  connection.downlink > 1.5;
```

## 🛡️ Segurança

### Sandbox Configuration

```tsx
// iframe com sandbox para execução segura
<iframe
  srcDoc={generateHTML(code)}
  sandbox="allow-scripts allow-same-origin"
  title="Live Preview"
/>
```

### Code Sanitization

```tsx
// Sanitização básica de código
const sanitizeCode = (code: string) => {
  return code
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};
```

## 🚀 Performance Tips

### Bundle Optimization

```tsx
// Dynamic imports para reduzir bundle inicial
const loadDemo = async (type: string) => {
  switch (type) {
    case 'three':
      return await import('./demos/ThreeDemo');
    case 'wasm':
      return await import('./demos/WASMDemo');
    default:
      return await import('./demos/DefaultDemo');
  }
};
```

### Memory Management

```tsx
// Cleanup de recursos Three.js
useEffect(() => {
  return () => {
    // Dispose geometries, materials, textures
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  };
}, []);
```

## 📊 Métricas

### Loading Performance
- Avatar 3D: ~500KB inicial + ~2MB Three.js (lazy)
- Code Editor: ~100KB
- Live Preview: ~50KB
- WASM Demos: ~1-5MB (dependendo do módulo)

### Timing Benchmarks
- Avatar 3D Load: 1-3 segundos
- Code Execution: <100ms
- Preview Update: <500ms
- WASM Compilation: 1-10 segundos

## 🐛 Troubleshooting

### Three.js Issues
```bash
# Erro comum: Canvas não renderiza
# Solução: Verificar se WebGL está disponível
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
if (!gl) {
  console.error('WebGL not supported');
}
```

### WASM Loading Issues
```bash
# Erro: WASM module not found
# Solução: Verificar path do arquivo .wasm
# Copiar arquivos WASM para public/ durante build
```

### Performance Issues
```bash
# Problema: Lag durante animações
# Solução: Reduzir qualidade ou usar will-change CSS
.three-canvas {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}
```

## 🔄 Atualizações Futuras

### Roadmap
1. **Monaco Editor** - Editor de código mais avançado
2. **WebGL Shaders** - Demos de shaders customizados
3. **WebRTC Integration** - Demos colaborativas
4. **AI/ML Models** - TensorFlow.js demos
5. **WebXR Support** - Realidade virtual/aumentada

### Contribuição
Para adicionar novas demos:
1. Crie componente em `src/components/demos/`
2. Adicione tipo em `InteractiveDemo`
3. Implemente lazy loading
4. Adicione error boundaries
5. Teste performance em dispositivos móveis