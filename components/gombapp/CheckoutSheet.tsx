'use client';

import React, { useState } from 'react';
import { BottomSheet, BottomSheetHeader, BottomSheetBody, BottomSheetFooter } from './BottomSheet';

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

  const handleSave = () => {
    setReceivedAmount('');
    onSave();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <BottomSheetHeader>Kassza / Visszajáró</BottomSheetHeader>
      <BottomSheetBody>
        <div className="flex w-full flex-col gap-[15px] pt-2.5">
          <div className="mb-[5px] flex items-center justify-between rounded-xl border border-gombapp-card-border bg-gombapp-card-bg p-[15px] text-[24px] font-bold">
            Fizetendő:{' '}
            <span className="text-[28px] font-extrabold text-[#2e7d32]">
              {totalPrice.toLocaleString('hu-HU')} Ft
            </span>
          </div>
          <div className="grid w-full grid-cols-3 gap-2.5">
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[#a5d6a7] bg-[#e8f5e9] px-2.5 py-3 text-[16px] font-bold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] active:scale-[0.96]"
              onClick={() => setReceivedAmount(500)}
            >
              500 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[#a5d6a7] bg-[#e8f5e9] px-2.5 py-3 text-[16px] font-bold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] active:scale-[0.96]"
              onClick={() => setReceivedAmount(1000)}
            >
              1 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[#a5d6a7] bg-[#e8f5e9] px-2.5 py-3 text-[16px] font-bold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] active:scale-[0.96]"
              onClick={() => setReceivedAmount(2000)}
            >
              2 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[#a5d6a7] bg-[#e8f5e9] px-2.5 py-3 text-[16px] font-bold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] active:scale-[0.96]"
              onClick={() => setReceivedAmount(5000)}
            >
              5 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[#a5d6a7] bg-[#e8f5e9] px-2.5 py-3 text-[16px] font-bold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] active:scale-[0.96]"
              onClick={() => setReceivedAmount(10000)}
            >
              10 000 Ft
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[#a5d6a7] bg-[#e8f5e9] px-2.5 py-3 text-[16px] font-bold text-[#2e7d32] transition-colors hover:bg-[#c8e6c9] active:scale-[0.96]"
              onClick={() => setReceivedAmount(20000)}
            >
              20 000 Ft
            </button>
            <button
              type="button"
              className="col-span-3 cursor-pointer rounded-xl border border-none border-[#a5d6a7] bg-[#2e7d32] bg-[#e8f5e9] px-2.5 py-3 text-[16px] font-bold text-[#2e7d32] text-white transition-colors hover:bg-[#1b5e20] active:scale-[0.96]"
              onClick={() => setReceivedAmount(totalPrice)}
            >
              Pontos
            </button>
          </div>

          <div className="mt-[5px] flex flex-col gap-2">
            <label className="pl-1 text-[16px] font-bold">Kapott készpénz:</label>
            <input
              type="number"
              className="h-10 rounded-xl border-2 border-gombapp-text/20 bg-white/90 px-[15px] py-2.5 text-[1em] text-gombapp-text outline-none transition-all duration-300 ease-in-out placeholder:text-gombapp-text/50 focus:border-gombapp-text focus:bg-white focus:shadow-[0_0_0_3px_rgba(16,33,53,0.1)] [&:hover:not(:focus)]:border-gombapp-text/30"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value ? Number(e.target.value) : '')}
              placeholder="Egyedi összeg megadása..."
            />
          </div>

          {receivedAmount !== '' && (
            <div
              className={`mt-2.5 rounded-xl border-2 p-3.5 text-center text-[24px] font-bold ${Number(receivedAmount) >= totalPrice ? 'border-[#a5d6a7] bg-[#e8f5e9] text-[#2e7d32]' : 'border-[#ef9a9a] bg-gombapp-pill-danger-bg text-[#c62828]'}`}
            >
              {Number(receivedAmount) >= totalPrice
                ? `Visszajáró: ${(Number(receivedAmount) - totalPrice).toLocaleString('hu-HU')} Ft`
                : `Hiányzik: ${(totalPrice - Number(receivedAmount)).toLocaleString('hu-HU')} Ft`}
            </div>
          )}
        </div>
      </BottomSheetBody>
      <BottomSheetFooter>
        <div className="flex w-full justify-between">
          <button
            type="button"
            className="mr-auto flex cursor-pointer flex-col items-center justify-center self-end rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={handleClose}
          >
            Mégse
          </button>
          <button
            type="button"
            className="mt-5 flex cursor-pointer flex-col items-center justify-center self-end rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
            onClick={handleSave}
          >
            Mentés
          </button>
        </div>
      </BottomSheetFooter>
    </BottomSheet>
  );
}
