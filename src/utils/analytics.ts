/**
 * Google Analytics 4 (GA4) & Tag Manager (GTM) Helper for Energiza Soluções
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Default GA4 ID or loaded from environment variable
export const DEFAULT_GA_ID = ((import.meta as any).env?.VITE_GA_MEASUREMENT_ID) || '';

/**
 * Dynamically injects the Google Analytics 4 script tag into document head
 */
export function initGoogleAnalytics(gaId?: string) {
  const measurementId = gaId || DEFAULT_GA_ID || localStorage.getItem('energiza_ga_id') || '';
  if (!measurementId || typeof window === 'undefined') return;

  // Store in localStorage for runtime persistence across reloads
  localStorage.setItem('energiza_ga_id', measurementId);

  // Check if script is already present
  if (document.getElementById('ga-gtag-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-gtag-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    page_path: window.location.pathname,
    send_page_view: true,
  });

  console.log(`[GA4 Analytics] Initialized with ID: ${measurementId}`);
}

/**
 * Track custom events in both GA4 and GTM dataLayer
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  try {
    const timestamp = new Date().toISOString();
    const payload = {
      event: eventName,
      timestamp,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...params,
    };

    // Push to GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    } else {
      console.warn('[Analytics] window.dataLayer is not an array.');
    }

    // Push to GA4 gtag if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    console.log(`[Analytics Event] ${eventName}:`, payload);
  } catch (err) {
    console.error('[Analytics Event Error] Failed to track event:', err);
  }
}

/**
 * Track page view explicitly
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined') return;

  trackEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}
