type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: GtagFn
  }
}

/** Fire a GA4 event when gtag is available (after consent / tag load). */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}
