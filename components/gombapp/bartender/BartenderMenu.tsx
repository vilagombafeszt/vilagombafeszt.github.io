import React from 'react';
import Image from 'next/image';
import { DRINKS } from './constants';
import { View } from './types';

interface BartenderMenuProps {
  isLoading: boolean;
  addItem: (ticket: string) => void;
  setView: (view: View) => void;
  openCheckout: () => void;
  totalPrice: number;
}

export function BartenderMenu({
  isLoading,
  addItem,
  setView,
  openCheckout,
  totalPrice,
}: BartenderMenuProps) {
  return (
    <>
      <div className="mx-auto grid min-h-0 w-full max-w-[500px] flex-1 grid-cols-2 content-start gap-[15px] overflow-y-auto overflow-x-hidden py-[5px] pb-[100px]">
        {isLoading
          ? Array.from({ length: DRINKS.length }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex aspect-square w-full animate-pulse flex-col items-center justify-start rounded-2xl border-none bg-gombapp-text/30 px-2.5 py-[15px]"
              >
                <div className="mb-[15px] h-[100px] w-[100px] rounded-2xl bg-gombapp-bg/40 max-[360px]:h-[80px] max-[360px]:w-[80px]" />
                <div className="mt-2 h-4 w-3/4 rounded-md bg-gombapp-bg/40" />
              </div>
            ))
          : DRINKS.map((drink) => (
              <button
                key={drink.name}
                className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
                onClick={() => addItem(drink.name)}
              >
                <Image
                  src={drink.image}
                  alt={drink.alt}
                  className="mb-[15px] h-[100px] w-[100px] max-[360px]:h-[80px] max-[360px]:w-[80px]"
                  width={100}
                  height={100}
                  priority={true}
                />
                <span>{drink.label}</span>
              </button>
            ))}
      </div>
      <div className="fixed-bottom">
        <button
          className="res-adj1 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
          onClick={() => setView('order')}
        >
          Rendelés megnézése
        </button>
        <button
          className="res-adj2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
          onClick={openCheckout}
        >
          Mentés
        </button>
        <p className="res-adj3 font-bold text-gombapp-text">Teljes ár: {totalPrice} Ft</p>
      </div>
    </>
  );
}
