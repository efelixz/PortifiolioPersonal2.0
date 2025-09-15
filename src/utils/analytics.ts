// Analytics and tracking utilities
// Supports Plausible, GA4, and localStorage fallback

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface AnalyticsConfig {
  provider: 'plausible' | 'ga4' | 'both' | 'none';
  plausible?: {
    domain: string;
    apiHost?: string;
  };
  ga4?: {
    measurementId: string;
  };
  enableLocalStorage: boolean;
  enableConsent: boolean;
}

class AnalyticsManager {
  private config: AnalyticsConfig;
  private sessionId: string;
  private userId?: string;
  private consentGiven: boolean = false;
  private eventQueue: AnalyticsEvent[] = [];

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.consentGiven = this.getStoredConsent();
    
    // Process queued events if consent already given
    if (this.consentGiven) {
      this.initializeProviders();
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get or create user ID
  private getUserId(): string {
    const stored = localStorage.getItem('portfolio_user_id');
    if (stored) return stored;
    
    const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('portfolio_user_id', newId);
    return newId;
  }

  // Check stored consent
  private getStoredConsent(): boolean {
    const consent = localStorage.getItem('portfolio_analytics_consent');
    return consent === 'granted';
  }

  // Initialize analytics providers
  private async initializeProviders(): Promise<void> {
    if (this.config.provider === 'plausible' || this.config.provider === 'both') {
      await this.initializePlausible();
    }
    
    if (this.config.provider === 'ga4' || this.config.provider === 'both') {
      await this.initializeGA4();
    }
  }

  // Initialize Plausible
  private async initializePlausible(): Promise<void> {
    if (!this.config.plausible) return;

    const script = document.createElement('script');
    script.defer = true;
    script.src = `${this.config.plausible.apiHost || 'https://plausible.io'}/js/script.js`;
    script.setAttribute('data-domain', this.config.plausible.domain);
    document.head.appendChild(script);

    // Wait for script to load
    await new Promise((resolve) => {
      script.onload = resolve;
      script.onerror = resolve; // Continue even if fails
    });
  }

  // Initialize GA4
  private async initializeGA4(): Promise<void> {
    if (!this.config.ga4) return;

    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    
    gtag('js', new Date());
    gtag('config', this.config.ga4.measurementId, {
      anonymize_ip: true,
      respect_dnt: true,
    });

    // Make gtag globally available
    (window as any).gtag = gtag;
  }

  // Grant consent and initialize providers
  async grantConsent(): Promise<void> {
    this.consentGiven = true;
    localStorage.setItem('portfolio_analytics_consent', 'granted');
    localStorage.setItem('portfolio_analytics_consent_date', new Date().toISOString());
    
    await this.initializeProviders();
    
    // Process queued events
    this.eventQueue.forEach(event => this.sendEvent(event));
    this.eventQueue = [];
  }

  // Revoke consent
  revokeConsent(): void {
    this.consentGiven = false;
    localStorage.setItem('portfolio_analytics_consent', 'denied');
    localStorage.removeItem('portfolio_analytics_consent_date');
    
    // Clear stored events
    localStorage.removeItem('portfolio_analytics_events');
    
    // Clear cookies (basic cleanup)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  }

  // Track event
  track(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    if (this.consentGiven) {
      this.sendEvent(event);
    } else {
      // Queue event for later or store in localStorage
      if (this.config.enableLocalStorage) {
        this.storeEventLocally(event);
      } else {
        this.eventQueue.push(event);
      }
    }
  }

  // Send event to providers
  private sendEvent(event: AnalyticsEvent): void {
    // Send to Plausible
    if ((this.config.provider === 'plausible' || this.config.provider === 'both') && 
        typeof (window as any).plausible !== 'undefined') {
      (window as any).plausible(event.name, { 
        props: event.properties 
      });
    }

    // Send to GA4
    if ((this.config.provider === 'ga4' || this.config.provider === 'both') && 
        typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.name, {
        ...event.properties,
        session_id: event.sessionId,
        user_id: event.userId,
      });
    }

    // Store locally as fallback
    if (this.config.enableLocalStorage) {
      this.storeEventLocally(event);
    }

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  // Store event in localStorage
  private storeEventLocally(event: AnalyticsEvent): void {
    try {
      const stored = localStorage.getItem('portfolio_analytics_events');
      const events: AnalyticsEvent[] = stored ? JSON.parse(stored) : [];
      
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('portfolio_analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event locally:', error);
    }
  }

  // Get stored events
  getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('portfolio_analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to retrieve stored analytics events:', error);
      return [];
    }
  }

