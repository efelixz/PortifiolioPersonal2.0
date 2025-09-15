import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, BarChart3, X, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { analytics } from "@/utils/analytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConsentBannerProps {
  onConsentChange?: (granted: boolean) => void;
}

export default function ConsentBanner({ onConsentChange }: ConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    functional: true, // Always true, required for site function
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('portfolio_analytics_consent');
    const consentDate = localStorage.getItem('portfolio_analytics_consent_date');
    
    // Show banner if no consent given or consent is older than 6 months
    if (!consent || (consentDate && isConsentExpired(consentDate))) {
      setShowBanner(true);
    } else {
      // Load existing preferences
      const storedPrefs = localStorage.getItem('portfolio_consent_preferences');
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
    }
  }, []);

  const isConsentExpired = (consentDate: string): boolean => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(consentDate) < sixMonthsAgo;
  };

  const handleAcceptAll = async () => {
    const newPrefs = { ...preferences, analytics: true, marketing: true };
    setPreferences(newPrefs);
    await saveConsent(newPrefs);
    setShowBanner(false);
  };

  const handleRejectAll = async () => {
    const newPrefs = { ...preferences, analytics: false, marketing: false };
    setPreferences(newPrefs);
    await saveConsent(newPrefs);
    setShowBanner(false);
  };

  const handleSavePreferences = async () => {
    await saveConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const saveConsent = async (prefs: typeof preferences) => {
    // Save preferences
    localStorage.setItem('portfolio_consent_preferences', JSON.stringify(prefs));
    
    // Grant or revoke analytics consent
    if (prefs.analytics) {
      await analytics.grantConsent();
    } else {
      analytics.revokeConsent();
    }
    
    // Notify parent component
    onConsentChange?.(prefs.analytics);
    
    // Track consent decision (if analytics enabled)
    if (prefs.analytics) {
      analytics.track('consent_granted', {
        analytics: prefs.analytics,
        marketing: prefs.marketing,
        method: 'banner',
      });
    }
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'functional') return; // Can't disable functional cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <Card className="mx-auto max-w-4xl border-2 border-primary/20 bg-background/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Cookie className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        🍪 Cookies e Privacidade
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Este site usa cookies e tecnologias similares para melhorar sua experiência, 
                        analisar o tráfego e personalizar conteúdo. Você pode escolher quais tipos 
                        de cookies aceitar.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white hover:brightness-110"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Aceitar Todos
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleRejectAll}
                      >
                        Rejeitar Todos
                      </Button>
                      
                      <Dialog open={showSettings} onOpenChange={setShowSettings}>
                        <DialogTrigger asChild>
                          <Button variant="ghost">
                            <Settings className="mr-2 h-4 w-4" />
                            Personalizar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Shield className="h-5 w-5" />
                              Configurações de Privacidade
                            </DialogTitle>
                            <DialogDescription>
                              Escolha quais tipos de cookies você deseja aceitar. 
                              Cookies funcionais são necessários para o funcionamento do site.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Functional Cookies */}
                            <div className="flex items-start justify-between space-x-4">
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">
                                  Cookies Funcionais
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Necessários para o funcionamento básico do site, 
                                  incluindo tema, navegação e formulários.
                                </p>
                              </div>
                              <Switch
                                checked={preferences.functional}
                                disabled
                                className="mt-1"
                              />
                            </div>

                            {/* Analytics Cookies */}
                            <div className="flex items-start justify-between space-x-4">
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">
                                  Cookies de Analytics
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Nos ajudam a entender como você usa o site para 
                                  melhorar a experiência. Dados são anonimizados.
                                </p>
                              </div>
                              <Switch
                                checked={preferences.analytics}
                                onCheckedChange={() => togglePreference('analytics')}
                                className="mt-1"
                              />
                            </div>

                            {/* Marketing Cookies */}
                            <div className="flex items-start justify-between space-x-4">
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">
                                  Cookies de Marketing
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Usados para personalizar anúncios e medir 
                                  a eficácia de campanhas publicitárias.
                                </p>
                              </div>
                              <Switch
                                checked={preferences.marketing}
                                onCheckedChange={() => togglePreference('marketing')}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setShowSettings(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={handleSavePreferences}
                              className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                            >
                              Salvar Preferências
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>
                        Ao continuar navegando, você concorda com nossa{" "}
                        <button className="underline hover:text-foreground">
                          Política de Privacidade
                        </button>{" "}
                        e{" "}
                        <button className="underline hover:text-foreground">
                          Termos de Uso
                        </button>
                        .
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowBanner(false)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Privacy settings component for footer or settings page
export function PrivacySettings() {
  const [preferences, setPreferences] = useState({
    analytics: false,
    functional: true,
    marketing: false,
  });

  useEffect(() => {
    const storedPrefs = localStorage.getItem('portfolio_consent_preferences');
    if (storedPrefs) {
      setPreferences(JSON.parse(storedPrefs));
    }
  }, []);

  const handleSave = async () => {
    localStorage.setItem('portfolio_consent_preferences', JSON.stringify(preferences));
    
    if (preferences.analytics) {
      await analytics.grantConsent();
    } else {
      analytics.revokeConsent();
    }

    // Show success message
    alert('Preferências salvas com sucesso!');
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'functional') return;
    
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configurações de Privacidade
        </CardTitle>
        <CardDescription>
          Gerencie suas preferências de cookies e privacidade.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1">
            <h4 className="font-medium">Cookies Funcionais</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Necessários para o funcionamento do site.
            </p>
          </div>
          <Switch checked={preferences.functional} disabled />
        </div>

        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1">
            <h4 className="font-medium">Analytics</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Nos ajuda a melhorar o site.
            </p>
          </div>
          <Switch
            checked={preferences.analytics}
            onCheckedChange={() => togglePreference('analytics')}
          />
        </div>

        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1">
            <h4 className="font-medium">Marketing</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Para personalização de conteúdo.
            </p>
          </div>
          <Switch
            checked={preferences.marketing}
            onCheckedChange={() => togglePreference('marketing')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={handleSave}>
            Salvar Preferências
          </Button>
        </div>

        {/* Analytics Summary */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h5 className="font-medium mb-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumo de Analytics
          </h5>
          <AnalyticsSummary />
        </div>
      </CardContent>
    </Card>
  );
}

// Component to show analytics summary
function AnalyticsSummary() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    setSummary(analytics.getAnalyticsSummary());
  }, []);

  if (!summary) return null;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Status do Consentimento:</span>
        <span className={summary.consentGiven ? "text-green-600" : "text-red-600"}>
          {summary.consentGiven ? "Concedido" : "Negado"}
        </span>
      </div>
      {summary.consentDate && (
        <div className="flex justify-between">
          <span>Data do Consentimento:</span>
          <span>{new Date(summary.consentDate).toLocaleDateString('pt-BR')}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span>Eventos Armazenados:</span>
        <span>{summary.storedEvents}</span>
      </div>
      <div className="flex justify-between">
        <span>Provedor:</span>
        <span className="capitalize">{summary.provider}</span>
      </div>
    </div>
  );
}