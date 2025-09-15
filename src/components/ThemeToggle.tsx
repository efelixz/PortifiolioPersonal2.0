import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeToggleProps {
  variant?: "button" | "dropdown";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ThemeToggle({ 
  variant = "button", 
  size = "md",
  showLabel = false 
}: ThemeToggleProps) {
  const { theme, setTheme, actualTheme, toggleTheme, isSystemTheme } = useTheme();

  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

  const ThemeIcon = ({ currentTheme }: { currentTheme: "dark" | "light" | "system" }) => {
    const icons = {
      light: Sun,
      dark: Moon,
      system: Monitor,
    };
    
    const Icon = icons[currentTheme];
    
    return (
      <motion.div
        key={currentTheme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Icon className={iconSize} />
      </motion.div>
    );
  };

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={buttonSize} className="relative">
            <AnimatePresence mode="wait">
              <ThemeIcon currentTheme={isSystemTheme ? "system" : actualTheme} />
            </AnimatePresence>
            {showLabel && (
              <span className="ml-2 hidden sm:inline">
                {isSystemTheme ? "Sistema" : actualTheme === "dark" ? "Escuro" : "Claro"}
              </span>
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          <DropdownMenuItem 
            onClick={() => setTheme("light")}
            className="flex items-center gap-2"
          >
            <Sun className="h-4 w-4" />
            <span>Claro</span>
            {theme === "light" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-2 w-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("dark")}
            className="flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            <span>Escuro</span>
            {theme === "dark" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-2 w-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setTheme("system")}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            <span>Sistema</span>
            {theme === "system" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto h-2 w-2 rounded-full bg-primary"
              />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Button
        variant="ghost"
        size={buttonSize}
        onClick={toggleTheme}
        className="relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <ThemeIcon currentTheme={actualTheme} />
        </AnimatePresence>
        
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-md"
          animate={{
            background: actualTheme === "dark" 
              ? "linear-gradient(135deg, #1e293b, #334155)"
              : "linear-gradient(135deg, #fbbf24, #f59e0b)"
          }}
          transition={{ duration: 0.3 }}
          style={{ opacity: 0.1 }}
        />
        
        {showLabel && (
          <motion.span 
            className="ml-2 hidden sm:inline text-sm"
            key={actualTheme}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {actualTheme === "dark" ? "Escuro" : "Claro"}
          </motion.span>
        )}
        
        <span className="sr-only">
          Alternar para tema {actualTheme === "dark" ? "claro" : "escuro"}
        </span>
      </Button>
    </motion.div>
  );
}

// Compact theme toggle for mobile
export function CompactThemeToggle() {
  const { actualTheme, toggleTheme } = useTheme();
  
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative p-2 rounded-full bg-background border border-border shadow-sm"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={actualTheme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {actualTheme === "dark" ? (
            <Moon className="h-4 w-4 text-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-foreground" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: actualTheme === "dark" 
            ? "0 0 20px rgba(59, 130, 246, 0.3)"
            : "0 0 20px rgba(251, 191, 36, 0.3)"
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}