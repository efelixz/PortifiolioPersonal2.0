import { useEffect } from 'react';

// Hook simplificado para SEO - solução para problema de BOM
interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  locale?: string;
  siteName?: string;
}

export function useSEO(props: SEOProps = {}) {
  useEffect(() => {
    if (props.title) {
      document.title = props.title;
    }
    
    // Meta description
    if (props.description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = props.description;
    }
  }, [props.title, props.description]);

  return props;
}

export function usePageSEO() {
  return { 
    currentPageSEO: { 
      title: 'Jefferson Araújo - Portfolio',
      description: 'Desenvolvedor Full Stack especializado em React, Node.js e tecnologias modernas.'
    }, 
    getPageSEO: (pathname: string) => {
      const routes: Record<string, SEOProps> = {
        '/': {
          title: 'Jefferson Araújo - Desenvolvedor Full Stack',
          description: 'Desenvolvedor Full Stack especializado em React, Node.js e tecnologias modernas.',
          type: 'website'
        },
        '/sobre': {
          title: 'Sobre Mim - Jefferson Araújo',
          description: 'Conheça mais sobre Jefferson Araújo, desenvolvedor full stack.',
          type: 'profile'
        },
        '/projetos': {
          title: 'Projetos - Jefferson Araújo',
          description: 'Confira os projetos desenvolvidos por Jefferson Araújo.',
          type: 'website'
        },
        '/contato': {
          title: 'Contato - Jefferson Araújo',
          description: 'Entre em contato com Jefferson Araújo.',
          type: 'website'
        }
      };
      
      return routes[pathname] || { title: 'Jefferson Araújo - Portfolio' };
    }
  };
}

export function useCoreWebVitals() {
  return {};
}