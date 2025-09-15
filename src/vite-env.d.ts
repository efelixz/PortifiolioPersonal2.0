/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYTICS_PROVIDER?: 'plausible' | 'ga4' | 'both' | 'none'
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  readonly VITE_PLAUSIBLE_API_HOST?: string
  readonly VITE_GA4_MEASUREMENT_ID?: string
  readonly VITE_ANALYTICS_DEV?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}