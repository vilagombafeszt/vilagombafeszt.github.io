'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'hu' ? 'en' : 'hu';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className={`group relative flex h-[44px] cursor-pointer select-none items-center justify-center gap-1.5 border-none bg-transparent font-[family-name:var(--font-body)] text-[1.5rem] font-bold uppercase tracking-[3px] !text-[#102135] transition-all duration-[400ms] hover:scale-110 hover:!text-[#8b0000] active:scale-[0.96] active:opacity-70 md:h-auto md:py-0 md:text-[clamp(13px,1.4vw,22px)] md:font-semibold md:normal-case md:tracking-[1px] md:active:scale-100 ${className}`}
      aria-label="Toggle language"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 md:h-4 md:w-4"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
      <span className="min-w-[28px] text-left">{locale === 'hu' ? 'EN' : 'HU'}</span>
    </button>
  );
}
