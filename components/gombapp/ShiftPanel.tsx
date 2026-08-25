'use client';

import React, { useState, useEffect } from 'react';
import { listenToCurrentShift, startShift, closeShift, Shift } from '@/lib/firebase/api';
import { useSnackbar } from './Snackbar';

interface ShiftPanelProps {
  category: 'Ital' | 'Jegy';
}

export function ShiftPanel({ category }: ShiftPanelProps) {
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);

  const [startFloat, setStartFloat] = useState('');
  const [actualCash, setActualCash] = useState('');
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenToCurrentShift(
      category,
      (currentShift) => {
        setShift(currentShift);
        setLoading(false);
      },
      (error) => {
        console.error('Shift error:', error);
        setLoading(false);
        showSnackbar(`Nincs jogosultság a ${category} műszakokhoz!`, 'error');
      }
    );
    return () => unsubscribe();
  }, [category, showSnackbar]);

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    const floatAmt = parseInt(startFloat, 10);
    if (isNaN(floatAmt) || floatAmt < 0) {
      showSnackbar('Kérlek adj meg egy érvényes összeget!', 'error');
      return;
    }
    await startShift(category, floatAmt);
    setStartFloat('');
    showSnackbar('Műszak sikeresen megnyitva!', 'success');
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    const cashAmt = parseInt(actualCash, 10);
    if (isNaN(cashAmt) || cashAmt < 0) {
      showSnackbar('Kérlek adj meg egy érvényes összeget!', 'error');
      return;
    }
    await closeShift(category, cashAmt);
    setActualCash('');
    showSnackbar('Műszak sikeresen lezárva!', 'success');
  };

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg">
        <div className="h-8 w-8 animate-gombapp-spin rounded-full border-4 border-gombapp-text/20 border-t-gombapp-text" />
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="w-full rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-6 text-gombapp-text">
        <h2 className="mb-4 text-center text-3xl font-bold">{category} műszak nyitása</h2>
        <p className="mb-6 text-center text-[20px] opacity-80">
          Kérlek add meg a {category.toLowerCase()} kasszában lévő kezdő váltópénz összegét!
        </p>
        <form onSubmit={handleStartShift} className="flex flex-col gap-5">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-gombapp-card-border bg-gombapp-bg px-5 py-3 focus-within:border-gombapp-text">
            <input
              type="number"
              value={startFloat}
              onChange={(e) => setStartFloat(e.target.value)}
              className="w-full border-none bg-transparent text-3xl font-bold outline-none focus:ring-0"
              placeholder="0"
              required
              min="0"
            />
            <span className="text-2xl font-bold opacity-80">Ft</span>
          </div>
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl border-none bg-gombapp-text px-5 py-4 text-[1.2em] font-bold text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
          >
            Műszak indítása
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-6 text-gombapp-text shadow-xl">
      <h2 className="mb-6 text-center text-3xl font-bold">{category} műszak zárása</h2>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex justify-between border-b border-gombapp-row-border pb-2 text-lg">
          <span className="opacity-80">Kezdő váltópénz:</span>
          <span className="font-bold">{shift.startingFloat.toLocaleString('hu-HU')} Ft</span>
        </div>
        <div className="flex justify-between border-b border-gombapp-row-border pb-2 text-lg">
          <span className="opacity-80">Műszak bevétele:</span>
          <span className="font-bold">{shift.sales.toLocaleString('hu-HU')} Ft</span>
        </div>
        <div className="flex justify-between pt-2 text-xl font-bold text-gombapp-text">
          <span>Várható kassza:</span>
          <span>{(shift.startingFloat + shift.sales).toLocaleString('hu-HU')} Ft</span>
        </div>
      </div>

      <p className="mb-4 text-center text-[20px] opacity-80">
        Mennyi készpénz van a kasszában valójában?
      </p>

      <form onSubmit={handleCloseShift} className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-2xl border-2 border-gombapp-card-border bg-gombapp-bg px-5 py-3 focus-within:border-gombapp-text">
          <input
            type="number"
            value={actualCash}
            onChange={(e) => setActualCash(e.target.value)}
            className="w-full border-none bg-transparent text-3xl font-bold outline-none focus:ring-0"
            placeholder="0"
            required
            min="0"
          />
          <span className="text-2xl font-bold opacity-80">Ft</span>
        </div>

        {actualCash !== '' && !isNaN(parseInt(actualCash, 10)) && (
          <div
            className={`mt-1 flex items-center justify-center rounded-xl border px-4 py-3 text-[1.1em] font-bold ${
              parseInt(actualCash, 10) === shift.startingFloat + shift.sales
                ? 'border-[#81c784] bg-[#e8f5e9] text-[#2e7d32]'
                : 'border-[#e57373] bg-[#ffebee] text-[#c62828]'
            }`}
          >
            {parseInt(actualCash, 10) === shift.startingFloat + shift.sales ? (
              <span>Pontos egyezés a kasszában!</span>
            ) : (
              <span>
                Eltérés:{' '}
                {(parseInt(actualCash, 10) - (shift.startingFloat + shift.sales)).toLocaleString(
                  'hu-HU'
                )}{' '}
                Ft
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          className="mt-1 flex w-full cursor-pointer items-center justify-center rounded-2xl border-none bg-gombapp-text px-5 py-4 text-[1.2em] font-bold text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
        >
          Lezárás
        </button>
      </form>
    </div>
  );
}
