import { motion } from "framer-motion";
import { Github, Linkedin, Mail, PhoneCall, Calendar, Send, CheckCircle, AlertCircle } from "lucide-react";
import Particles from "@/components/visual/Particles";
import { useSEO } from "@/hooks/SEOHelper";
import { usePageSignature } from "@/hooks/usePageSignature";
import { useContactForm } from "@/hooks/useContactForm";
import { useState } from "react";

export default function ContactPage() {
  const { sendEmail, isLoading, status, message } = useContactForm();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  
  usePageSignature('Contato');
  useSEO({
    title: 'Contato - Jefferson Felix',
    description: 'Entre em contato com Jefferson Felix para projetos frontend, automações e consultoria em desenvolvimento. Vamos conversar sobre seu próximo projeto.',
    url: 'https://efelixz.me/contato',
    type: 'website',
    keywords: [
      'contato desenvolvedor',
      'freelancer frontend',
      'consultoria react',
      'orçamento projeto',
      'desenvolvedor brasileiro',
      'automação projetos'
    ]
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    
    const success = await sendEmail({
      nome: data.nome,
      email: data.email,
      assunto: data.assunto,
      mensagem: data.mensagem
    });

    if (success) {
      form.reset();
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 animated-gradient" />
        <Particles className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full" />
        <div className="container py-16">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl font-extrabold md:text-4xl flex items-center gap-3"
          >
            Vamos conversar?
            <span className="inline-flex items-center gap-1.5 bg-green-600/20 text-green-500 text-sm font-medium px-2 py-1 rounded-full">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </span>
          </motion.h1>
          <p className="mt-2 max-w-2xl text-white/70">
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              {/* Status Message */}
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
                    status === 'success' 
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : status === 'error'
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                      : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                  }`}
                >
                  {status === 'success' && <CheckCircle className="w-5 h-5" />}
                  {status === 'error' && <AlertCircle className="w-5 h-5" />}
                  {status === 'loading' && <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                  <span className="text-sm">{message || (status === 'loading' ? 'Enviando mensagem...' : '')}</span>
                </motion.div>
              )}

              <form className="grid gap-4" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="nome"
                      className="mb-1 block text-sm text-white/80"
                    >
                      Nome *
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm text-white/80"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-500 transition-colors"
                      placeholder="voce@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="assunto"
                    className="mb-1 block text-sm text-white/80"
                  >
                    Assunto
                  </label>
                  <input
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Ex: Proposta de projeto, Freelance, Consultoria..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="mensagem"
                    className="mb-1 block text-sm text-white/80"
                  >
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    required
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    className="h-32 w-full resize-none rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Conte um pouco sobre o projeto, prazos, orçamento ou qualquer dúvida..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>

              {/* Ações rápidas */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/jeffersonfelizz/"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  <Linkedin className="mr-2 inline h-4 w-4" /> LinkedIn
                </a>
                <a
                  href="https://github.com/efelixz"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  <Github className="mr-2 inline h-4 w-4" /> GitHub
                </a>
                <a
                  href="mailto:jeffersonfelixzxz@gmail.com"
                  className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
                >
                  <Mail className="mr-2 inline h-4 w-4" /> Email
                </a>
                <a
                  href="https://wa.me/5511957521349?text=Olá,%20vi%20seu%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20seus%20serviços"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-white/15 bg-green-600/20 px-4 py-2 text-sm text-white hover:bg-green-600/30 transition-colors"
                >
                  <PhoneCall className="mr-2 inline h-4 w-4" /> WhatsApp
                  <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Lateral */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/20 to-fuchsia-600/20 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold">Agenda aberta</h3>
              <p className="mt-1 text-sm text-white/70">
                Marque uma conversa rápida para falarmos sobre sua ideia e
                próximos passos.
              </p>
              <div className="mt-4 space-y-3">
                <a
                  href="https://calendly.com/jeffersonfelixzxz/30min"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 w-full justify-center"
                >
                  <Calendar className="h-4 w-4" /> Agendar Reunião
                </a>
                
                <div className="bg-slate-800 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-white">Online agora</p>
                  </div>
                  <p className="text-xs text-white/70">
                    Estou disponível para responder em até 30 minutos durante horário comercial.
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}
