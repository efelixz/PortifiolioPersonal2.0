import { motion } from "framer-motion";
import InteractiveDemo from "@/components/InteractiveDemo";
import Avatar3DLazy from "@/components/Avatar3DLazy";
import ThemeShowcase from "@/components/ThemeShowcase";

const demoExamples = {
  react: `// Componente React interativo
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h2>Contador: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Incrementar
      </button>
    </div>
  );
}

console.log("Componente React criado!");`,

  javascript: `// Algoritmo de ordenação
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const right = arr.filter(x => x > pivot);
  const middle = arr.filter(x => x === pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log("Array original:", numbers);
console.log("Array ordenado:", quickSort(numbers));`,

  animation: `// Animação com CSS
const element = document.getElementById('demo');
if (element) {
  element.style.transform = 'scale(1.2)';
  element.style.transition = 'all 0.3s ease';
  element.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
}

console.log("Animação aplicada!");`,
};

export default function Demos() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />
        <div className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl font-extrabold text-foreground md:text-5xl mb-6">
              Demos Interativas
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore exemplos práticos de código, visualizações 3D e integrações avançadas 
              com WASM. Todas as demos são executadas no navegador com performance otimizada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3D Avatar Demo */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Avatar 3D Interativo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Renderização 3D em tempo real usando Three.js com lazy loading para performance otimizada.
              Arraste para interagir com o modelo.
            </p>
          </motion.div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Avatar3DLazy enableLazyLoad={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Code Demos */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Editor de Código Interativo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Execute código JavaScript em tempo real com feedback visual imediato.
              Experimente os exemplos ou escreva seu próprio código.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <InteractiveDemo
                title="Algoritmos JavaScript"
                description="Teste algoritmos de ordenação e estruturas de dados"
                demoType="code-editor"
                initialCode={demoExamples.javascript}
                language="javascript"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <InteractiveDemo
                title="Animações CSS/JS"
                description="Crie animações dinâmicas e efeitos visuais"
                demoType="code-editor"
                initialCode={demoExamples.animation}
                language="javascript"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Preview Demo */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Preview Responsivo
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualize seu código em diferentes tamanhos de tela com preview em tempo real.
              Teste a responsividade em mobile, tablet e desktop.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <InteractiveDemo
              title="Preview Responsivo"
              description="Teste seu código em diferentes viewports"
              demoType="live-preview"
              initialCode={demoExamples.react}
              language="javascript"
            />
          </motion.div>
        </div>
      </section>

      {/* WASM Demo */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              WebAssembly Integration
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Demonstração de como integrações WASM podem ser implementadas para 
              processamento de alta performance no navegador.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <InteractiveDemo
              title="WASM Performance Demo"
              description="Compilação e execução de código de alta performance"
              demoType="wasm-demo"
              language="rust"
            />
          </motion.div>
        </div>
      </section>

      {/* Theme System Demo */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Sistema de Temas
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Sistema completo de dark/light mode com persistência, transições suaves 
              e cores adaptativas em todos os componentes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <ThemeShowcase />
          </motion.div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
              Detalhes Técnicos
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Lazy Loading",
                  description: "Componentes 3D e demos carregados sob demanda para não impactar a performance inicial",
                  icon: "🚀"
                },
                {
                  title: "Three.js Integration",
                  description: "Renderização 3D otimizada com @react-three/fiber e @react-three/drei",
                  icon: "🎮"
                },
                {
                  title: "WASM Ready",
                  description: "Preparado para integrações WebAssembly com esbuild-wasm",
                  icon: "⚡"
                },
                {
                  title: "Responsive Preview",
                  description: "Sistema de preview que simula diferentes dispositivos e resoluções",
                  icon: "📱"
                },
                {
                  title: "Error Boundaries",
                  description: "Tratamento robusto de erros com fallbacks animados",
                  icon: "🛡️"
                },
                {
                  title: "Performance Optimized",
                  description: "Intersection Observer, dynamic imports e otimizações de bundle",
                  icon: "⚡"
                },
                {
                  title: "Theme System",
                  description: "Dark/light mode com persistência e transições suaves",
                  icon: "🎨"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card border rounded-lg p-6 text-center"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}