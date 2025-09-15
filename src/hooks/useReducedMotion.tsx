import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Animation variants that respect reduced motion preference
export const getAnimationVariants = (prefersReducedMotion: boolean) => ({
  initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
  animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
  transition: prefersReducedMotion 
    ? { duration: 0 } 
    : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
});