import React from 'react';

interface BartenderCartProps {
  orderItems: string[];
  groupedItems: Record<string, number>;
  getDrinkPrice: (drink: string) => number;
  totalPrice: number;
  removeOneOfType: (name: string) => void;
  addItem: (name: string) => void;
  setOrderItems: (items: string[]) => void;
  saveOrder: () => void;
  openCheckout: () => void;
}

export function BartenderCart({
  orderItems,
  groupedItems,
  getDrinkPrice,
  totalPrice,
  removeOneOfType,
  addItem,
  setOrderItems,
  saveOrder,
  openCheckout,
}: BartenderCartProps) {
  return (
    <div className="-mx-5 flex min-h-0 w-[calc(100%+40px)] flex-1 flex-col items-center overflow-hidden px-5">
      <div className="mx-auto flex min-h-0 w-full max-w-[420px] flex-1 flex-col items-center">
        <h2 className="mb-4 text-center text-[1.4em] font-bold text-gombapp-text">
          Rendelt italok
        </h2>

        {orderItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-12 text-gombapp-text/[0.45]">
            <div className="text-[1.1em] font-medium">A kosár üres</div>
          </div>
        ) : (
          <div className="flex min-h-0 w-full flex-1 flex-col gap-2.5 overflow-y-auto overflow-x-hidden p-1 [scrollbar-width:thin]">
            {Object.entries(groupedItems).map(([name, qty]) => {
              const unitPrice = getDrinkPrice(name);
              return (
                <div
                  key={name}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl bg-gombapp-text/[0.08] px-4 py-3 transition-colors duration-150 ease-in-out"
                >
                  <div className="flex w-full items-baseline gap-2">
                    <div className="break-words text-[1.05em] font-semibold text-gombapp-text">
                      {name}
                    </div>
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
                    >
                      <span className="material-symbols-rounded pointer-events-none text-[20px] leading-none">
                        add
                      </span>
                    </button>
                  </div>
                  <div className="ml-auto shrink-0 text-right text-[1em] font-bold text-gombapp-text">
                    {unitPrice * qty} Ft
                  </div>
                </div>
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
              {totalPrice.toLocaleString('hu-HU')} Ft
            </span>
          </div>

          <div className="mt-4 flex w-full gap-2">
            <button
              className="flex flex-[0.9] cursor-pointer items-center justify-center rounded-xl border-none bg-[#e01f32] px-5 py-3.5 text-center text-[1em] font-bold text-white transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => setOrderItems([])}
            >
              <span className="material-symbols-rounded">delete</span>
            </button>
            <button
              className="mt-0 flex w-full flex-[2] cursor-pointer items-center justify-center rounded-xl border-none bg-gombapp-text py-3.5 text-[1.15em] font-bold text-gombapp-bg transition-all duration-100 ease-in-out active:scale-[0.96] active:opacity-[0.85]"
              onClick={saveOrder}
            >
              Gyors mentés
            </button>
            <button
              className="mt-0 flex w-full flex-[2] cursor-pointer items-center justify-center rounded-xl border-none bg-gombapp-text py-3.5 text-[1.15em] font-bold text-gombapp-bg transition-all duration-100 ease-in-out active:scale-[0.96] active:opacity-[0.85]"
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
