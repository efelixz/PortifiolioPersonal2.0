import { useEffect } from 'react';

export function usePageSignature(pageName?: string) {
  useEffect(() => {
    const styles = {
      title: [
        'color: #6366f1',
        'font-size: 18px',
        'font-weight: bold',
        'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3)',
        'padding: 10px',
      ].join(';'),
      subtitle: 'color: #64748b; font-size: 14px',
      page: 'color: #818cf8; font-size: 12px; font-style: italic'
    };

    console.log('%cDesenvolvido com ❤️ por Jefferson Felix', styles.title);
    console.log('%cPortfólio profissional © 2024', styles.subtitle);
    if (pageName) {
      console.log(`%cPágina atual: ${pageName}`, styles.page);
    }
  }, [pageName]);
}