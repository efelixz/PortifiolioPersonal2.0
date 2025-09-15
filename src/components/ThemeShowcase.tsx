import { motion } from "framer-motion";
import { useTheme, useThemeValue, useThemeClasses } from "@/hooks/useTheme";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Sparkles, Zap } from "lucide-react";

export default function ThemeShowcase() {
  const { actualTheme } = useTheme();
  
  // Theme-aware values
  const accentColor = useThemeValue("#3b82f6", "#60a5fa");
  const gradientClasses = useThemeClasses(
    "from-blue-500 to-purple-500",
    "from-blue-400 to-purple-400"
  );

  const colorPalette = [
    { name: "Primary", class: "bg-primary text-primary-foreground" },
    { name: "Secondary", class: "bg-secondary text-secondary-foreground" },
    { name: "Accent", class: "bg-accent text-accent-foreground" },
    { name: "Muted", class: "bg-muted text-muted-foreground" },
    { name: "Card", class: "bg-card text-card-foreground border" },
    { name: "Destructive", class: "bg-destructive text-destructive-foreground" },
  ];

  return (
    <div className="space-y-8">
      {/* Theme Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Palette className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            Tema Atual: <span className="capitalize">{actualTheme}</span>
          </span>
        </div>
      </motion.div>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Paleta de Cores
          </CardTitle>
          <CardDescription>
            Cores que se adaptam automaticamente ao tema selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colorPalette.map((color, index) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${color.class} text-center`}
              >
                <div className="font-medium text-sm">{color.name}</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gradient Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Gradientes Adaptativos
          </CardTitle>
          <CardDescription>
            Gradientes que mudam de intensidade baseado no tema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Gradient */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gradiente Principal</label>
            <div className="h-16 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center">
              <span className="text-white font-semibold">Indigo → Fuchsia</span>
            </div>
          </div>

          {/* Theme-aware Gradient */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gradiente Adaptativo</label>
            <div className={`h-16 rounded-lg bg-gradient-to-r ${gradientClasses} flex items-center justify-center`}>
              <span className="text-white font-semibold">Blue → Purple</span>
            </div>
          </div>

          {/* Background Gradient */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gradiente de Fundo</label>
            <div className="h-16 rounded-lg animated-gradient flex items-center justify-center border">
              <span className="font-semibold">Fundo Animado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Elementos Interativos</CardTitle>
          <CardDescription>
            Componentes que respondem ao tema atual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Botão Padrão</Button>
            <Button variant="secondary">Botão Secundário</Button>
            <Button variant="outline">Botão Outline</Button>
            <Button variant="ghost">Botão Ghost</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Badge Padrão</Badge>
            <Badge variant="secondary">Badge Secundário</Badge>
            <Badge variant="outline">Badge Outline</Badge>
            <Badge variant="destructive">Badge Destrutivo</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="theme-card">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-2">Card Adaptativo</h4>
                <p className="text-sm text-muted-foreground">
                  Este card usa a classe theme-card para se adaptar automaticamente.
                </p>
              </CardContent>
            </Card>

            <div 
              className="p-4 rounded-lg border-2 border-dashed"
              style={{ 
                borderColor: accentColor,
                backgroundColor: `${accentColor}10`
              }}
            >
              <h4 className="font-semibold mb-2">Cor Dinâmica</h4>
              <p className="text-sm text-muted-foreground">
                Usando useThemeValue para cores dinâmicas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CSS Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Variáveis CSS</CardTitle>
          <CardDescription>
            Variáveis CSS que mudam automaticamente com o tema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>--background:</span>
                <span className="text-muted-foreground">
                  {actualTheme === "dark" ? "240 10% 6%" : "0 0% 100%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>--foreground:</span>
                <span className="text-muted-foreground">
                  {actualTheme === "dark" ? "210 40% 98%" : "222.2 84% 4.9%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>--primary:</span>
                <span className="text-muted-foreground">258 90% 66%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>--card:</span>
                <span className="text-muted-foreground">
                  {actualTheme === "dark" ? "222.2 84% 4.9%" : "0 0% 100%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>--border:</span>
                <span className="text-muted-foreground">
                  {actualTheme === "dark" ? "217.2 32.6% 17.5%" : "214.3 31.8% 91.4%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>--muted:</span>
                <span className="text-muted-foreground">
                  {actualTheme === "dark" ? "240 8% 18%" : "220 14% 90%"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}