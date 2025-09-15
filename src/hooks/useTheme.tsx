import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "dark" | "light"; // The actual theme being used (resolved from system)
  toggleTheme: () => void;
  isSystemTheme: boolean;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
  toggleTheme: () => null,
  isSystemTheme: true,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark", // Changed default to dark
  storageKey = "portfolio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  const [actualTheme, setActualTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");

    let resolvedTheme: "dark" | "light";

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      resolvedTheme = systemTheme;
    } else {
      resolvedTheme = theme;
    }

    // Apply theme classes
    root.classList.add(resolvedTheme);
    body.classList.add(resolvedTheme);
    
    // Set data attribute for CSS targeting
    root.setAttribute("data-theme", resolvedTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content", 
        resolvedTheme === "dark" ? "#0f172a" : "#ffffff"
      );
    }

    setActualTheme(resolvedTheme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      setActualTheme(systemTheme);
      
      const root = window.document.documentElement;
      const body = document.body;
      
      root.classList.remove("light", "dark");
      body.classList.remove("light", "dark");
      root.classList.add(systemTheme);
      body.classList.add(systemTheme);
      root.setAttribute("data-theme", systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setThemeWithStorage = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    if (theme === "system") {
      // If system, switch to opposite of current actual theme
      setThemeWithStorage(actualTheme === "dark" ? "light" : "dark");
    } else {
      // If manual theme, toggle between light and dark
      setThemeWithStorage(theme === "dark" ? "light" : "dark");
    }
  };

  const value = {
    theme,
    setTheme: setThemeWithStorage,
    actualTheme,
    toggleTheme,
    isSystemTheme: theme === "system",
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

// Utility hook to get theme-aware values
export const useThemeValue = <T,>(lightValue: T, darkValue: T): T => {
  const { actualTheme } = useTheme();
  return actualTheme === "dark" ? darkValue : lightValue;
};

// Utility hook for theme-aware classes
export const useThemeClasses = (lightClasses: string, darkClasses: string): string => {
  const { actualTheme } = useTheme();
  return actualTheme === "dark" ? darkClasses : lightClasses;
};