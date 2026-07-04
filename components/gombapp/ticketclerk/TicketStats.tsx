import React from 'react';
import { MaxCounts } from './types';

interface TicketStatsProps {
  statsLoading: boolean;
  capacityLoading: boolean;
  maxCounts: MaxCounts | null;
}

export function TicketStats({ statsLoading, capacityLoading, maxCounts }: TicketStatsProps) {
  if (statsLoading || capacityLoading) {
    return (
      <div className="p-10 text-center text-[18px] text-[#666]">
        <div className="mb-[15px] inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
        <br />
        Statisztika betöltése...
      </div>
    );
  }

  if (!maxCounts) {
    return null;
  }

  return (
    <div className="flex w-full max-w-[460px] flex-col gap-5">
      <div className="flex flex-col gap-1 p-1 pt-0">
        <h2 className="text-[clamp(28px,3.5vh,38px)] font-bold tracking-[0.2px] text-gombapp-text">
          Jegy Statisztikák
        </h2>
        <p className="text-[20px] font-semibold opacity-90">Elérhető helyek naponta</p>
      </div>
      <div className="flex flex-col gap-3">
        {[
          { label: 'Péntek', sublabel: 'pénteki napijegy', count: maxCounts.friday },
          {
            label: 'Szombat',
            sublabel: 'szombati napijegy',
            count: maxCounts.saturday,
          },
          {
            label: 'Vasárnap',
            sublabel: 'vasárnapi napijegy',
            count: maxCounts.sunday,
          },
        ].map(({ label, sublabel, count }) => (
          <div
            key={label}
            className={`flex min-h-[112px] items-stretch overflow-hidden rounded-2xl border bg-gombapp-card-bg ${count === 0 ? 'border-[#c62828]' : 'border-gombapp-card-border'}`}
          >
            <div className={`w-[6px] shrink-0 ${count === 0 ? 'bg-[#c62828]' : 'bg-[#2e7d32]'}`} />
            <div className="flex flex-1 flex-col justify-center p-[15px] max-[360px]:p-3">
              <div className="flex flex-col gap-[2px]">
                <span className="text-[22px] font-bold leading-[1.2] text-gombapp-text max-[360px]:text-[20px]">
                  {label}
                </span>
                <span className="text-[14px] font-semibold tracking-[0.2px] opacity-70">
                  {sublabel}
                </span>
              </div>
            </div>
            <div
              className={`flex min-w-[100px] flex-col items-center justify-center p-3.5 max-[360px]:min-w-[80px] max-[360px]:p-2.5 ${count === 0 ? 'bg-gombapp-pill-danger-bg' : 'bg-[#e8f5e9]'}`}
            >
              {count === 0 ? (
                <>
                  <span className="material-symbols-rounded mb-1 text-[28px] text-[#c62828] max-[360px]:text-[24px]">
                    cancel
                  </span>
                  <span className="text-[15px] font-bold text-[#c62828] max-[360px]:text-[14px]">
                    Megtelt
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[32px] font-extrabold leading-none tracking-[-0.5px] text-[#2e7d32] max-[360px]:text-[28px]">
                    {count}
                  </span>
                  <span className="mt-1 text-[13px] font-bold uppercase tracking-[1px] text-[#2e7d32] opacity-90 max-[360px]:text-[12px]">
                    hely
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
