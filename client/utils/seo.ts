// Gerador de Sitemap dinâmico
export interface SitemapPage {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const SITEMAP_PAGES: SitemapPage[] = [
  {
    url: '/',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    url: '/projetos',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: '/contato',
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: '/estudos',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.6
  }
];

export function generateSitemap(baseUrl: string = 'https://jeffersonfelix.dev'): string {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_PAGES.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

export function generateRobotsTxt(baseUrl: string = 'https://jeffersonfelix.dev'): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow specific paths (if any)
Disallow: /admin/
Disallow: /*.json$
Disallow: /api/

# Crawl delay (optional)
Crawl-delay: 1`;
}

// Hook para analytics e tracking
export function useAnalytics() {
  const trackPageView = (url: string, title?: string) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: title,
        page_location: url,
      });
    }

    // Custom analytics
    console.log('Page view:', { url, title, timestamp: new Date().toISOString() });
  };

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }

    // Custom analytics
    console.log('Event:', { eventName, parameters, timestamp: new Date().toISOString() });
  };

  const trackConversion = (conversionId: string, value?: number) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        send_to: conversionId,
        value: value,
        currency: 'BRL'
      });
    }

    console.log('Conversion:', { conversionId, value, timestamp: new Date().toISOString() });
  };

  return {
    trackPageView,
    trackEvent,
    trackConversion
  };
}

// Performance tracking
export function useWebVitals() {
  const reportWebVitals = (metric: any) => {
    console.log('Web Vital:', metric);
    
    // Enviar para Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  };

  return { reportWebVitals };
}