import React from 'react';

interface FullScreenSpinnerProps {
  text?: string;
}

export function FullScreenSpinner({ text = 'Betöltés...' }: FullScreenSpinnerProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex animate-gombapp-fade-in-fast flex-col items-center justify-center bg-gombapp-bg">
      <div className="p-10 text-center text-[18px] text-[#666]">
        <div className="mb-[15px] inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
        <br />
        {text}
      </div>
    </div>
  );
}
