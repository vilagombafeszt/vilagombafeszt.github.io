'use client';

import { useEffect, useState } from 'react';

/* ── Custom SVG Icons ───────────────────────────────────────────── */
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default function PromoToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem('seen_june26_promo');

    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsRendered(true);
        setTimeout(() => setIsVisible(true), 50);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('seen_june26_promo', 'true');
    setTimeout(() => setIsRendered(false), 500);
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-[2000] mx-auto max-w-[420px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:bottom-8 md:left-auto md:right-8 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#102135]/90 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <button
          onClick={handleClose}
          className="group absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-transparent text-[#ac9d9d] outline-none transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:text-white active:scale-95"
          aria-label="Bezárás"
        >
          <CloseIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
        </button>

        <div className="flex flex-col font-[family-name:var(--font-body)]">
          <div className="mb-2 flex items-center gap-3">
            <div className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
            </div>
            <span className="text-[15px] font-bold uppercase tracking-[3px] text-white/80">
              Hamarosan
            </span>
          </div>

          <div className="mb-2 flex flex-col gap-1.5">
            <h3 className="pr-6 font-[family-name:var(--font-brand)] text-[24px] font-normal tracking-wide text-white drop-shadow-sm sm:text-[26px]">
              ViláGomba nyárnyitó
            </h3>

            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#ac9d9d]/20 bg-[#ac9d9d]/15 px-3 py-1.5 backdrop-blur-sm">
              <CalendarIcon className="h-5 w-5 text-[#ac9d9d]" />
              <span className="font-mono text-[14px] font-bold tracking-widest text-[#ac9d9d]">
                2026. JÚN. 27.
              </span>
            </div>
          </div>

          <p className="mb-5 text-[18px] font-normal leading-[1.65] text-[#ac9d9d]/90">
            Készüljünk együtt a fesztiválra! Gyertek el a nyárnyitó bulinkra, ahol megalapozzuk az
            augusztusi hangulatot. Zene, filmvetítés, és a ViláGomba közösség vár!
          </p>

          <a
            href="https://www.facebook.com/events/27565899593098746"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#ac9d9d] px-5 py-3.5 text-[18px] font-bold tracking-wide !text-[#102135] shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] active:translate-y-0 active:scale-[0.98]"
          >
            <FacebookIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            Megnézem az eseményt!
          </a>
        </div>
      </div>
    </div>
  );
}
