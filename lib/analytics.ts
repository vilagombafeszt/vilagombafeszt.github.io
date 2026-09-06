const GA_MEASUREMENT_ID = 'G-3C9SFFDX5K';
const CONSENT_KEY = 'cookie-consent';

export interface ConsentState {
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
}

export type ConsentStatus = 'accepted' | 'rejected' | ConsentState;

/**
 * Read the user's saved cookie consent preference from localStorage.
 * Returns null if the user hasn't made a choice yet.
 */
export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (!value) return null;

  if (value === 'accepted') {
    return { analytics: true, functional: true, marketing: true };
  }
  if (value === 'rejected') {
    return { analytics: false, functional: false, marketing: false };
  }
  try {
    return JSON.parse(value) as ConsentState;
  } catch {
    return null;
  }
}

/**
 * Save the user's cookie consent preference to localStorage
 * and dispatch a custom event so other components can react.
 */
export function setConsent(state: ConsentState | 'accepted' | 'rejected'): void {
  if (typeof window === 'undefined') return;

  let valueToStore = '';
  if (state === 'accepted' || state === 'rejected') {
    valueToStore = state;
  } else {
    valueToStore = JSON.stringify(state);
  }

  localStorage.setItem(CONSENT_KEY, valueToStore);
  window.dispatchEvent(new CustomEvent('consent-changed', { detail: state }));
}

/**
 * Dynamically load the Google Analytics gtag.js script and initialise it.
 * This is a no-op if the script is already present in the DOM.
 */
export function loadGoogleAnalytics(): void {
  if (typeof window === 'undefined') return;

  // Prevent double-loading
  if (document.getElementById('ga-script-tag')) return;

  // 1. Create and append the gtag.js script
  const script = document.createElement('script');
  script.id = 'ga-script-tag';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // 2. Initialise the dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}
