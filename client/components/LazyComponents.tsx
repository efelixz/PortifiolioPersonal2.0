import { lazy, Suspense } from 'react';

// Componentes que serão carregados sob demanda
const Avatar3D = lazy(() => import('@/components/Avatar3D'));
const SkillsSection = lazy(() => import('@/components/SkillsSection'));

// Componente de loading
const ComponentLoader = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
  </div>
);

// Wrapper para lazy loading com Suspense
export const LazyAvatar3D = (props: any) => (
  <Suspense fallback={<ComponentLoader className="h-64" />}>
    <Avatar3D {...props} />
  </Suspense>
);

export const LazySkillsSection = (props: any) => (
  <Suspense fallback={<ComponentLoader className="h-32" />}>
    <SkillsSection {...props} />
  </Suspense>
);

// Hook para lazy loading de imagens
export const useImagePreload = (src: string) => {
  const preloadImage = () => {
    const img = new Image();
    img.src = src;
  };
  
  return preloadImage;
};

// Componente de imagem otimizada
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = "",
  loading = "lazy",
  ...props 
}: {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  [key: string]: any;
}) => (
  <img 
    src={src}
    alt={alt}
    loading={loading}
    decoding="async"
    className={className}
    style={{ contentVisibility: 'auto' }}
    {...props}
  />
);