'use client';

import { useEffect } from 'react';

export default function GoogleAnalyticsTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track scroll depth
    let scrolled50 = false;
    let scrolled100 = false;

    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollY = window.scrollY;
      const depth = (scrollY / docHeight) * 100;

      if (depth >= 50 && !scrolled50) {
        scrolled50 = true;
        window.gtag?.('event', 'scroll_depth_50');
      }
      if (depth >= 99 && !scrolled100) {
        scrolled100 = true;
        window.gtag?.('event', 'scroll_depth_100');
      }
    };

    // Track global clicks for specific elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // FAQ Expand (<details> summary tag)
      if (target.tagName.toLowerCase() === 'summary') {
        const details = target.closest('details');
        // Only track if it's opening (currently not open)
        if (details && !details.hasAttribute('open')) {
          const faqTitle = target.textContent?.trim() || 'unknown';
          window.gtag?.('event', 'faq_expand', { faq_title: faqTitle });
        }
      }

      // Contact and ticket links
      const link = target.closest('a');
      if (link) {
        const href = link.getAttribute('href') || '';

        if (href.startsWith('tel:')) {
          window.gtag?.('event', 'contact_phone_tap');
        } else if (href.startsWith('mailto:')) {
          window.gtag?.('event', 'contact_email_tap');
        } else if (href.includes('tixa.hu')) {
          // Fallback if not tracked explicitly in the component
          window.gtag?.('event', 'ticket_cta_click', { ticket_type: 'unknown' });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null;
}
