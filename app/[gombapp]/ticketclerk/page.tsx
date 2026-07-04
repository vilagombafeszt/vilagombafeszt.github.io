'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ref, set, get, runTransaction } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import {
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
} from '@/components/gombapp/BottomSheet';
import { Undo2 } from 'lucide-react';
import Image from 'next/image';

interface TicketItem {
  name: string;
  image: string;
  alt: string;
  label: string;
}

const TICKETS: TicketItem[] = [
  {
    name: 'Bérlet',
    image: '/GombApp/images/pass.png',
    alt: 'Bérlet',
    label: 'Bérlet \n 15.000 Ft',
  },
  {
    name: 'Napijegy (péntek)',
    image: '/GombApp/images/ticket1.png',
    alt: 'Napijegy (péntek)',
    label: 'Napijegy (péntek) \n 7.500 Ft',
  },
  {
    name: 'Napijegy (szombat)',
    image: '/GombApp/images/ticket1.png',
    alt: 'Napijegy (szombat)',
    label: 'Napijegy (szombat) \n 7.500 Ft',
  },
  {
    name: 'Napijegy (vasárnap)',
    image: '/GombApp/images/ticket1.png',
    alt: 'Napijegy (vasárnap)',
    label: 'Napijegy (vasárnap) \n 7.500 Ft',
  },
];

const PRICE_MAP: Record<string, string> = {
  Bérlet: 'passPrice',
  'Napijegy (péntek)': 'fridayPrice',
  'Napijegy (szombat)': 'saturdayPrice',
  'Napijegy (vasárnap)': 'sundayPrice',
};

type View = 'menu' | 'order' | 'stats';

interface MaxCounts {
  friday: number;
  saturday: number;
  sunday: number;
}

