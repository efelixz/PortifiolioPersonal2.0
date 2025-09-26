import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

// Skill icons (you can replace with actual SVG icons or react-icons)
const skillIcons = {
  // Frontend
  React: "⚛️",
  TypeScript: "📘",
  JavaScript: "🟨",
  "Next.js": "▲",
  "Tailwind CSS": "🎨",
  HTML: "🌐",
  CSS: "🎨",
  SASS: "💅",
  
  // Backend
  "Node.js": "💚",
  Express: "🚀",
  Python: "🐍",
  PHP: "🐘",
  
  // Database
  MongoDB: "🍃",
  PostgreSQL: "🐘",
  MySQL: "🐬",
  Redis: "🔴",
  
  // Tools & Others
  Git: "📊",
  Docker: "🐳",
  AWS: "☁️",
  Figma: "🎯",
  Jest: "🃏",
  Cypress: "🌲"
};

const skillCategories = [
  {
    title: "Frontend",
    color: "from-blue-500 to-cyan-500",
    skills: ["React", "TypeScript", "JavaScript", "Next.js", "Tailwind CSS", "HTML", "CSS", "SASS"]
  },
  {
    title: "Backend",
    color: "from-green-500 to-emerald-500",
    skills: ["Node.js", "Express", "Python", "PHP"]
  },
  {
    title: "Database",
    color: "from-purple-500 to-pink-500",
    skills: ["MongoDB", "PostgreSQL", "MySQL", "Redis"]
  },
  {
    title: "Tools & Others",
    color: "from-orange-500 to-red-500",
    skills: ["Git", "Docker", "AWS", "Figma", "Jest", "Cypress"]
  }
];

function SkillCard({ skill, icon, index }: { skill: string; icon: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 group"
    >
      <div className="text-center">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-white font-medium text-sm">{skill}</h3>
      </div>
    </motion.div>
  );
}

function SkillCategory({ category, index }: { category: typeof skillCategories[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
      }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className={`inline-block text-xl font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent mb-2`}>
          {category.title}
        </h3>
        <div className={`h-1 w-16 mx-auto bg-gradient-to-r ${category.color} rounded-full`}></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {category.skills.map((skill, skillIndex) => (
          <SkillCard
            key={skill}
            skill={skill}
            icon={skillIcons[skill as keyof typeof skillIcons]}
            index={skillIndex}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 bg-slate-900/50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Minhas 
            </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Habilidades
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tecnologias e ferramentas que uso para criar experiências digitais incríveis
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="space-y-16">
          {skillCategories.map((category, index) => (
            <SkillCategory key={category.title} category={category} index={index} />
          ))}
        </div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-gray-400">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-400"></div>
            <span className="text-sm">Sempre aprendendo algo novo</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-2 h-2 bg-purple-400 rounded-full opacity-60"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded-full opacity-40"
        animate={{ 
          y: [0, 20, 0],
          x: [0, -10, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      />
    </section>
  );
}