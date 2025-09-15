// Analytics configuration
// Update these values with your actual analytics IDs

export const analyticsConfig = {
  // Analytics provider: 'plausible', 'ga4', 'both', or 'none'
  provider: (import.meta.env.VITE_ANALYTICS_PROVIDER as 'plausible' | 'ga4' | 'both' | 'none') || 'plausible',
  
  // Plausible configuration
  plausible: {
    domain: import.meta.env.VITE_PLAUSIBLE_DOMAIN || 'jefferson.dev',
    apiHost: import.meta.env.VITE_PLAUSIBLE_API_HOST || 'https://plausible.io',
  },
  
  // Google Analytics 4 configuration
  ga4: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  },
  
  // Feature flags
  enableLocalStorage: true,
  enableConsent: true,
  enablePerformanceTracking: true,
  enableErrorTracking: true,
  enableSessionTracking: true,
  
  // Development settings
  enableInDevelopment: import.meta.env.DEV && import.meta.env.VITE_ANALYTICS_DEV === 'true',
  logEvents: import.meta.env.DEV,
} as const;

// Environment variables validation
export const validateAnalyticsConfig = () => {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Check if provider is configured
  if (analyticsConfig.provider === 'none') {
    warnings.push('Analytics provider is set to "none" - no tracking will occur');
  }

  // Validate Plausible config
  if (analyticsConfig.provider === 'plausible' || analyticsConfig.provider === 'both') {
    if (analyticsConfig.plausible.domain === 'jefferson.dev') {
      warnings.push('Using default Plausible domain - update VITE_PLAUSIBLE_DOMAIN');
    }
  }

  // Validate GA4 config
  if (analyticsConfig.provider === 'ga4' || analyticsConfig.provider === 'both') {
    if (analyticsConfig.ga4.measurementId === 'G-XXXXXXXXXX') {
      warnings.push('Using default GA4 measurement ID - update VITE_GA4_MEASUREMENT_ID');
    }
  }

  // Log warnings and errors
  if (warnings.length > 0) {
    console.warn('Analytics Configuration Warnings:', warnings);
  }
  
  if (errors.length > 0) {
    console.error('Analytics Configuration Errors:', errors);
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
};

// Event names constants
export const ANALYTICS_EVENTS = {
  // Page events
  PAGE_VIEW: 'page_view',
  
  // Navigation events
  CLICK_NAVIGATION: 'click_navigation',
  
  // Project events
  CLICK_VER_CASE: 'click_ver_case',
  CLICK_VER_CODIGO: 'click_ver_codigo',
  CLICK_DEMO: 'click_demo',
  
  // Download events
  CLICK_BAIXAR_CV: 'click_baixar_cv',
  CLICK_HIRING_PACK: 'click_hiring_pack',
  
  // Form events
  SUBMIT_CONTACT: 'submit_contact',
  CONTACT_FORM_ERROR: 'contact_form_error',
  
  // Theme events
  CHANGE_THEME: 'change_theme',
  
  // Interaction events
  INTERACT_3D_AVATAR: 'interact_3d_avatar',
  USE_DEMO_EDITOR: 'use_demo_editor',
  USE_LIVE_PREVIEW: 'use_live_preview',
  
  // Social events
  CLICK_SOCIAL_LINK: 'click_social_link',
  
  // Performance events
  PERFORMANCE_METRIC: 'performance_metric',
  
  // Error events
  ERROR: 'error',
  
  // Session events
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  SESSION_INACTIVE: 'session_inactive',
  
  // Consent events
  CONSENT_GRANTED: 'consent_granted',
  CONSENT_DENIED: 'consent_denied',
  
  // A/B Testing events
  AB_TEST_ASSIGNMENT: 'ab_test_assignment',
  AB_TEST_CONVERSION: 'ab_test_conversion',
} as const;

// Event properties types
export interface EventProperties {
  [ANALYTICS_EVENTS.PAGE_VIEW]: {
    page: string;
    title?: string;
  };
  
  [ANALYTICS_EVENTS.CLICK_VER_CASE]: {
    project_title: string;
    project_type?: string;
  };
  
  [ANALYTICS_EVENTS.CLICK_BAIXAR_CV]: {
    format: 'pdf' | 'txt';
  };
  
  [ANALYTICS_EVENTS.SUBMIT_CONTACT]: {
    has_name: boolean;
    has_email: boolean;
    has_message: boolean;
  };
  
  [ANALYTICS_EVENTS.CHANGE_THEME]: {
    from_theme: string;
    to_theme: string;
  };
  
  // Add more event properties as needed
}

// Default event properties
export const getDefaultEventProperties = () => ({
  timestamp: Date.now(),
  url: window.location.href,
  referrer: document.referrer,
  user_agent: navigator.userAgent,
  screen_resolution: `${screen.width}x${screen.height}`,
  viewport_size: `${window.innerWidth}x${window.innerHeight}`,
  language: navigator.language,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});