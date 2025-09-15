import { Suspense, lazy, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Code, Loader2, AlertCircle, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Lazy load WASM-based demo components
const CodeEditor = lazy(() => import("./demos/CodeEditor"));
const LivePreview = lazy(() => import("./demos/LivePreview"));

interface InteractiveDemoProps {
  title: string;
  description: string;
  demoType: "code-editor" | "live-preview" | "wasm-demo";
  initialCode?: string;
  language?: string;
  className?: string;
}

// Animated loading fallback
function DemoFallback({ title, description }: { title: string; description: string }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-5 w-5 text-primary" />
          </motion.div>
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Animated skeleton */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-muted rounded animate-pulse"
                style={{ width: `${60 + Math.random() * 40}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          
          {/* Animated progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Carregando demo interativa...</span>
              <span>WASM</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Error fallback
function DemoError({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <Card className="w-full border-destructive/50">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <div>
            <h3 className="font-semibold text-foreground">Demo Indisponível</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Não foi possível carregar a demo "{title}"
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={onRetry}>
              Tentar Novamente
            </Button>
            <Button variant="ghost" size="sm">
              Ver Código Fonte
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InteractiveDemo({
  title,
  description,
  demoType,
  initialCode = "",
  language = "javascript",
  className = "",
}: InteractiveDemoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Simulate WASM loading delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    setTimeout(() => setIsLoaded(true), 1000);
  };

  const renderDemo = () => {
    if (hasError) {
      return <DemoError title={title} onRetry={handleRetry} />;
    }

    if (!isLoaded) {
      return <DemoFallback title={title} description={description} />;
    }

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<DemoFallback title={title} description={description} />}>
            {demoType === "code-editor" && (
              <CodeEditor
                initialCode={initialCode}
                language={language}
                onError={() => setHasError(true)}
              />
            )}
            {demoType === "live-preview" && (
              <LivePreview
                code={initialCode}
                onError={() => setHasError(true)}
              />
            )}
            {demoType === "wasm-demo" && (
              <WASMDemo onError={() => setHasError(true)} />
            )}
          </Suspense>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isFullscreen ? (
          <motion.div
            key="fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background p-4"
          >
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{title}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setIsFullscreen(false)}
                >
                  Fechar
                </Button>
              </div>
              <div className="flex-1">
                {renderDemo()}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="normal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderDemo()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Placeholder WASM demo component
function WASMDemo({ onError }: { onError: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate WASM compilation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Compilando WASM...</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-lg p-6 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Play className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold mb-2">Demo WASM Pronta!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Esta é uma demonstração de como integrações WASM funcionariam no projeto.
          </p>
          <Button size="sm">
            Executar Demo
          </Button>
        </motion.div>
      )}
    </div>
  );
}