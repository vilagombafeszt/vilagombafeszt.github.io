'use client';

import { useTranslations } from 'next-intl';
import ScrollRevealWrapper from './ScrollRevealWrapper';

export default function EzUgyVoltSection() {
  const t = useTranslations('ezUgyVolt');

  return (
    <ScrollRevealWrapper
      id="ez-ugy-volt"
      dataLogoTheme="vaj"
      className="landscape:max-h-[500px]:min-h-0 landscape:max-h-[500px]:pt-[80px] flex min-h-[100svh] w-full flex-col items-center bg-[#474738] px-[clamp(16px,5vw,80px)] pb-[clamp(24px,3vh,48px)] pt-[clamp(32px,3vh,56px)] text-center text-[#ac9d9d] selection:bg-[#ac9d9d] selection:text-[#474738]"
    >
      {/* Title Reveal */}
      <h2 className="m-0 mb-[clamp(16px,3vh,40px)] text-center font-[family-name:var(--font-brand)] text-[clamp(30px,7vw,48px)] font-normal opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:text-[clamp(28px,4.5vw,60px)]">
        {t('title')}
      </h2>

      {/* Staggered Text Blocks */}
      <div className="flex w-full max-w-[1060px] flex-col items-center gap-4 font-[family-name:var(--font-body)] text-[clamp(18px,4.5vw,24px)] font-semibold leading-[1.7] tracking-wide md:gap-8 md:text-[clamp(16px,1.8vw,28px)]">
        <p
          style={{ animationDelay: '0.1s' }}
          className="opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
        >
          {t('greeting')}
          <br />
          <br />
          {t('paragraph1')}
        </p>

        <p
          style={{ animationDelay: '0.2s' }}
          className="opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
        >
          {t('paragraph2')}
        </p>

        <p
          style={{ animationDelay: '0.3s' }}
          className="opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
        >
          {t('paragraph3')}
        </p>

        <p
          style={{ animationDelay: '0.4s' }}
          className="opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
        >
          {t('closing')}
          <br />
          <br />
          <span className="opacity-90">{t('team')}</span>
        </p>
      </div>
    </ScrollRevealWrapper>
  );
}
