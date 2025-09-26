import { useState, useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'click' | 'form_submit' | 'download' | 'scroll' | 'time_spent' | 'search' | 'error';
  page: string;
  element?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

interface AnalyticsMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number; percentage: number }>;
  topEvents: Array<{ type: string; count: number; percentage: number }>;
  hourlyActivity: Array<{ hour: number; activity: number }>;
  dailyActivity: Array<{ date: string; activity: number }>;
  conversionRate: number;
  deviceBreakdown: Array<{ device: string; count: number; percentage: number }>;
  browserBreakdown: Array<{ browser: string; count: number; percentage: number }>;
}

interface UserBehavior {
  scrollDepth: number;
  timeOnPage: number;
  clicksCount: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screenResolution: string;
  language: string;
}

const ANALYTICS_STORAGE_KEY = 'portfolio_analytics_events';
const SESSION_STORAGE_KEY = 'portfolio_session_id';
const USER_ID_KEY = 'portfolio_user_id';

export function useAnalytics() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [currentSession, setCurrentSession] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [behavior, setBehavior] = useState<UserBehavior>({
    scrollDepth: 0,
    timeOnPage: 0,
    clicksCount: 0,
    deviceType: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language
  });

  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    // Inicializar IDs de sessão e usuário
    initializeUserTracking();
    
    // Track page view inicial
    trackEvent('page_view', window.location.pathname);

    // Configurar event listeners
    const cleanupListeners = setupEventListeners();

    // Carregar métricas
    loadMetrics();

    return cleanupListeners;
  }, []);

  const initializeUserTracking = () => {
    // Session ID (expires when browser closes)
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = generateId('session');
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    setCurrentSession(sessionId);

    // User ID (persistent)
    let userIdFromStorage = localStorage.getItem(USER_ID_KEY);
    if (!userIdFromStorage) {
      userIdFromStorage = generateId('user');
      localStorage.setItem(USER_ID_KEY, userIdFromStorage);
    }
    setUserId(userIdFromStorage);
  };

  const generateId = (prefix: string) => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const trackEvent = useCallback((
    type: AnalyticsEvent['type'],
    page: string,
    element?: string,
    value?: number,
    metadata?: Record<string, any>
  ) => {
    if (!isTracking) return;

    const event: AnalyticsEvent = {
      id: generateId('event'),
      type,
      page,
      element,
      value,
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp_iso: new Date().toISOString(),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      timestamp: Date.now(),
      sessionId: currentSession,
      userId: userId
    };

    // Salvar evento
    saveEvent(event);

    // Atualizar comportamento em tempo real
    updateBehavior(type, value);

    // Enviar para Google Analytics 4 (se configurado)
    sendToGA4(event);

    // Debug log (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }, [isTracking, currentSession, userId]);

  const saveEvent = (event: AnalyticsEvent) => {
    const events = getStoredEvents();
    events.push(event);
    
    // Manter apenas os últimos 2000 eventos para performance
    if (events.length > 2000) {
      events.splice(0, events.length - 2000);
    }
    
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(events));
  };

  const getStoredEvents = (): AnalyticsEvent[] => {
    try {
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const setupEventListeners = () => {
    let startTime = Date.now();
    let maxScrollDepth = 0;
    let clickCount = 0;

    // Scroll tracking com throttling
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.pageYOffset;
        const depth = Math.round((currentScroll / totalHeight) * 100);
        
        if (depth > maxScrollDepth) {
          maxScrollDepth = depth;
          setBehavior(prev => ({ ...prev, scrollDepth: depth }));
          
          // Track milestone scroll depths
          if (depth > 0 && depth % 25 === 0) {
            trackEvent('scroll', window.location.pathname, 'scroll_depth', depth);
          }
        }
      }, 100);
    };

    // Click tracking com informações detalhadas
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const elementInfo = getElementInfo(target);
      
      clickCount++;
      setBehavior(prev => ({ ...prev, clicksCount: clickCount }));
      
      trackEvent('click', window.location.pathname, elementInfo, 1, {
        x: (e as MouseEvent).clientX,
        y: (e as MouseEvent).clientY,
        button: (e as MouseEvent).button
      });
    };

    // Form submissions
    const handleFormSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      const formInfo = getFormInfo(form);
      trackEvent('form_submit', window.location.pathname, formInfo);
    };

    // Errors
    const handleError = (e: ErrorEvent) => {
      trackEvent('error', window.location.pathname, 'javascript_error', 1, {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    };

    // Visibilidade da página
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = Date.now() - startTime;
        setBehavior(prev => ({ ...prev, timeOnPage: timeSpent }));
        trackEvent('time_spent', window.location.pathname, undefined, timeSpent);
      } else {
        startTime = Date.now();
      }
    };

    // Page unload
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      trackEvent('time_spent', window.location.pathname, undefined, timeSpent);
    };

    // Mudanças de rota (SPA)
    const handlePopState = () => {
      const timeSpent = Date.now() - startTime;
      trackEvent('time_spent', document.referrer || 'direct', undefined, timeSpent);
      trackEvent('page_view', window.location.pathname);
      startTime = Date.now();
    };

    // Adicionar listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick, true);
    document.addEventListener('submit', handleFormSubmit);
    window.addEventListener('error', handleError);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Cleanup function
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('submit', handleFormSubmit);
      window.removeEventListener('error', handleError);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  };

  const updateBehavior = (type: AnalyticsEvent['type'], value?: number) => {
    setBehavior(prev => {
      const updated = { ...prev };
      
      switch (type) {
        case 'click':
          updated.clicksCount = prev.clicksCount + 1;
          break;
        case 'scroll':
          if (value && value > updated.scrollDepth) {
            updated.scrollDepth = value;
          }
          break;
        case 'time_spent':
          updated.timeOnPage = value || 0;
          break;
      }
      
      return updated;
    });
  };

  const loadMetrics = () => {
    const events = getStoredEvents();
    const calculatedMetrics = calculateMetrics(events);
    setMetrics(calculatedMetrics);
  };

  const calculateMetrics = (events: AnalyticsEvent[]): AnalyticsMetrics => {
    if (events.length === 0) {
      return {
        totalPageViews: 0,
        uniqueVisitors: 0,
        averageTimeOnSite: 0,
        bounceRate: 0,
        topPages: [],
        topEvents: [],
        hourlyActivity: Array.from({ length: 24 }, (_, hour) => ({ hour, activity: 0 })),
        dailyActivity: [],
        conversionRate: 0,
        deviceBreakdown: [],
        browserBreakdown: []
      };
    }

    const pageViews = events.filter(e => e.type === 'page_view');
    const uniqueVisitors = [...new Set(events.map(e => e.sessionId))].length;

    // Top pages
    const pageCounts = pageViews.reduce((acc, event) => {
      acc[event.page] = (acc[event.page] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageCounts)
      .map(([page, views]) => ({ 
        page, 
        views, 
        percentage: Math.round((views / pageViews.length) * 100) 
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Top events
    const eventCounts = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(eventCounts)
      .map(([type, count]) => ({ 
        type, 
        count, 
        percentage: Math.round((count / events.length) * 100) 
      }))
      .sort((a, b) => b.count - a.count);

    // Atividade por hora
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourEvents = events.filter(e => {
        const eventHour = new Date(e.timestamp).getHours();
        return eventHour === hour;
      });
      return { hour, activity: hourEvents.length };
    });

    // Atividade diária (últimos 30 dias)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentEvents = events.filter(e => e.timestamp >= thirtyDaysAgo);
    
    const dailyActivity = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = recentEvents.filter(e => {
        const eventDate = new Date(e.timestamp).toISOString().split('T')[0];
        return eventDate === dateString;
      });
      return { date: dateString, activity: dayEvents.length };
    }).reverse();

    // Device breakdown
    const deviceCounts = events.reduce((acc, event) => {
      const device = event.metadata?.userAgent ? getDeviceFromUserAgent(event.metadata.userAgent) : 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device, count]) => ({ 
        device, 
        count, 
        percentage: Math.round((count / events.length) * 100) 
      }))
      .sort((a, b) => b.count - a.count);

    // Browser breakdown
    const browserCounts = events.reduce((acc, event) => {
      const browser = event.metadata?.userAgent ? getBrowserFromUserAgent(event.metadata.userAgent) : 'unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const browserBreakdown = Object.entries(browserCounts)
      .map(([browser, count]) => ({ 
        browser, 
        count, 
        percentage: Math.round((count / events.length) * 100) 
      }))
      .sort((a, b) => b.count - a.count);

    // Métricas de tempo
    const timeEvents = events.filter(e => e.type === 'time_spent' && e.value);
    const averageTimeOnSite = timeEvents.length > 0 
      ? Math.round(timeEvents.reduce((sum, e) => sum + (e.value || 0), 0) / timeEvents.length / 1000)
      : 0;

    // Taxa de conversão
    const formSubmissions = events.filter(e => e.type === 'form_submit').length;
    const conversionRate = pageViews.length > 0 ? Math.round((formSubmissions / pageViews.length) * 100) : 0;

    // Bounce rate
    const bounceRate = calculateBounceRate(events);

    return {
      totalPageViews: pageViews.length,
      uniqueVisitors,
      averageTimeOnSite,
      bounceRate,
      topPages,
      topEvents,
      hourlyActivity,
      dailyActivity,
      conversionRate,
      deviceBreakdown,
      browserBreakdown
    };
  };

  const calculateBounceRate = (events: AnalyticsEvent[]): number => {
    const sessionGroups = events.reduce((acc, event) => {
      if (!acc[event.sessionId]) acc[event.sessionId] = [];
      acc[event.sessionId].push(event);
      return acc;
    }, {} as Record<string, AnalyticsEvent[]>);

    const sessions = Object.values(sessionGroups);
    const bouncedSessions = sessions.filter(session => {
      const pageViews = session.filter(e => e.type === 'page_view');
      const timeSpent = session.filter(e => e.type === 'time_spent' && (e.value || 0) < 30000); // < 30 segundos
      return pageViews.length === 1 || timeSpent.length > 0;
    });

    return sessions.length > 0 ? Math.round((bouncedSessions.length / sessions.length) * 100) : 0;
  };

  const sendToGA4 = (event: AnalyticsEvent) => {
    // Integração com Google Analytics 4 (se configurado)
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', event.type, {
        page_title: document.title,
        page_location: window.location.href,
        custom_parameter: event.element || event.value,
        event_category: 'engagement',
        event_label: event.page
      });
    }
  };

  const clearAnalytics = () => {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    setMetrics(null);
    setBehavior({
      scrollDepth: 0,
      timeOnPage: 0,
      clicksCount: 0,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language
    });
  };

  const exportAnalytics = () => {
    const events = getStoredEvents();
    const dataStr = JSON.stringify({ events, metrics, behavior }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    localStorage.setItem('analytics_tracking_enabled', (!isTracking).toString());
  };

  return {
    metrics,
    behavior,
    currentSession,
    userId,
    isTracking,
    trackEvent,
    loadMetrics,
    clearAnalytics,
    exportAnalytics,
    toggleTracking
  };
}

// Funções auxiliares
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getOS(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Windows NT')) return 'Windows';
  if (userAgent.includes('Macintosh')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return 'Unknown';
}

function getElementInfo(element: HTMLElement): string {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : '';
  const className = element.className ? `.${element.className.toString().split(' ').join('.')}` : '';
  const text = element.textContent?.slice(0, 50).trim() || '';
  
  return `${tag}${id}${className}${text ? ` "${text}"` : ''}`.trim();
}

function getFormInfo(form: HTMLFormElement): string {
  const action = form.action || 'no-action';
  const method = form.method || 'get';
  const id = form.id ? `#${form.id}` : '';
  const className = form.className ? `.${form.className.split(' ').join('.')}` : '';
  
  return `form${id}${className} [${method}] -> ${action}`;
}

function getDeviceFromUserAgent(userAgent: string): string {
  if (/Mobi|Android/i.test(userAgent)) return 'mobile';
  if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function getBrowserFromUserAgent(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}