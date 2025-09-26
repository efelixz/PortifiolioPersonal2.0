import { motion } from "framer-motion";
import { Code2, Rocket, Brain, Trophy, Calendar, MapPin, GraduationCap, Briefcase } from "lucide-react";
import Particles from "@/components/visual/Particles";
import { useSEO } from "@/hooks/SEOHelper";
import { useState, useEffect } from "react";

export default function AboutPage() {
  useSEO({
    title: 'Sobre - Jefferson Felix',
    description: 'Conheça Jefferson Felix, desenvolvedor frontend especializado em React, TypeScript e automações. Experiência em soluções inovadoras e desenvolvimento ágil.',
    url: 'https://efelixz.me/sobre',
    type: 'website',
    keywords: [
      'jefferson felix',
      'desenvolvedor frontend',
      'react developer',
      'typescript',
      'automação',
      'rpa developer',
      'javascript',
      'portfolio developer'
    ]
  });

  // Estados para os dados do about com valores padrão
  const [bioText, setBioText] = useState([
    'Comecei minha jornada na programação em 2021, fascinado pela possibilidade de resolver problemas complexos através do código. O que começou como curiosidade rapidamente se transformou em paixão.',
    'Especializo-me em desenvolvimento frontend com React e TypeScript, criando interfaces intuitivas e performáticas. Paralelamente, desenvolvo automações com Python e RPA que otimizam processos empresariais.',
    'Acredito que a tecnologia deve ser acessível e resolver problemas reais. Por isso, foco em criar soluções que não apenas funcionam, mas que proporcionam uma experiência excepcional aos usuários.'
  ]);

  const [location, setLocation] = useState('Brasil • Trabalho Remoto');
  const [education, setEducation] = useState({
    title: 'Autodidata em Desenvolvimento Web',
    subtitle: 'Aprendizado contínuo em tecnologias modernas'
  });
  const [currentFocus, setCurrentFocus] = useState({
    title: 'Desenvolvimento Frontend & Automações',
    subtitle: 'React, TypeScript, Python, RPA'
  });

  const [skills, setSkills] = useState([
    { name: "Frontend Development", level: 95, description: "React, TypeScript, JavaScript" },
    { name: "Automação & RPA", level: 90, description: "Python, Selenium, Process Automation" },
    { name: "UI/UX Design", level: 85, description: "Figma, Tailwind CSS, Design Systems" },
    { name: "Backend Integration", level: 80, description: "Node.js, APIs, Database Design" }
  ]);

  const [experience, setExperience] = useState([
    {
      title: "Desenvolvedor Frontend Freelancer",
      period: "2023 - Presente",
      description: "Desenvolvimento de aplicações React modernas, dashboards interativos e automações personalizadas."
    },
    {
      title: "Especialista em Automação",
      period: "2022 - 2023",
      description: "Criação de bots RPA e automação de processos empresariais com Python e Selenium."
    },
    {
      title: "Desenvolvedor Web",
      period: "2021 - 2022",
      description: "Desenvolvimento de sites responsivos e aplicações web com foco em performance e UX."
    }
  ]);

  const [achievements, setAchievements] = useState([
    "10+ projetos de automação entregues",
    "15+ aplicações React desenvolvidas",
    "80% redução de tempo em processos automatizados",
    "100% satisfação dos clientes"
  ]);
  
  // Carregar dados do localStorage quando disponíveis
  useEffect(() => {
    const savedContent = localStorage.getItem('about_content');
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent);
      setBioText(parsedContent.bioText);
      setLocation(parsedContent.location);
      setEducation(parsedContent.education);
      setCurrentFocus(parsedContent.currentFocus);
      setSkills(parsedContent.skills);
      setExperience(parsedContent.experience);
      setAchievements(parsedContent.achievements);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 animated-gradient" />
        <Particles className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full" />
        <div className="container py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">
              Sobre mim
            </h1>
            <p className="mt-4 text-lg text-white/80 leading-relaxed">
              Sou Jefferson Felix, desenvolvedor frontend apaixonado por criar soluções digitais inovadoras.
              Com experiência em React, TypeScript e automações, transformo ideias em aplicações funcionais
              e elegantes que fazem a diferença no dia a dia das pessoas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <section className="container py-16">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6">Minha História</h2>
            <div className="space-y-4 text-white/80">
              {bioText.map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Localização</span>
              </div>
              <p className="text-white/80">{location}</p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Formação</span>
              </div>
              <p className="text-white/80">{education.title}</p>
              <p className="text-white/60 text-sm mt-1">{education.subtitle}</p>
            </div>

            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Foco Atual</span>
              </div>
              <p className="text-white/80">{currentFocus.title}</p>
              <p className="text-white/60 text-sm mt-1">{currentFocus.subtitle}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills */}
      <section className="container py-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          Principais Habilidades
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">{skill.name}</h3>
                <span className="text-purple-400 font-bold">{skill.level}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <p className="text-white/70 text-sm">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="container py-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          Experiência Profissional
        </motion.h2>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                <h3 className="font-semibold text-lg">{exp.title}</h3>
                <span className="text-purple-400 font-medium flex items-center gap-2 mt-1 md:mt-0">
                  <Calendar className="w-4 h-4" />
                  {exp.period}
                </span>
              </div>
              <p className="text-white/80">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="container py-16">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-8"
        >
          Conquistas
        </motion.h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 text-center"
            >
              <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-white/90 font-medium">{achievement}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Vamos trabalhar juntos?</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Estou sempre aberto a novos desafios e oportunidades de colaboração. 
            Se você tem um projeto em mente, vamos conversar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contato"
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-all"
            >
              Entre em Contato
            </a>
            <a
              href="/projetos"
              className="border border-white/20 px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition-all"
            >
              Ver Projetos
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}