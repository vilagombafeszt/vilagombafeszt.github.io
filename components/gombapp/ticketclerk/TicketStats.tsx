import React from 'react';
import { MaxCounts } from './types';
import { AnimatedNumber } from '../AnimatedNumber';

const MAX_CAPACITY_PER_DAY = 240;

interface TicketStatsProps {
  statsLoading: boolean;
  capacityLoading: boolean;
  maxCounts: MaxCounts | null;
}

interface DayCardProps {
  label: string;
  count: number;
  index: number;
}

function StatusPill({ soldOut }: { soldOut: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-bold uppercase tracking-[0.6px] min-[768px]:gap-2 min-[768px]:px-4 min-[768px]:py-1.5 min-[768px]:text-[15px] ${
        soldOut
          ? 'border-[#c62828]/30 bg-[#c62828]/20 text-[#c62828]'
          : 'border-[#1b5e20]/30 bg-[#1b5e20]/20 text-[#1b5e20]'
      }`}
    >
      <span
        className={`inline-block h-[8px] w-[8px] rounded-full min-[768px]:h-[9px] min-[768px]:w-[9px] ${
          soldOut ? 'animate-pulse bg-[#c62828]' : 'bg-[#1b5e20]'
        }`}
      />
      {soldOut ? 'Megtelt' : 'Elérhető'}
    </span>
  );
}

function CircularProgress({ count, soldOut }: { count: number; soldOut: boolean }) {
  // Use larger ring on desktop
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const size = isDesktop ? 110 : 88;
  const strokeWidth = isDesktop ? 7 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Fill based on actual capacity: count remaining out of 240
  const fillPercent = soldOut ? 100 : Math.max(2, (count / MAX_CAPACITY_PER_DAY) * 100);
  const offset = circumference - (fillPercent / 100) * circumference;

  const ringColor = soldOut ? '#c62828' : '#1b5e20';
  const trackColor = soldOut ? 'rgba(198, 40, 40, 0.12)' : 'rgba(27, 94, 32, 0.12)';

  return (
    <div className="relative flex h-[88px] w-[88px] items-center justify-center min-[768px]:h-[110px] min-[768px]:w-[110px]">
      <svg width="100%" height="100%" className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {soldOut ? (
          <span className="material-symbols-rounded text-[30px] text-[#c62828] min-[768px]:text-[38px]">
            block
          </span>
        ) : (
          <>
            <span className="text-[26px] font-extrabold leading-none tracking-[-0.5px] text-[#1b5e20] min-[768px]:text-[32px]">
              <AnimatedNumber value={count} duration={600} />
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.8px] text-[#1b5e20]/80 min-[768px]:text-[12px]">
              hely
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function DayCard({ label, count, index }: DayCardProps) {
  const soldOut = count === 0;

  return (
    <div
      className="animate-gombapp-fade-in"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'backwards',
      }}
    >
      <div
        className={`flex items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-200 max-[360px]:gap-3 max-[360px]:p-3 min-[768px]:gap-6 min-[768px]:rounded-3xl min-[768px]:p-6 ${
          soldOut
            ? 'border-[#c62828]/30 bg-[#c62828]/[0.06]'
            : 'border-gombapp-card-border bg-gombapp-card-bg'
        }`}
      >
        {/* Day info */}
        <div className="flex flex-1 flex-col gap-2 min-[768px]:gap-3">
          <span
            className={`text-[24px] font-bold leading-tight text-gombapp-text max-[360px]:text-[21px] min-[768px]:text-[30px] ${
              soldOut ? 'opacity-60' : ''
            }`}
          >
            {label}
          </span>
          <div>
            <StatusPill soldOut={soldOut} />
          </div>
        </div>

        {/* Circular progress */}
        <div className="shrink-0">
          <CircularProgress count={count} soldOut={soldOut} />
        </div>
      </div>
    </div>
  );
}

export function TicketStats({ statsLoading, capacityLoading, maxCounts }: TicketStatsProps) {
  if (statsLoading || capacityLoading) {
    return (
      <div className="flex w-full max-w-[460px] flex-col items-center gap-4 px-1 min-[768px]:max-w-[580px] min-[768px]:gap-5 min-[1024px]:max-w-[720px]">
        <div className="mb-2 w-full">
          <div className="mb-1 h-8 w-48 animate-pulse rounded-lg bg-gombapp-text/10 min-[768px]:h-10 min-[768px]:w-56" />
          <div className="h-5 w-64 animate-pulse rounded-md bg-gombapp-text/[0.06] min-[768px]:h-6 min-[768px]:w-80" />
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex w-full animate-pulse items-center gap-4 rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-4 min-[768px]:gap-6 min-[768px]:rounded-3xl min-[768px]:p-6"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="flex flex-1 flex-col gap-2 min-[768px]:gap-3">
              <div className="h-6 w-28 rounded-md bg-gombapp-text/10 min-[768px]:h-8 min-[768px]:w-36" />
              <div className="h-7 w-24 rounded-full bg-gombapp-text/[0.06] min-[768px]:h-8 min-[768px]:w-28" />
            </div>
            <div className="h-[88px] w-[88px] rounded-full bg-gombapp-text/[0.06] min-[768px]:h-[110px] min-[768px]:w-[110px]" />
          </div>
        ))}
      </div>
    );
  }

  if (!maxCounts) {
    return null;
  }

  const days = [
    { label: 'Péntek', count: maxCounts.friday },
    { label: 'Szombat', count: maxCounts.saturday },
    { label: 'Vasárnap', count: maxCounts.sunday },
  ];

  return (
    <div className="flex w-full max-w-[460px] flex-col gap-4 px-1 min-[768px]:max-w-[580px] min-[768px]:gap-5 min-[1024px]:max-w-[720px]">
      {/* Header */}
      <div
        className="flex animate-gombapp-fade-in flex-col gap-0.5 min-[768px]:gap-1"
        style={{ animationFillMode: 'backwards' }}
      >
        <h2 className="text-[clamp(26px,3.5vh,36px)] font-bold tracking-[0.2px] text-gombapp-text min-[768px]:text-[42px]">
          Statisztika
        </h2>
        <p className="text-[15px] font-medium text-gombapp-text/60 min-[768px]:text-[18px]">
          Elérhető helyek naponta (max. {MAX_CAPACITY_PER_DAY} fő/nap)
        </p>
      </div>

      {/* Day cards */}
      <div className="flex flex-col gap-3 min-[768px]:gap-4">
        {days.map((day, index) => (
          <DayCard key={day.label} label={day.label} count={day.count} index={index} />
        ))}
      </div>
    </div>
  );
}
