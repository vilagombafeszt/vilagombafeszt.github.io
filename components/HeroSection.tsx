import { siteConfig } from '@/site.config';
import Countdown from '@/components/Countdown';

export default function HeroSection() {
  const now = new Date();
  const endDate = new Date(siteConfig.festivalEndDate);

  // Check if we are within 2 months after the festival
  const twoMonthsAfter = new Date(endDate);
  twoMonthsAfter.setMonth(twoMonthsAfter.getMonth() + 2);

  const isPostFestival = now > endDate && now < twoMonthsAfter;

  return (
    <section
      id="otthon"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden selection:bg-[#7c8bb1] selection:text-black"
    >
      {/* Responsive hero: Crisp 1200w mobile (101 KiB) / Original 5K desktop (936 KiB) */}
      <picture>
        <source media="(max-width: 768px)" srcSet="/page_images/IMG_1367_mobile.webp" />
        <img
          src="/page_images/IMG_1367.webp"
          alt="ViláGomba Fesztivál háttér"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />
      </picture>

      <div className="relative z-10 flex flex-col items-center gap-2 md:gap-4">
        {/* Main Title */}
        <h1 className="m-0 animate-[fadeSlideUp_1.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards] font-[family-name:var(--font-brand)] text-[clamp(32px,6vw,72px)] font-normal text-[#7c8bb1] opacity-0 [text-shadow:0_4px_40px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.8)]">
          viláGomba
        </h1>

        {/* Date / Post-Festival Subtitle */}
        {isPostFestival ? (
          <h2 className="m-0 animate-[fadeSlideUp_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.3s_forwards] px-4 text-center font-[family-name:var(--font-brand)] text-[clamp(14px,2vw,24px)] tracking-[2px] text-[#7c8bb1] opacity-0 [text-shadow:0_4px_40px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.8)]">
            Köszönjük, hogy velünk voltatok!
          </h2>
        ) : (
          <h2 className="m-0 animate-[fadeSlideUp_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.3s_forwards] text-center font-[family-name:var(--font-brand)] text-[clamp(16px,2.5vw,32px)] tracking-[2px] text-[#7c8bb1] opacity-0 [text-shadow:0_4px_40px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.8)]">
            {siteConfig.festivalDateString}
          </h2>
        )}

        {/* Countdown Timer */}
        {siteConfig.features.showCountdown && !isPostFestival && <Countdown />}
      </div>
    </section>
  );
}
