'use client';

import React, { useState } from 'react';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from './BottomSheet';
import { AnimatedNumber } from './AnimatedNumber';

interface CheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  onSave: () => void;
}

export function CheckoutSheet({ isOpen, onClose, totalPrice, onSave }: CheckoutSheetProps) {
  const [receivedAmount, setReceivedAmount] = useState<number | ''>('');

  const handleClose = () => {
    setReceivedAmount('');
    onClose();
  };

  const isSaveDisabled = receivedAmount !== '' && Number(receivedAmount) < totalPrice;

  const handleSave = () => {
    if (isSaveDisabled) return;
    setReceivedAmount('');
    onSave();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <BottomSheetHeader>Kassza / Visszajáró</BottomSheetHeader>
      <BottomSheetBody>
        <div className="flex w-full flex-col gap-[15px] pt-2.5">
          <div className="mb-[5px] flex items-center justify-between rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-[15px] text-[24px] font-bold">
            Fizetendő:{' '}
            <span className="text-[28px] font-extrabold text-gombapp-text">
              <AnimatedNumber value={totalPrice} format={(v) => v.toLocaleString('hu-HU')} /> Ft
            </span>
          </div>
          <div className="grid w-full grid-cols-3 gap-2.5">
            <button
              type="button"
              className="cursor-pointer rounded-2xl border-2 border-gombapp-text/10 bg-gombapp-text/5 px-2.5 py-3 text-[16px] font-bold text-gombapp-text transition-colors hover:bg-gombapp-text/10 active:scale-[0.96]"
              onClick={() => setReceivedAmount((prev) => Number(prev) + 500)}
            >
              500 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-2xl border-2 border-gombapp-text/10 bg-gombapp-text/5 px-2.5 py-3 text-[16px] font-bold text-gombapp-text transition-colors hover:bg-gombapp-text/10 active:scale-[0.96]"
              onClick={() => setReceivedAmount((prev) => Number(prev) + 1000)}
            >
              1 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-2xl border-2 border-gombapp-text/10 bg-gombapp-text/5 px-2.5 py-3 text-[16px] font-bold text-gombapp-text transition-colors hover:bg-gombapp-text/10 active:scale-[0.96]"
              onClick={() => setReceivedAmount((prev) => Number(prev) + 2000)}
            >
              2 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-2xl border-2 border-gombapp-text/10 bg-gombapp-text/5 px-2.5 py-3 text-[16px] font-bold text-gombapp-text transition-colors hover:bg-gombapp-text/10 active:scale-[0.96]"
              onClick={() => setReceivedAmount((prev) => Number(prev) + 5000)}
            >
              5 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-2xl border-2 border-gombapp-text/10 bg-gombapp-text/5 px-2.5 py-3 text-[16px] font-bold text-gombapp-text transition-colors hover:bg-gombapp-text/10 active:scale-[0.96]"
              onClick={() => setReceivedAmount((prev) => Number(prev) + 10000)}
            >
              10 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-2xl border-2 border-gombapp-text/10 bg-gombapp-text/5 px-2.5 py-3 text-[16px] font-bold text-gombapp-text transition-colors hover:bg-gombapp-text/10 active:scale-[0.96]"
              onClick={() => setReceivedAmount((prev) => Number(prev) + 20000)}
            >
              20 000 Ft
            </button>
            <button
              type="button"
              className="col-span-3 cursor-pointer rounded-2xl border-none bg-gombapp-text px-2.5 py-3 text-[16px] font-bold text-gombapp-bg transition-colors active:scale-[0.96]"
              onClick={() => setReceivedAmount(totalPrice)}
            >
              Pontos
            </button>
          </div>

          <div className="mt-[5px] flex flex-col gap-2">
            <label className="pl-1 text-[16px] font-bold">Kapott készpénz:</label>
            <div className="relative w-full">
              <input
                type="number"
                className="h-10 w-full rounded-2xl border-2 border-gombapp-text/20 bg-white/90 py-2.5 pl-[15px] pr-[40px] text-[1em] text-gombapp-text outline-none transition-all duration-300 ease-in-out placeholder:text-gombapp-text/50 focus:border-gombapp-text focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,33,53,0.1)] [&:hover:not(:focus)]:border-gombapp-text/30"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="Egyedi összeg megadása..."
              />
              <button
                type="button"
                className={`absolute right-1.5 top-1/2 flex h-[28px] w-[28px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gombapp-text/10 text-gombapp-text transition-all hover:bg-gombapp-text/20 active:scale-95 ${
                  receivedAmount !== '' && Number(receivedAmount) > 0
                    ? 'opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setReceivedAmount('')}
                aria-label="Törlés"
              >
                <span className="material-symbols-rounded text-[18px]">close</span>
              </button>
            </div>
          </div>

          <div
            className={`mt-2.5 rounded-2xl border-2 p-3.5 text-center text-[24px] font-bold transition-opacity duration-300 ${
              receivedAmount !== '' ? 'opacity-100' : 'pointer-events-none opacity-0'
            } ${
              Number(receivedAmount) >= totalPrice
                ? 'border-gombapp-text/20 bg-gombapp-text/5 text-gombapp-text'
                : 'border-[#ef9a9a] bg-gombapp-pill-danger-bg text-[#c62828]'
            }`}
          >
            {Number(receivedAmount) >= totalPrice ? (
              <>
                Visszajáró:{' '}
                <AnimatedNumber
                  value={Number(receivedAmount) - totalPrice}
                  format={(v) => v.toLocaleString('hu-HU')}
                />{' '}
                Ft
              </>
            ) : (
              <>
                Hiányzik:{' '}
                <AnimatedNumber
                  value={totalPrice - Number(receivedAmount)}
                  format={(v) => v.toLocaleString('hu-HU')}
                />{' '}
                Ft
              </>
            )}
          </div>
        </div>
      </BottomSheetBody>
      <BottomSheetFooter>
        <div className="flex w-full justify-between">
          <button
            type="button"
            className="mr-auto flex cursor-pointer flex-col items-center justify-center self-end rounded-2xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={handleClose}
          >
            Mégse
          </button>
          <button
            type="button"
            className={`mt-5 flex flex-col items-center justify-center self-end rounded-2xl border-none px-5 py-2.5 text-[1em] transition-all duration-100 ease-in-out ${
              isSaveDisabled
                ? 'cursor-not-allowed bg-gombapp-text/30 text-gombapp-bg/60'
                : 'cursor-pointer bg-gombapp-text text-gombapp-bg active:scale-[0.96]'
            }`}
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            Mentés
          </button>
        </div>
      </BottomSheetFooter>
    </BottomSheet>
  );
}
