import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border-t border-border bg-background/60"
    >
      <div className="container grid gap-6 py-10 md:grid-cols-3">
        <div>
          <div className="mb-3 inline-flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              <span className="text-xs font-bold">JF</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Jefferson Felix
            </span>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Construindo interfaces rápidas, escaláveis e com impacto real.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/projetos" className="hover:text-foreground transition-colors">
            Projetos
          </Link>
          <Link to="/sobre" className="hover:text-foreground transition-colors">
            Sobre
          </Link>
          <Link to="/contato" className="hover:text-foreground transition-colors">
            Contato
          </Link>
        </nav>
        <div className="flex items-center gap-3 md:justify-end">
          <motion.a
            href="mailto:contato@jefferson.dev"
            aria-label="Email"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Mail className="h-5 w-5" />
          </motion.a>
          <motion.a
            href="#"
            aria-label="GitHub"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
          </motion.a>
          <motion.a
            href="#"
            aria-label="LinkedIn"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </motion.a>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jefferson Felix. Todos os direitos
        reservados.
      </div>
    </motion.footer>
  );
}