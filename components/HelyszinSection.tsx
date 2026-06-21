'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import LazyMap from './LazyMap';

/* ── Custom UI Icons ────────────────────────────────────────────── */
const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const RouteIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="6" cy="19" r="3"></circle>
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path>
    <circle cx="18" cy="5" r="3"></circle>
  </svg>
);

export default function HelyszinSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      id="helyszin"
      data-logo-theme="vaj"
      ref={sectionRef}
      className="landscape:max-h-[500px]:min-h-0 landscape:max-h-[500px]:pt-[80px] flex min-h-[100svh] w-full flex-col items-center bg-[#a44041] px-[clamp(16px,5vw,80px)] pb-[clamp(48px,6vh,80px)] pt-[clamp(32px,3vh,56px)] text-[#ac9d9d] selection:bg-[#ac9d9d] selection:text-[#a44041] md:pb-[clamp(32px,4vh,64px)]"
    >
      <h2
        className={`m-0 mb-[clamp(16px,3vh,40px)] text-center font-[family-name:var(--font-brand)] text-[clamp(30px,7vw,48px)] font-normal md:text-[clamp(28px,4.5vw,60px)] ${
          isVisible
            ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
            : 'opacity-0'
        }`}
      >
        Helyszín
      </h2>

      <div
        style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
        className={`mb-[clamp(24px,4vh,48px)] flex w-full justify-center ${
          isVisible
            ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
            : 'opacity-0'
        }`}
      >
        <div className="inline-flex max-w-[700px] items-center gap-3 rounded-full border-2 border-[#ac9d9d] bg-transparent px-6 py-3 text-center font-[family-name:var(--font-body)] text-[clamp(16px,4vw,22px)] font-bold tracking-wide text-[#ac9d9d] md:px-8 md:py-4 md:text-[clamp(16px,1.8vw,24px)]">
          <span>A Zebegényi vasútállomástól kb. 20 perc sétára található.</span>
        </div>
      </div>

      <div className="grid w-full max-w-[800px] grid-cols-1 gap-[clamp(32px,5vw,56px)] lg:max-w-[1400px] lg:grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))]">
        <div
          style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
          className={`group flex w-full flex-col ${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-[#ac9d9d] transition-all duration-300 ease-out md:aspect-[4/3] [&>div]:absolute [&>div]:inset-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0">
            <LazyMap
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2679.4895470799856!2d18.908770312394047!3d47.81072997373855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476a87000989500b%3A0x49543d653c531dd9!2zVmlsw6FHb21iYSBGZXN6dGl2w6Vs!5e0!3m2!1shu!2shu!4v1738021487749!5m2!1shu!2sh"
              title="ViláGomba Fesztivál helyszín"
            />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2.5 px-2 text-center font-[family-name:var(--font-body)] text-[clamp(20px,5vw,28px)] font-bold text-[#ac9d9d] transition-transform duration-300 md:text-[clamp(18px,2vw,28px)]">
            <MapPinIcon className="h-6 w-6" />A fesztivál helyszíne
          </div>
        </div>

        <div
          style={{ animationDelay: isVisible ? '0.35s' : '0s' }}
          className={`group flex w-full flex-col ${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-4 border-[#ac9d9d] transition-all duration-300 ease-out md:aspect-[4/3] [&>div]:absolute [&>div]:inset-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0">
            <LazyMap
              src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d5359.4764598655565!2d18.904987298618558!3d47.80590989080945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x476a87924aa91591%3A0xb50ebb215f085a1b!2zWmViZWfDqW55LCAyNjI3!3m2!1d47.8013889!2d18.9088889!4m5!1s0x476a87000989500b%3A0x49543d653c531dd9!2zWmViZWfDqW55LCBWaWzDoUdvbWJhLCBPcmdvbmEgw7p0!3m2!1d47.8107264!2d18.9113506!5e0!3m2!1shu!2shu!4v1755619256480!5m2!1shu!2shu"
              title="A helyszín a Zebegényi vasútállomástól"
            />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2.5 px-2 text-center font-[family-name:var(--font-body)] text-[clamp(20px,5vw,28px)] font-bold text-[#ac9d9d] transition-transform duration-300 md:text-[clamp(18px,2vw,28px)]">
            <RouteIcon className="h-6 w-6" />
            Útvonal a vasútállomástól
          </div>
        </div>
      </div>
    </section>
  );
}
