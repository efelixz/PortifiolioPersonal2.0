import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import CTA from "@/components/sections/CTA";
import { useSEO } from "@/hooks/SEOHelper";
import { usePageSignature } from "@/hooks/usePageSignature";

export default function Index() {
  usePageSignature('Home');
  useSEO({
    title: 'Jefferson Felix - Desenvolvedor Frontend & Automação',
    description: 'Desenvolvedor Frontend especializado em React, TypeScript, Tailwind CSS e soluções de automação. Criando interfaces modernas e experiências digitais excepcionais.',
    url: 'https://jeffersonfelix.dev/',
    type: 'website',
    keywords: [
      'desenvolvedor frontend',
      'react developer', 
      'typescript',
      'tailwind css',
      'automação',
      'javascript',
      'portfolio'
    ]
  });

  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <section id="contato" className="relative py-20">
        <div className="container grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Entre em Contato</h2>
            <p className="mt-2 max-w-lg text-white/70">
              Tem um projeto em mente? Me envie uma mensagem e retornarei o quanto antes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="mailto:contato@jefferson.dev" className="rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow hover:brightness-110">Enviar Email</a>
              <a href="#" className="rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 hover:text-white">LinkedIn</a>
              <a href="#" className="rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10 hover:text-white">GitHub</a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <form className="grid gap-4">
              <div>
                <label htmlFor="nome" className="mb-1 block text-sm text-white/80">Nome</label>
                <input id="nome" name="nome" className="w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 focus:border-indigo-500" placeholder="Seu nome" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-white/80">Email</label>
                <input id="email" type="email" name="email" className="w-full rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 focus:border-indigo-500" placeholder="voce@email.com" />
              </div>
              <div>
                <label htmlFor="mensagem" className="mb-1 block text-sm text-white/80">Mensagem</label>
                <textarea id="mensagem" name="mensagem" className="h-28 w-full resize-none rounded-md border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none ring-0 focus:border-indigo-500" placeholder="Conte um pouco sobre o projeto" />
              </div>
              <button type="submit" className="rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
