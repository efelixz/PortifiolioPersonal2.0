import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ExternalLink, Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LivePreviewProps {
  code: string;
  onError: () => void;
}

type ViewportSize = "mobile" | "tablet" | "desktop";

const viewportSizes = {
  mobile: { width: 375, height: 667, icon: Smartphone },
  tablet: { width: 768, height: 1024, icon: Tablet },
  desktop: { width: 1200, height: 800, icon: Monitor },
};

export default function LivePreview({ code, onError }: LivePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate HTML content from code
  const generateHTML = (jsCode: string) => {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .title {
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }
        .output {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            border-left: 4px solid #667eea;
            font-family: 'Courier New', monospace;
        }
        button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
        }
        .demo-element {
            margin: 1rem 0;
            padding: 1rem;
            background: #e3f2fd;
            border-radius: 8px;
            border: 2px dashed #2196f3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">🚀 Live Preview</h1>
        <div class="output" id="output">
            Executando código...
        </div>
        <div class="demo-element" id="demo">
            <p>Área de demonstração interativa</p>
        </div>
        <button onclick="runDemo()">Executar Demo</button>
    </div>

    <script>
        const output = document.getElementById('output');
        const demo = document.getElementById('demo');
        
        // Override console.log to show in preview
        const originalLog = console.log;
        console.log = function(...args) {
            originalLog.apply(console, args);
            output.innerHTML = args.join(' ');
        };

        function runDemo() {
            try {
                ${jsCode}
                
                // Add some interactive elements
                demo.innerHTML = \`
                    <h3>Demo Interativa</h3>
                    <p>Timestamp: \${new Date().toLocaleTimeString()}</p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 1rem;">
                        <div style="width: 20px; height: 20px; background: #ff6b6b; border-radius: 50%; animation: pulse 2s infinite;"></div>
                        <div style="width: 20px; height: 20px; background: #4ecdc4; border-radius: 50%; animation: pulse 2s infinite 0.5s;"></div>
                        <div style="width: 20px; height: 20px; background: #45b7d1; border-radius: 50%; animation: pulse 2s infinite 1s;"></div>
                    </div>
                \`;
            } catch (error) {
                output.innerHTML = 'Erro: ' + error.message;
                output.style.color = '#e74c3c';
            }
        }

        // Auto-run on load
        setTimeout(runDemo, 500);
    </script>
    
    <style>
        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
        }
    </style>
</body>
</html>`;
  };

  const refreshPreview = () => {
    setIsLoading(true);
    setLastUpdate(Date.now());
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refreshPreview();
  }, [code, viewport]);

  const currentSize = viewportSizes[viewport];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {Object.entries(viewportSizes).map(([size, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={size}
                variant={viewport === size ? "default" : "outline"}
                size="sm"
                onClick={() => setViewport(size as ViewportSize)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </span>
              </Button>
            );
          })}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshPreview}
            disabled={isLoading}
          >
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newWindow = window.open();
              if (newWindow) {
                newWindow.document.write(generateHTML(code));
                newWindow.document.close();
              }
            }}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Frame */}
      <div className="relative">
        <motion.div
          className="bg-muted p-4 rounded-lg"
          animate={{
            width: currentSize.width > 800 ? "100%" : currentSize.width + 32,
            height: Math.min(currentSize.height, 600) + 32,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="relative w-full h-full bg-white rounded border overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="text-primary"
                >
                  <RefreshCw className="h-6 w-6" />
                </motion.div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
              srcDoc={generateHTML(code)}
              className="w-full h-full border-0"
              title="Live Preview"
              sandbox="allow-scripts allow-same-origin"
              key={lastUpdate} // Force re-render
            />
          </div>
        </motion.div>
        
        {/* Viewport indicator */}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {currentSize.width} × {Math.min(currentSize.height, 600)}
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-muted-foreground">
        <p>
          Esta preview executa o código em um ambiente isolado. 
          Alterações no código são refletidas automaticamente.
        </p>
      </div>
    </div>
  );
}