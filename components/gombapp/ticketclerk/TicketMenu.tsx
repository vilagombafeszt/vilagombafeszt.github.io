import React from 'react';
import Image from 'next/image';
import { TICKETS } from './constants';
import { isTicketDisabled } from './utils';
import { View, MaxCounts } from './types';

interface TicketMenuProps {
  capacityLoading: boolean;
  maxCounts: MaxCounts | null;
  addItem: (ticket: string) => void;
  setView: (view: View) => void;
  openCheckout: () => void;
  showStatistics: () => void;
}

export function TicketMenu({
  capacityLoading,
  maxCounts,
  addItem,
  setView,
  openCheckout,
  showStatistics,
}: TicketMenuProps) {
  return (
    <>
      <div className="mx-auto grid min-h-0 w-full max-w-[500px] flex-1 grid-cols-2 content-center gap-[15px] overflow-y-auto overflow-x-hidden py-[5px] pb-[100px]">
        {TICKETS.map((ticket) => {
          const disabled = !capacityLoading && isTicketDisabled(ticket.name, maxCounts);
          return (
            <button
              key={ticket.name}
              className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96] ${disabled ? '!active:scale-100 cursor-not-allowed bg-gombapp-btn-disabled opacity-[0.45]' : ''}`.trim()}
              onClick={() => !disabled && addItem(ticket.name)}
              disabled={disabled}
            >
              <Image
                src={ticket.image}
                alt={ticket.alt}
                className="mb-[15px] h-[100px] w-[100px] max-[360px]:h-[80px] max-[360px]:w-[80px]"
                width={100}
                height={100}
              />
              <span>
                {disabled ? (
                  <>
                    Megtelt
                    <br />
                    Nem választható
                  </>
                ) : (
                  ticket.label.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i === 0 && <br />}
                    </React.Fragment>
                  ))
                )}
              </span>
            </button>
          );
        })}
      </div>
      <div className="fixed-bottom">
        <button
          className="res-adj1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
          onClick={() => setView('order')}
        >
          Kosár megnézése
        </button>
        <button
          className="res-adj2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
          onClick={openCheckout}
        >
          Mentés
        </button>
        <button
          className="res-adj6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
          onClick={showStatistics}
        >
          Statisztika
        </button>
      </div>
    </>
  );
}
