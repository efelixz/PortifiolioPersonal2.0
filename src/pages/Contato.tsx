import { motion } from "framer-motion";
import { Github, Linkedin, Mail, PhoneCall, Calendar, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useContactForm } from "@/hooks/useContactForm";
import { useTrackInteraction } from "@/hooks/useAnalytics";

export default function Contato() {
  const {
    data,
    errors,
    isLoading,
    isSuccess,
    successMessage,
    updateField,
    validateField,
    submitForm,
    resetForm,
  } = useContactForm();
  
  const { trackFormSubmit, trackClick } = useTrackInteraction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitForm();
      
      // Track successful submission
      trackFormSubmit('contact', true, {
        name: data.name,
        email: data.email,
        message: data.message,
      });
    } catch (error) {
      // Track failed submission
      trackFormSubmit('contact', false, { error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleFieldBlur = (field: keyof typeof data) => {
    const error = validateField(field, data[field]);
    if (error) {
      // Error will be set by the validation in the hook
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Hero */}
      <section className="relative isolate overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800" />
        <div className="container py-16">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl font-extrabold text-foreground md:text-4xl"
          >
            Vamos conversar?
          </motion.h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Fale sobre seu projeto, prazo e objetivos. Responderei rapidamente.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-12">
        <div className="container grid gap-6 md:grid-cols-3">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Envie uma mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e entrarei em contato em breve.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Success Message */}
                {isSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        {successMessage}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Error Message */}
                {errors.general && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {errors.general}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <form className="grid gap-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nome">
                        Nome <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={data.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        onBlur={() => handleFieldBlur('name')}
                        placeholder="Seu nome completo"
                        className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                        disabled={isLoading}
                        required
                      />
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.name}
                        </motion.p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        onBlur={() => handleFieldBlur('email')}
                        placeholder="voce@email.com"
                        className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                        disabled={isLoading}
                        required
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mensagem">
                      Mensagem <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      value={data.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      onBlur={() => handleFieldBlur('message')}
                      placeholder="Conte um pouco sobre o projeto, prazo e objetivos..."
                      className={`min-h-[120px] ${errors.message ? "border-red-500 focus:border-red-500" : ""}`}
                      disabled={isLoading}
                      required
                    />
                    <div className="flex justify-between items-center">
                      {errors.message ? (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500"
                        >
                          {errors.message}
                        </motion.p>
                      ) : (
                        <div />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {data.message.length}/1000
                      </span>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Mensagem'
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Ações rápidas */}
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    Ou entre em contato diretamente:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href="#" 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={() => trackClick('social_link', 'linkedin_contact')}
                        >
                          <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                        </a>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href="#" 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={() => trackClick('social_link', 'github_contact')}
                        >
                          <Github className="mr-2 h-4 w-4" /> GitHub
                        </a>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href="mailto:contato@jefferson.dev"
                          onClick={() => trackClick('social_link', 'email_contact')}
                        >
                          <Mail className="mr-2 h-4 w-4" /> Email
                        </a>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href="#" 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={() => trackClick('social_link', 'whatsapp_contact')}
                        >
                          <PhoneCall className="mr-2 h-4 w-4" /> WhatsApp
                        </a>
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Reset form button for testing */}
                {(isSuccess || errors.general) && (
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetForm}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Enviar nova mensagem
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Lateral */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <Card className="bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="text-lg">Agenda aberta</CardTitle>
                <CardDescription>
                  Marque uma conversa rápida para falarmos sobre sua ideia e
                  próximos passos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-indigo-500/25"
                  >
                    <a
                      href="https://calendly.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Reunião
                    </a>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>contato@jefferson.dev</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <PhoneCall className="h-4 w-4 text-muted-foreground" />
                  <span>+55 (11) 99999-9999</span>
                </div>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}