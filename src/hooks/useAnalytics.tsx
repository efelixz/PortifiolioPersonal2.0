import { useEffect, useCallback, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics, trackEvent } from '@/utils/analytics';

// Hook for analytics integration
export function useAnalytics() {
  const location = useLocation();
  const [hasConsent, setHasConsent] = useState(analytics.hasConsent());

  // Track page views automatically
  useEffect(() => {
    if (hasConsent) {
      const pageTitle = document.title;
      const pagePath = location.pathname;
      
      trackEvent.pageView(pagePath, pageTitle);
    }
  }, [location, hasConsent]);

  // Update consent status
  const updateConsent = useCallback((granted: boolean) => {
    setHasConsent(granted);
  }, []);

  return {
    hasConsent,
    updateConsent,
    track: trackEvent,
    analytics,
  };
}

// Hook for tracking specific interactions
export function useTrackInteraction() {
  const { hasConsent, track } = useAnalytics();

  const trackClick = useCallback((element: string, context?: string) => {
    if (!hasConsent) return;
    
    track.clickNavigation(element, context || 'unknown');
  }, [hasConsent, track]);

  const trackFormSubmit = useCallback((formName: string, success: boolean, data?: any) => {
    if (!hasConsent) return;
    
    if (formName === 'contact') {
      if (success) {
        track.submitContact({
          name: data?.name,
          email: data?.email,
          hasMessage: !!data?.message,
        });
      } else {
        track.contactFormError('submission_failed');
      }
    }
  }, [hasConsent, track]);

  const trackDownload = useCallback((type: 'cv' | 'hiring-pack', format?: string) => {
    if (!hasConsent) return;
    
    if (type === 'cv') {
      track.clickBaixarCV(format as 'pdf' | 'txt');
    } else {
      track.clickHiringPack();
    }
  }, [hasConsent, track]);

  const trackProjectInteraction = useCallback((
    action: 'case' | 'code' | 'demo',
    projectTitle: string,
    additionalData?: any
  ) => {
    if (!hasConsent) return;
    
    switch (action) {
      case 'case':
        track.clickVerCase(projectTitle, additionalData?.type);
        break;
      case 'code':
        track.clickVerCodigo(projectTitle, additionalData?.platform);
        break;
      case 'demo':
        track.clickDemo(projectTitle, additionalData?.demoType);
        break;
    }
  }, [hasConsent, track]);

  const trackThemeChange = useCallback((from: string, to: string) => {
    if (!hasConsent) return;
    
    track.changeTheme(from, to);
  }, [hasConsent, track]);

  const trackError = useCallback((error: Error, component?: string) => {
    if (!hasConsent) return;
    
    track.error('javascript_error', error.message, component);
  }, [hasConsent, track]);

  return {
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackProjectInteraction,
    trackThemeChange,
    trackError,
  };
}

// Hook for performance tracking
export function usePerformanceTracking() {
  const { hasConsent, track } = useAnalytics();

  useEffect(() => {
    if (!hasConsent || typeof window === 'undefined') return;

    // Track Core Web Vitals
    const trackWebVitals = async () => {
      try {
        // Check if web-vitals is available
        const webVitals = await import('web-vitals').catch(() => null);
        if (!webVitals) {
          console.warn('Web Vitals library not available');
          return;
        }

        const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals;

        getCLS((metric) => {
          track.performanceMetric('CLS', metric.value, 'score');
        });

        getFID((metric) => {
          track.performanceMetric('FID', metric.value, 'ms');
        });

        getFCP((metric) => {
          track.performanceMetric('FCP', metric.value, 'ms');
        });

        getLCP((metric) => {
          track.performanceMetric('LCP', metric.value, 'ms');
        });

        getTTFB((metric) => {
          track.performanceMetric('TTFB', metric.value, 'ms');
        });
      } catch (error) {
        console.warn('Web Vitals tracking failed:', error);
      }
    };

    // Track after page load
    if (document.readyState === 'complete') {
      trackWebVitals();
    } else {
      window.addEventListener('load', trackWebVitals);
      return () => window.removeEventListener('load', trackWebVitals);
    }
  }, [hasConsent, track]);

  const trackCustomMetric = useCallback((name: string, value: number, unit: string) => {
    if (!hasConsent) return;
    
    track.performanceMetric(name, value, unit);
  }, [hasConsent, track]);

  return {
    trackCustomMetric,
  };
}

// Hook for A/B testing (future use)
export function useABTest(testName: string, variants: string[]) {
  const [variant, setVariant] = useState<string>('');
  const { hasConsent, track } = useAnalytics();

  useEffect(() => {
    // Simple A/B test implementation
    const storedVariant = localStorage.getItem(`ab_test_${testName}`);
    
    if (storedVariant && variants.includes(storedVariant)) {
      setVariant(storedVariant);
    } else {
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      setVariant(randomVariant);
      localStorage.setItem(`ab_test_${testName}`, randomVariant);
      
      // Track assignment
      if (hasConsent) {
        analytics.track('ab_test_assignment', {
          test_name: testName,
          variant: randomVariant,
        });
      }
    }
  }, [testName, variants, hasConsent]);

  const trackConversion = useCallback((conversionType: string, value?: number) => {
    if (!hasConsent) return;
    
    analytics.track('ab_test_conversion', {
      test_name: testName,
      variant,
      conversion_type: conversionType,
      value,
    });
  }, [testName, variant, hasConsent]);

  return {
    variant,
    trackConversion,
  };
}

// Hook for session tracking
export function useSessionTracking() {
  const { hasConsent, track } = useAnalytics();

  useEffect(() => {
    if (!hasConsent) return;

    const sessionStart = Date.now();
    let isActive = true;
    let lastActivity = sessionStart;

    // Track session start
    analytics.track('session_start', {
      timestamp: sessionStart,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    });

    // Track user activity
    const updateActivity = () => {
      lastActivity = Date.now();
      isActive = true;
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check for inactivity
    const inactivityTimer = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity > 30000 && isActive) { // 30 seconds
        isActive = false;
        analytics.track('session_inactive', {
          duration: timeSinceActivity,
        });
      }
    }, 10000); // Check every 10 seconds

    // Track session end on page unload
    const handleUnload = () => {
      const sessionDuration = Date.now() - sessionStart;
      analytics.track('session_end', {
        duration: sessionDuration,
        was_active: isActive,
      });
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityTimer);
      window.removeEventListener('beforeunload', handleUnload);
      handleUnload(); // Track session end on component unmount
    };
  }, [hasConsent]);
}

// Hook for error boundary integration
export function useErrorTracking() {
  const { trackError } = useTrackInteraction();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), 'global');
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(String(event.reason)), 'promise');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);

  return { trackError };
}