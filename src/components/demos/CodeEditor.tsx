import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onError: () => void;
}

export default function CodeEditor({ initialCode, language, onError }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulate code execution
  const runCode = async () => {
    setIsRunning(true);
    setOutput("Executando...");

    try {
      // Simulate async execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock output based on code content
      if (code.includes("console.log")) {
        const matches = code.match(/console\.log\(['"`](.+?)['"`]\)/g);
        if (matches) {
          const outputs = matches.map(match => {
            const content = match.match(/['"`](.+?)['"`]/)?.[1] || "";
            return content;
          });
          setOutput(outputs.join("\n"));
        }
      } else if (code.includes("function")) {
        setOutput("Função definida com sucesso!");
      } else {
        setOutput("Código executado com sucesso!");
      }
    } catch (error) {
      setOutput("Erro na execução do código");
      onError();
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <div className="relative">
        <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border-b">
          <span className="text-sm font-medium text-muted-foreground">
            {language}.js
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCode}
              className="h-8 px-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={runCode}
              disabled={isRunning}
              className="h-8 px-2"
            >
              {isRunning ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Play className="h-4 w-4" />
                </motion.div>
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-4 font-mono text-sm bg-card border border-t-0 rounded-b-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu código aqui..."
          spellCheck={false}
        />
      </div>

      {/* Output */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Saída:
        </label>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[100px] overflow-auto">
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="whitespace-pre-wrap"
            >
              {output}
            </motion.div>
          )}
          {!output && (
            <span className="text-gray-600">
              Clique em "Executar" para ver a saída...
            </span>
          )}
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Exemplos:
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            'console.log("Hello World!");',
            'const sum = (a, b) => a + b;\nconsole.log(sum(2, 3));',
            'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}\nconsole.log(fibonacci(10));'
          ].map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setCode(example)}
              className="text-xs"
            >
              Exemplo {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}