import "./global.css";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProjectsPage from "./pages/Projects";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";

// Nova página Home
import HomePage from "./pages/HomePage";

// Páginas de autenticação e dashboard
import LoginPage from "./pages/LoginPage";
import TestLoginPage from "./pages/TestLoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Novos imports para funcionalidades modernas
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { PortfolioProvider } from "@/hooks/usePortfolio";
import { ToastProvider } from "@/components/Toast";
import { ScrollProgress, BackToTop } from "@/components/ScrollEffects";
import { useCriticalResourcePreload } from "@/hooks/usePerformance";
import PWAStatus, { PWAInstallButton } from "@/components/PWAStatus";

// Novos sistemas avançados
import { NotificationProvider } from "./hooks/useNotifications";
import { ToastProvider as AdvancedToastProvider } from "./components/ToastProvider";
import { AdvancedControlPanel } from "./components/AdvancedControlPanel";
import { useAnalytics } from "@/utils/seo";

const queryClient = new QueryClient();

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

// Componente principal com preload
function AppContent() {
  useCriticalResourcePreload();

  // Adiciona assinatura no console
  useEffect(() => {
    const styles = [
      'color: #6366f1',
      'font-size: 18px',
      'font-weight: bold',
      'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3)',
      'padding: 10px',
    ].join(';');

    console.log('%cDesenvolvido com ❤️ por Jefferson Felix', styles);
    console.log('%cPortfólio profissional © 2024', 'color: #64748b; font-size: 14px');
  }, []);

  return (
    <HashRouter>
      <ScrollProgress />
      <div className="min-h-screen bg-slate-950 text-white transition-colors duration-300">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/projetos" element={<ProjectsPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <BackToTop />
        {/* O AdvancedControlPanel foi movido para o Dashboard */}
      </div>
    </HashRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <PortfolioProvider>
            <ToastProvider>
              <NotificationProvider>
                <AdvancedToastProvider>
                  <AppContent />
                  <Toaster />
                  <Sonner />
                </AdvancedToastProvider>
              </NotificationProvider>
            </ToastProvider>
          </PortfolioProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