export default function TicketClerkPage() {
  const { user, loading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';
  const [view, setView] = useState<View>('menu');
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [maxCounts, setMaxCounts] = useState<MaxCounts | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [capacityLoading, setCapacityLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [receivedAmount, setReceivedAmount] = useState<number | ''>('');

  const lastClickRef = useRef(0);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsNavigating(false);
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  const handleNavigation = (path: string) => {
    navTimerRef.current = setTimeout(() => setIsNavigating(true), 500);
    router.push(path);
  };

  // Load cart from sessionStorage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem('ticketclerk_cart');
    if (savedCart) {
      try {
        setOrderItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    const savedView = sessionStorage.getItem('ticketclerk_view') as View;
    if (savedView) {
      setView(savedView);
    }
    setIsCartLoaded(true);
  }, []);

  // Save cart to sessionStorage when it changes
  useEffect(() => {
    if (isCartLoaded) {
      sessionStorage.setItem('ticketclerk_cart', JSON.stringify(orderItems));
      sessionStorage.setItem('ticketclerk_view', view);
    }
  }, [orderItems, view, isCartLoaded]);

  const throttle = (fn: () => void) => {
    const now = Date.now();
    if (now - lastClickRef.current < 120) return;
    lastClickRef.current = now;
    fn();
  };

  // Auth check
  useEffect(() => {
    if (!loading && !user) {
      showSnackbar('Kérlek, jelentkezz be az oldal használatához!', 'info');
      router.push(`/${gombappBase}/`);
    }
  }, [user, loading, router, showSnackbar, gombappBase]);

  // Fetch prices
  useEffect(() => {
    if (!database) return;
    get(ref(database, 'Árak/Jegy'))
      .then((snapshot) => {
        if (snapshot.exists()) setPrices(snapshot.val());
      })
      .catch((error) => console.error('Error fetching prices:', error));
  }, []);

  useEffect(() => {
    if (!database) return;
    setCapacityLoading(true);
    fetchMaxTicketCounts()
      .then((counts) => setMaxCounts(counts))
      .catch((error) => {
        console.error('Error fetching capacity on mount:', error);
        setMaxCounts(null);
      })
      .finally(() => setCapacityLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTicketPrice = useCallback(
    (ticket: string): number => {
      const key = PRICE_MAP[ticket];
      return key ? prices[key] || 0 : 0;
    },
    [prices]
  );

  const totalPrice = orderItems.reduce((sum, item) => sum + getTicketPrice(item), 0);

  const addItem = (ticket: string) => {
    setOrderItems((prev) => [...prev, ticket]);
  };

  const removeItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const removeOneOfType = (name: string) => {
    setOrderItems((prev) => {
      const idx = prev.lastIndexOf(name);
      if (idx === -1) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  };

  const groupedItems = orderItems.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});

  const countTicketsByType = (orders: string[]) => {
    const counts = { friday: 0, saturday: 0, sunday: 0, pass: 0 };
    orders.forEach((ticket) => {
      switch (ticket) {
        case 'Bérlet':
          counts.pass++;
          break;
        case 'Napijegy (péntek)':
          counts.friday++;
          break;
        case 'Napijegy (szombat)':
          counts.saturday++;
          break;
        case 'Napijegy (vasárnap)':
          counts.sunday++;
          break;
      }
    });
    return counts;
  };

  const updateMaxTicketCounts = async (ticketCounts: ReturnType<typeof countTicketsByType>) => {
    const promises: Promise<unknown>[] = [];

    if (ticketCounts.friday > 0 || ticketCounts.pass > 0) {
      const fridayRef = ref(database!, 'Jegyek/pentekMax');
      promises.push(
        runTransaction(fridayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return Math.max(0, currentMax - (ticketCounts.friday + ticketCounts.pass));
        })
      );
    }

    if (ticketCounts.saturday > 0 || ticketCounts.pass > 0) {
      const saturdayRef = ref(database!, 'Jegyek/szombatMax');
      promises.push(
        runTransaction(saturdayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return Math.max(0, currentMax - (ticketCounts.saturday + ticketCounts.pass));
        })
      );
    }

    if (ticketCounts.sunday > 0 || ticketCounts.pass > 0) {
      const sundayRef = ref(database!, 'Jegyek/vasarnapMax');
      promises.push(
        runTransaction(sundayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return Math.max(0, currentMax - (ticketCounts.sunday + ticketCounts.pass));
        })
      );
    }

    return Promise.all(promises);
  };

  const revertMaxTicketCounts = async (ticketCounts: ReturnType<typeof countTicketsByType>) => {
    const promises: Promise<unknown>[] = [];

    if (ticketCounts.friday > 0 || ticketCounts.pass > 0) {
      const fridayRef = ref(database!, 'Jegyek/pentekMax');
      promises.push(
        runTransaction(fridayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return currentMax + ticketCounts.friday + ticketCounts.pass;
        })
      );
    }

    if (ticketCounts.saturday > 0 || ticketCounts.pass > 0) {
      const saturdayRef = ref(database!, 'Jegyek/szombatMax');
      promises.push(
        runTransaction(saturdayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return currentMax + ticketCounts.saturday + ticketCounts.pass;
        })
      );
    }

    if (ticketCounts.sunday > 0 || ticketCounts.pass > 0) {
      const sundayRef = ref(database!, 'Jegyek/vasarnapMax');
      promises.push(
        runTransaction(sundayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return currentMax + ticketCounts.sunday + ticketCounts.pass;
        })
      );
    }

    return Promise.all(promises);
  };

  const fetchMaxTicketCounts = async (): Promise<MaxCounts> => {
    const [fridaySnap, saturdaySnap, sundaySnap] = await Promise.all([
      get(ref(database!, 'Jegyek/pentekMax')),
      get(ref(database!, 'Jegyek/szombatMax')),
      get(ref(database!, 'Jegyek/vasarnapMax')),
    ]);
    return {
      friday: fridaySnap.exists() ? fridaySnap.val() : 0,
      saturday: saturdaySnap.exists() ? saturdaySnap.val() : 0,
      sunday: sundaySnap.exists() ? sundaySnap.val() : 0,
    };
  };

  const showStatistics = async () => {
    setView('stats');
    setStatsLoading(true);
    try {
      const counts = await fetchMaxTicketCounts();
      setMaxCounts(counts);
    } catch {
      setMaxCounts(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const isTicketDisabled = (ticketName: string): boolean => {
    if (!maxCounts) return false;
    if (ticketName === 'Bérlet') {
      return maxCounts.friday === 0 || maxCounts.saturday === 0 || maxCounts.sunday === 0;
    }
    if (ticketName === 'Napijegy (péntek)') return maxCounts.friday === 0;
    if (ticketName === 'Napijegy (szombat)') return maxCounts.saturday === 0;
    if (ticketName === 'Napijegy (vasárnap)') return maxCounts.sunday === 0;
    return false;
  };

  const openCheckout = () => {
    if (orderItems.length === 0) {
      showSnackbar('Adj hozzá legalább egy jegytípust a rendeléshez!', 'info');
      return;
    }
    if (!user) {
      showSnackbar('Kérlek, jelentkezz be a mentéshez.', 'info');
      return;
    }
    setReceivedAmount('');
    setIsCheckoutOpen(true);
  };

  const saveOrder = async () => {
    if (orderItems.length === 0) {
      showSnackbar('Adj hozzá legalább egy jegytípust a rendeléshez!', 'info');
      return;
    }
    if (!user) {
      showSnackbar('Kérlek, jelentkezz be a mentéshez.', 'info');
      return;
    }

    setIsSaving(true);

    try {
      // Re-fetch latest capacity before saving
      const freshCounts = await fetchMaxTicketCounts();
      setMaxCounts(freshCounts);

      const ticketCounts = countTicketsByType(orderItems);

      if (freshCounts.friday === 0 && (ticketCounts.friday > 0 || ticketCounts.pass > 0)) {
        showSnackbar('A pénteki napijegy elfogyott!', 'error');
        setIsCheckoutOpen(false);
        return;
      }
      if (freshCounts.saturday === 0 && (ticketCounts.saturday > 0 || ticketCounts.pass > 0)) {
        showSnackbar('A szombati napijegy elfogyott!', 'error');
        setIsCheckoutOpen(false);
        return;
      }
      if (freshCounts.sunday === 0 && (ticketCounts.sunday > 0 || ticketCounts.pass > 0)) {
        showSnackbar('A vasárnapi napijegy elfogyott!', 'error');
        setIsCheckoutOpen(false);
        return;
      }

      const priceSnap = await get(ref(database!, 'Árak/Jegy'));
      const freshPrices = priceSnap.exists() ? priceSnap.val() : {};
      let orderTotal = 0;
      const orderPrices: number[] = [];

      orderItems.forEach((ticket) => {
        const key = PRICE_MAP[ticket];
        const price = key ? freshPrices[key] || 0 : 0;
        orderTotal += price;
        orderPrices.push(price);
      });

      const userOrderRef = ref(database!, 'Rendelések/Jegy/' + user.uid);
      const snapshot = await get(userOrderRef);
      const previousData = snapshot.exists() ? snapshot.val() : null;

      let existingOrders: string[] = [];
      let existingOrderPrices: number[] = [];
      let existingTotalPrice = 0;
      let existingOrderCount = 0;

      if (previousData) {
        existingOrders = previousData.orderList || [];
        existingOrderPrices = previousData.orderPrices || [];
        existingTotalPrice = previousData.totalPrice || 0;
        existingOrderCount = previousData.orderCount || 0;
      }

      const currentOrderItems = [...orderItems];

      await Promise.all([
        set(userOrderRef, {
          email: user.email,
          orderList: existingOrders.concat(currentOrderItems),
          orderPrices: existingOrderPrices.concat(orderPrices),
          totalPrice: existingTotalPrice + orderTotal,
          orderCount: existingOrderCount + 1,
        }),
        updateMaxTicketCounts(ticketCounts),
      ]);

      const handleUndo = () => {
        Promise.all([set(userOrderRef, previousData), revertMaxTicketCounts(ticketCounts)])
          .then(() => {
            setOrderItems(currentOrderItems); // repopulate cart
            setView('order');
            showSnackbar('Mentés visszavonva!', 'info');
          })
          .catch((error) => {
            console.error('Error undoing ticket order:', error);
            showSnackbar('Hiba a visszavonás közben.', 'error');
          });
      };

      setIsCheckoutOpen(false);
      showSnackbar('Sikeresen mentve!', 'success', 10000, {
        label: <Undo2 size={24} />,
        onClick: handleUndo,
      });
      setOrderItems([]);
      setView('menu');
    } catch (error) {
      console.error('Error saving order:', error);
      showSnackbar('Hiba történt az adatok mentése közben.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-0 z-[9999] flex animate-gombapp-fade-in-fast flex-col items-center justify-center bg-gombapp-bg">
          <div className="p-10 text-center text-[18px] text-[#666]">
            <div className="mb-[15px] inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
            <br />
            Betöltés...
          </div>
        </div>
      )}

      {isSaving && (
        <div className="snackbar-backdrop show full-screen-loader-backdrop">
          <div className="inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-white" />
        </div>
      )}

      {/* Checkout Bottom Sheet */}
      <BottomSheet isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)}>
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
              onClick={() => setIsCheckoutOpen(false)}
            >
              Mégse
            </button>
            <button
              type="button"
              className="mt-5 flex cursor-pointer flex-col items-center justify-center self-end rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={saveOrder}
            >
              Mentés
            </button>
          </div>
        </BottomSheetFooter>
      </BottomSheet>

      <header className="relative z-[100] flex w-full shrink-0 flex-col items-center justify-between bg-gombapp-bg px-5 pt-[calc(10px+env(safe-area-inset-top,0px))] text-[30px]">
        <div className="flex w-full flex-row items-center justify-center">
          {view === 'menu' ? (
            <button
              className="absolute left-[10px] top-1/2 flex w-[90px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => handleNavigation(`/${gombappBase}/`)}
            >
              Vissza
            </button>
          ) : (
            <button
              className="absolute left-[10px] top-1/2 flex w-[90px] -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-xl border-none bg-gombapp-text px-5 py-2.5 text-[1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => setView('menu')}
            >
              Vissza
            </button>
          )}
          <h1 className="mt-[5px] text-center text-[40px]">Jegyárus</h1>
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-5">
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-start overflow-y-auto overflow-x-hidden px-0 py-5">
          {view === 'menu' && (
            <>
              <div className="mx-auto grid min-h-0 w-full max-w-[500px] flex-1 grid-cols-2 content-center gap-[15px] overflow-y-auto overflow-x-hidden py-[5px] pb-[100px]">
                {TICKETS.map((ticket) => {
                  const disabled = !capacityLoading && isTicketDisabled(ticket.name);
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
                <button className="res-adj1" onClick={() => setView('order')}>
                  Kosár megnézése
                </button>
                <button className="res-adj2" onClick={openCheckout}>
                  Mentés
                </button>
                <button className="res-adj6" onClick={showStatistics}>
                  Statisztika
                </button>
              </div>
            </>
          )}

          {view === 'order' && (
            <div className="mx-auto flex w-full max-w-[560px] flex-col gap-[15px]">
              <h2 className="px-1 pb-2 text-[24px] font-bold text-gombapp-text">Rendelt jegyek</h2>

              {orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-10">
                  <div className="text-[18px] font-semibold opacity-80">A kosár üres</div>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-2.5">
                  {Object.entries(groupedItems).map(([name, qty]) => {
                    const unitPrice = getTicketPrice(name);
                    return (
                      <div
                        key={name}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5 max-[399px]:flex-wrap max-[399px]:justify-center min-[400px]:grid min-[400px]:grid-cols-[1.5fr_auto_80px]"
                      >
                        <div className="flex min-w-0 flex-col gap-1 max-[399px]:mb-1 max-[399px]:w-full max-[399px]:text-center">
                          <div className="break-words text-[18px] font-bold leading-[1.2] text-gombapp-text">
                            {name}
                          </div>
                          <div className="whitespace-nowrap text-[15px] font-semibold opacity-90">
                            {unitPrice} Ft / db
                          </div>
                        </div>
                        <div className="flex items-center gap-[15px] rounded-xl border border-gombapp-card-border bg-gombapp-bg p-1">
                          <button
                            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border-none bg-gombapp-text text-gombapp-bg transition-transform active:scale-[0.92] ${qty === 1 ? 'bg-gombapp-btn-danger text-gombapp-bg' : ''}`.trim()}
                            onClick={() => throttle(() => removeOneOfType(name))}
                          >
                            <span className="material-symbols-rounded text-[22px] font-bold">
                              {qty === 1 ? 'delete' : 'remove'}
                            </span>
                          </button>
                          <span className="w-[25px] text-center text-[20px] font-bold tabular-nums">
                            {qty}
                          </span>
                          <button
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border-none bg-gombapp-text text-gombapp-bg transition-transform active:scale-[0.92]"
                            onClick={() => throttle(() => addItem(name))}
                          >
                            <span className="material-symbols-rounded text-[22px] font-bold">
                              add
                            </span>
                          </button>
                        </div>
                        <div className="whitespace-nowrap text-right text-[18px] font-extrabold max-[399px]:hidden">
                          {unitPrice * qty} Ft
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-2.5 flex flex-col gap-2.5 rounded-2xl border border-[#a3c9a5] bg-[#d4ebd5] p-5">
                <div className="flex w-full items-end justify-between border-b-2 border-gombapp-text/10 pb-2.5">
                  <span className="text-[22px] font-bold">Összesen</span>
                  <span className="whitespace-nowrap text-[32px] font-extrabold leading-none tracking-[0.5px] text-gombapp-text">
                    {totalPrice.toLocaleString('hu-HU')} Ft
                  </span>
                </div>
                <span className="text-center text-[15px] font-semibold opacity-90">
                  {orderItems.length} tétel · {Object.keys(groupedItems).length} féle
                </span>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <button
                    className="bg-gombapp-btn-danger flex h-[54px] w-[54px] min-w-[54px] cursor-pointer items-center justify-center rounded-xl border-none text-gombapp-bg transition-transform active:scale-[0.96]"
                    onClick={() => setOrderItems([])}
                  >
                    <span className="material-symbols-rounded">delete</span>
                  </button>
                  <button
                    className="h-[54px] flex-1 cursor-pointer rounded-xl border-none bg-gombapp-text text-[18px] font-bold tracking-[0.5px] text-gombapp-bg transition-transform active:scale-[0.96]"
                    onClick={saveOrder}
                  >
                    Gyors mentés
                  </button>
                  <button
                    className="h-[54px] flex-1 cursor-pointer rounded-xl border-none bg-gombapp-text text-[18px] font-bold tracking-[0.5px] text-gombapp-bg transition-transform active:scale-[0.96]"
                    onClick={openCheckout}
                  >
                    Kassza
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === 'stats' && (
            <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-start overflow-y-auto p-5">
              {statsLoading || capacityLoading ? (
                <div className="p-10 text-center text-[18px] text-[#666]">
                  <div className="mb-[15px] inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
                  <br />
                  Statisztika betöltése...
                </div>
              ) : maxCounts ? (
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
                        <div
                          className={`w-[6px] shrink-0 ${count === 0 ? 'bg-[#c62828]' : 'bg-[#2e7d32]'}`}
                        />
                        <div
                          className={`flex min-w-0 flex-1 flex-col justify-center gap-1.5 border-r border-gombapp-row-border p-3 px-[18px] ${count === 0 ? 'bg-[#fff8f8]' : 'bg-[#f8fcf8]'}`}
                        >
                          <div className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.3px] text-gombapp-text">
                            {label}
                          </div>
                          <div
                            className={`inline-flex self-start rounded-full px-2.5 py-[3px] text-[13px] font-extrabold uppercase tracking-[0.5px] ${count === 0 ? 'border border-[#ffcdd2] bg-[#ffebee] text-[#c62828]' : 'border border-[#c8e6c9] bg-[#e8f5e9] text-[#2e7d32]'}`}
                          >
                            {count === 0 ? 'Megtelt' : 'Elérhető'}
                          </div>
                        </div>
                        <div className="flex min-w-[120px] shrink-0 flex-col items-end justify-center px-[18px] py-3">
                          <div
                            className={`text-[42px] font-black leading-none tracking-[-1px] ${count === 0 ? 'text-[#c62828]' : 'text-gombapp-text'}`}
                          >
                            {count}
                          </div>
                          <div className="mt-1 text-[15px] font-bold uppercase tracking-[0.5px] opacity-80">
                            szabad hely
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex w-full max-w-[460px] flex-col gap-5">
                  <div className="flex flex-col gap-1 p-1 pt-0">
                    <h2 className="text-[clamp(28px,3.5vh,38px)] font-bold tracking-[0.2px] text-gombapp-text">
                      Jegy Statisztikák
                    </h2>
                  </div>
                  <div className="rounded-xl border border-[#ffcdd2] bg-[#ffebee] p-3 text-center text-[16px] font-semibold text-[#c62828]">
                    Hiba történt az adatok betöltése közben.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
