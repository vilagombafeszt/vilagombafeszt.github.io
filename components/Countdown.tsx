'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { siteConfig } from '@/site.config';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function Countdown() {
  const t = useTranslations('countdown');
  const target = new Date(siteConfig.festivalDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => {
      const tl = getTimeLeft(target);
      setTimeLeft(tl);
      if (!tl) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted || !timeLeft) return null;

  const units = [
    { value: timeLeft.days, label: t('days') },
    { value: timeLeft.hours, label: t('hours') },
    { value: timeLeft.minutes, label: t('minutes') },
    { value: timeLeft.seconds, label: t('seconds') },
  ];

  return (
    <div className="animate-[fadeSlideUp_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.6s_forwards] opacity-0">
      <div className="flex items-start justify-center gap-[clamp(3px,1vw,8px)]">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-start gap-[clamp(3px,1vw,8px)]">
            <span className="inline-flex flex-col items-center">
              <span className="inline-block min-w-[2ch] text-center font-[family-name:var(--font-brand)] text-[clamp(18px,3vw,36px)] font-normal tabular-nums leading-none text-[#7c8bb1] [text-shadow:0_4px_40px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.8)]">
                {pad(u.value)}
              </span>
              <span className="mt-[2px] font-[family-name:var(--font-brand)] text-[clamp(7px,1vw,11px)] tracking-[2px] text-[#7c8bb1]/70 [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">
                {u.label}
              </span>
            </span>
            {i < units.length - 1 && (
              <span className="font-[family-name:var(--font-brand)] text-[clamp(18px,3vw,36px)] leading-none text-[#7c8bb1]/55 [text-shadow:0_4px_40px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.8)]">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
