import React from 'react';
import { MaxCounts } from './types';
import { AnimatedNumber } from '../AnimatedNumber';

interface TicketCartProps {
  orderItems: string[];
  groupedItems: Record<string, number>;
  getTicketPrice: (ticket: string) => number;
  totalPrice: number;
  removeOneOfType: (name: string) => void;
  addItem: (name: string) => void;
  setOrderItems: (items: string[]) => void;
  capacityLoading: boolean;
  ticketCapacities: MaxCounts | null;
  saveOrder: () => void;
  openCheckout: () => void;
}

interface TicketCartItemProps {
  name: string;
  qty: number;
  unitPrice: number;
  capacityLoading: boolean;
  ticketCapacities: MaxCounts | null;
  removeOneOfType: (name: string) => void;
  addItem: (name: string) => void;
}

const TicketCartItem = React.memo(
  ({
    name,
    qty,
    unitPrice,
    capacityLoading,
    ticketCapacities,
    removeOneOfType,
    addItem,
  }: TicketCartItemProps) => {
    const isCapacityLimited =
      name.includes('Péntek') || name.includes('Szombat') || name.includes('Vasárnap');
    const isWeekendTicket = name === 'Hétvégi bérlet' || name === 'Hétvégi bérlet (Alumni)';

    let currentAvailable = Infinity;
    if (!capacityLoading && ticketCapacities) {
      if (name.includes('Péntek')) currentAvailable = ticketCapacities.friday;
      else if (name.includes('Szombat')) currentAvailable = ticketCapacities.saturday;
      else if (name.includes('Vasárnap')) currentAvailable = ticketCapacities.sunday;
      else if (isWeekendTicket) {
        currentAvailable = Math.min(
          ticketCapacities.friday,
          ticketCapacities.saturday,
          ticketCapacities.sunday
        );
      }
    }
    const isAtCapacityLimit = isCapacityLimited && !capacityLoading && currentAvailable === 0;

    return (
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl bg-gombapp-text/[0.08] px-4 py-3 transition-colors duration-150 ease-in-out">
        <div className="flex w-full items-baseline gap-2">
          <div className="break-words text-[1.05em] font-semibold text-gombapp-text">{name}</div>
          <div className="shrink-0 whitespace-nowrap text-[0.85em] text-gombapp-text/60">
            {unitPrice} Ft / db
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0">
          <button
            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-gombapp-text p-0 text-[1.2em] font-bold text-gombapp-bg transition-all duration-100 ease-in-out active:scale-90 ${qty === 1 ? 'bg-[#c62828] text-white' : ''}`.trim()}
            onClick={() => removeOneOfType(name)}
          >
            <span className="material-symbols-rounded pointer-events-none text-[20px] leading-none">
              {qty === 1 ? 'delete' : 'remove'}
            </span>
          </button>
          <span className="min-w-[36px] text-center text-[1.2em] font-bold text-gombapp-text">
            {qty}
          </span>
          <button
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-gombapp-text p-0 text-[1.2em] font-bold text-gombapp-bg transition-all duration-100 ease-in-out active:scale-90"
            onClick={() => addItem(name)}
            disabled={isAtCapacityLimit}
            style={{
              opacity: isAtCapacityLimit ? 0.5 : 1,
              cursor: isAtCapacityLimit ? 'not-allowed' : 'pointer',
            }}
          >
            <span className="material-symbols-rounded pointer-events-none text-[20px] leading-none">
              add
            </span>
          </button>
        </div>
        <div className="ml-auto shrink-0 text-right text-[1em] font-bold text-gombapp-text">
          <AnimatedNumber value={unitPrice * qty} format={(v) => v.toLocaleString('hu-HU')} /> Ft
        </div>
      </div>
    );
  }
);
TicketCartItem.displayName = 'TicketCartItem';

export function TicketCart({
  orderItems,
  groupedItems,
  getTicketPrice,
  totalPrice,
  removeOneOfType,
  addItem,
  setOrderItems,
  capacityLoading,
  ticketCapacities,
  saveOrder,
  openCheckout,
}: TicketCartProps) {
  return (
    <div className="-mx-5 flex min-h-0 w-[calc(100%+40px)] flex-1 flex-col items-center overflow-hidden px-5">
      <div className="mx-auto flex min-h-0 w-full max-w-[420px] flex-1 flex-col items-center">
        <h2 className="mb-4 text-center text-[1.4em] font-bold text-gombapp-text">
          Rendelt jegyek
        </h2>

        {orderItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-gombapp-text/[0.45]">
            <div className="text-[1.1em] font-medium">A kosár üres</div>
          </div>
        ) : (
          <div className="flex min-h-0 w-full flex-1 flex-col gap-2.5 overflow-y-auto overflow-x-hidden p-1 [scrollbar-width:thin]">
            {Object.entries(groupedItems).map(([name, qty]) => {
              const unitPrice = getTicketPrice(name);

              return (
                <TicketCartItem
                  key={name}
                  name={name}
                  qty={qty}
                  unitPrice={unitPrice}
                  capacityLoading={capacityLoading}
                  ticketCapacities={ticketCapacities}
                  removeOneOfType={removeOneOfType}
                  addItem={addItem}
                />
              );
            })}
          </div>
        )}

        <div className="mt-2 flex w-full shrink-0 flex-col gap-3.5 border-t-2 border-gombapp-text/[0.15] pb-5 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[1.1em] text-gombapp-text/60">Összesen</span>
              <span className="text-[0.9em] text-gombapp-text/[0.45]">
                {orderItems.length} tétel · {Object.keys(groupedItems).length} féle
              </span>
            </div>
            <span className="text-[1.4em] font-bold text-gombapp-text">
              <AnimatedNumber value={totalPrice} format={(v) => v.toLocaleString('hu-HU')} /> Ft
            </span>
          </div>

          <div className="mt-4 flex w-full gap-2">
            <button
              className="flex flex-[0.9] cursor-pointer items-center justify-center rounded-2xl border-none bg-[#e01f32] px-5 py-3.5 text-center text-[1em] font-bold text-white transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => setOrderItems([])}
            >
              <span className="material-symbols-rounded">delete</span>
            </button>
            <button
              className="mt-0 flex w-full flex-[2] cursor-pointer items-center justify-center rounded-2xl border-none bg-gombapp-text py-3.5 text-[1.15em] font-bold text-gombapp-bg transition-all duration-100 ease-in-out active:scale-[0.96] active:opacity-[0.85]"
              onClick={saveOrder}
            >
              Gyors mentés
            </button>
            <button
              className="mt-0 flex w-full flex-[2] cursor-pointer items-center justify-center rounded-2xl border-none bg-gombapp-text py-3.5 text-[1.15em] font-bold text-gombapp-bg transition-all duration-100 ease-in-out active:scale-[0.96] active:opacity-[0.85]"
              onClick={openCheckout}
            >
              Kassza
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