  // Clear stored events
  clearStoredEvents(): void {
    localStorage.removeItem('portfolio_analytics_events');
  }

  // Get consent status
  hasConsent(): boolean {
    return this.consentGiven;
  }

  // Get analytics summary
  getAnalyticsSummary(): {
    consentGiven: boolean;
    consentDate?: string;
    sessionId: string;
    userId: string;
    storedEvents: number;
    provider: string;
  } {
    const consentDate = localStorage.getItem('portfolio_analytics_consent_date');
    
    return {
      consentGiven: this.consentGiven,
      consentDate: consentDate || undefined,
      sessionId: this.sessionId,
      userId: this.userId,
      storedEvents: this.getStoredEvents().length,
      provider: this.config.provider,
    };
  }
}

// Default configuration using environment variables
const defaultConfig: AnalyticsConfig = {
  provider: (import.meta.env.VITE_ANALYTICS_PROVIDER as 'plausible' | 'ga4' | 'both' | 'none') || 'plausible',
  plausible: {
    domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'jefferson.dev',
    apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST || 'https://plausible.io',
  },
  ga4: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  },
  enableLocalStorage: true,
  enableConsent: true,
};

// Create global analytics instance
export const analytics = new AnalyticsManager(defaultConfig);

// Predefined event tracking functions
export const trackEvent = {
  // Page views
  pageView: (page: string, title?: string) => {
    analytics.track('page_view', { page, title });
  },

  // Navigation
  clickNavigation: (destination: string, source: string) => {
    analytics.track('click_navigation', { destination, source });
  },

  // Project interactions
  clickVerCase: (projectTitle: string, projectType?: string) => {
    analytics.track('click_ver_case', { 
      project_title: projectTitle,
      project_type: projectType 
    });
  },

  clickVerCodigo: (projectTitle: string, platform?: string) => {
    analytics.track('click_ver_codigo', { 
      project_title: projectTitle,
      platform 
    });
  },

  clickDemo: (projectTitle: string, demoType?: string) => {
    analytics.track('click_demo', { 
      project_title: projectTitle,
      demo_type: demoType 
    });
  },

  // CV and hiring pack
  clickBaixarCV: (format: 'pdf' | 'txt' = 'pdf') => {
    analytics.track('click_baixar_cv', { format });
  },

  clickHiringPack: (type: 'complete' | 'cv' = 'complete') => {
    analytics.track('click_hiring_pack', { type });
  },

  // Contact form
  submitContact: (formData: { name?: string; email?: string; hasMessage: boolean }) => {
    analytics.track('submit_contact', {
      has_name: !!formData.name,
      has_email: !!formData.email,
      has_message: formData.hasMessage,
    });
  },

  contactFormError: (errorType: string, field?: string) => {
    analytics.track('contact_form_error', { error_type: errorType, field });
  },

  // Theme changes
  changeTheme: (from: string, to: string) => {
    analytics.track('change_theme', { from_theme: from, to_theme: to });
  },

  // 3D Avatar interactions
  interact3DAvatar: (interactionType: 'hover' | 'click' | 'drag') => {
    analytics.track('interact_3d_avatar', { interaction_type: interactionType });
  },

  // Demo interactions
  useDemoEditor: (language: string, codeLength: number) => {
    analytics.track('use_demo_editor', { language, code_length: codeLength });
  },

  useLivePreview: (viewport: string) => {
    analytics.track('use_live_preview', { viewport });
  },

  // Social links
  clickSocialLink: (platform: string, location: string) => {
    analytics.track('click_social_link', { platform, location });
  },

  // Performance events
  performanceMetric: (metric: string, value: number, unit: string) => {
    analytics.track('performance_metric', { metric, value, unit });
  },

  // Error tracking
  error: (errorType: string, errorMessage: string, component?: string) => {
    analytics.track('error', { 
      error_type: errorType, 
      error_message: errorMessage,
      component 
    });
  },
};

// Export types for external use
export type { AnalyticsEvent, AnalyticsConfig };

// Declare global types
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    plausible: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}