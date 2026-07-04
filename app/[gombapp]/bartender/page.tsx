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

interface DrinkItem {
  name: string;
  image: string;
  alt: string;
  label: string;
}

const DRINKS: DrinkItem[] = [
  {
    name: 'Korsó Kőbányai',
    image: '/GombApp/images/korso-kobi.png',
    alt: 'Korsó Kőbányai',
    label: 'Korsó Kőbányai',
  },
  {
    name: 'Pohár Kőbányai',
    image: '/GombApp/images/pohar-kobi.png',
    alt: 'Pohár Kőbányai',
    label: 'Pohár Kőbányai',
  },
  {
    name: 'Korsó Kézműves',
    image: '/GombApp/images/kezmuves.png',
    alt: 'Korsó Kézműves',
    label: 'Korsó Kézműves',
  },
  {
    name: 'Pohár Kézműves',
    image: '/GombApp/images/kezmuves.png',
    alt: 'Pohár Kézműves',
    label: 'Pohár Kézműves',
  },
  {
    name: 'Nagyfröccs',
    image: '/GombApp/images/nagyfroccs.png',
    alt: 'Nagyfröccs',
    label: 'Nagyfröccs',
  },
  {
    name: 'Kisfröccs',
    image: '/GombApp/images/kisfroccs.png',
    alt: 'Kisfröccs',
    label: 'Kisfröccs',
  },
  {
    name: 'Hosszúlépés',
    image: '/GombApp/images/hosszulepes.png',
    alt: 'Hosszúlépés',
    label: 'Hosszúlépés',
  },
  { name: 'Háziúr', image: '/GombApp/images/haziur.png', alt: 'Háziúr', label: 'Háziúr' },
  {
    name: 'Sportfröccs',
    image: '/GombApp/images/sportfroccs.png',
    alt: 'Sportfröccs',
    label: 'Sportfröccs',
  },
  {
    name: 'Szóda 3dl',
    image: '/GombApp/images/kisszoda.png',
    alt: 'Szóda 3dl',
    label: 'Szóda 1dl',
  },
  {
    name: 'Szóda 5dl',
    image: '/GombApp/images/pohar.png',
    alt: 'Papír pohár',
    label: 'Papír pohár',
  },
  { name: 'Bor 3dl', image: '/GombApp/images/kisbor.png', alt: 'Bor 3dl', label: 'Bor 3dl' },
  { name: 'Bor 5dl', image: '/GombApp/images/nagybor.png', alt: 'Bor 5dl', label: 'Bor 5dl' },
  {
    name: 'Pálinka 2cl',
    image: '/GombApp/images/palinka.png',
    alt: 'Pálinka 2cl',
    label: 'Pálinka 2cl',
  },
  {
    name: 'Pálinka 4cl',
    image: '/GombApp/images/palinka.png',
    alt: 'Pálinka 4cl',
    label: 'Pálinka 4cl',
  },
  { name: 'Kávé', image: '/GombApp/images/kave.png', alt: 'Kávé', label: 'Presszó kávé' },
  { name: 'Tejes Kávé', image: '/GombApp/images/kave.png', alt: 'Kávé', label: 'Tejes kávé' },
  {
    name: 'Jeges tea',
    image: '/GombApp/images/jegestea.png',
    alt: 'Jeges tea',
    label: 'Limonádé 3dl',
  },
  {
    name: 'Limonádé',
    image: '/GombApp/images/jegestea.png',
    alt: 'Limonádé',
    label: 'Limonádé 5dl',
  },
];

const PRICE_MAP: Record<string, string> = {
  'Korsó Kőbányai': 'korsoKobiPrice',
  'Pohár Kőbányai': 'poharKobiPrice',
  'Korsó Kézműves': 'korsoNarancsSor',
  'Pohár Kézműves': 'poharNarancsSor',
  Nagyfröccs: 'nagyfroccsPrice',
  Kisfröccs: 'kisfroccsPrice',
  Hosszúlépés: 'hosszulepesPrice',
  Háziúr: 'haziurPrice',
  Sportfröccs: 'sportfroccsPrice',
  'Szóda 3dl': 'kisszodaPrice',
  'Szóda 5dl': 'nagyszodaPrice',
  'Bor 3dl': 'kisborPrice',
  'Bor 5dl': 'nagyborPrice',
  'Pálinka 2cl': 'kispalinkaPrice',
  'Pálinka 4cl': 'nagypalinkaPrice',
  Kávé: 'kavePrice',
  'Tejes Kávé': 'tejesKavePrice',
  'Jeges tea': 'jegesteaPrice',
  Limonádé: 'limonadePrice',
};

type View = 'menu' | 'order';

export default function BartenderPage() {
  const { user, loading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';
  const [view, setView] = useState<View>('menu');
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Checkout Modal states
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
    const savedCart = sessionStorage.getItem('bartender_cart');
    if (savedCart) {
      try {
        setOrderItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    const savedView = sessionStorage.getItem('bartender_view') as View;
    if (savedView) {
      setView(savedView);
    }
    setIsCartLoaded(true);
  }, []);

  // Save cart to sessionStorage when it changes
  useEffect(() => {
    if (isCartLoaded) {
      sessionStorage.setItem('bartender_cart', JSON.stringify(orderItems));
      sessionStorage.setItem('bartender_view', view);
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
    get(ref(database, 'Árak/Ital'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPrices(snapshot.val());
        }
      })
      .catch((error) => console.error('Error fetching prices:', error));
  }, []);

  const getDrinkPrice = useCallback(
    (drink: string): number => {
      const key = PRICE_MAP[drink];
      return key ? prices[key] || 0 : 0;
    },
    [prices]
  );

  const totalPrice = orderItems.reduce((sum, item) => sum + getDrinkPrice(item), 0);

  const addItem = (drink: string) => {
    setOrderItems((prev) => [...prev, drink]);
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

  const openCheckout = () => {
    if (orderItems.length === 0) {
      showSnackbar('Adj hozzá legalább egy italt a rendeléshez!', 'info');
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
      showSnackbar('Adj hozzá legalább egy italt a rendeléshez!', 'info');
      return;
    }
    if (!user) {
      showSnackbar('Kérlek, jelentkezz be a mentéshez.', 'info');
      return;
    }

    setIsSaving(true);

    try {
      const userOrderRef = ref(database!, 'Rendelések/Ital/' + user.uid);
      const priceSnap = await get(ref(database!, 'Árak/Ital'));
      const freshPrices = priceSnap.exists() ? priceSnap.val() : {};

      let orderTotal = 0;
      const orderPrices: number[] = [];
      orderItems.forEach((drink) => {
        const key = PRICE_MAP[drink];
        const price = key ? freshPrices[key] || 0 : 0;
        orderTotal += price;
        orderPrices.push(price);
      });

      const currentOrderItems = [...orderItems];

      await runTransaction(userOrderRef, (currentData) => {
        let existingOrders: string[] = [];
        let existingOrderPrices: number[] = [];
        let existingTotalPrice = 0;
        let existingOrderCount = 0;

        if (currentData) {
          existingOrders = currentData.orderList || [];
          existingOrderPrices = currentData.orderPrices || [];
          existingTotalPrice = currentData.totalPrice || 0;
          existingOrderCount = currentData.orderCount || 0;
        }

        return {
          email: user.email,
          orderList: existingOrders.concat(currentOrderItems),
          orderPrices: existingOrderPrices.concat(orderPrices),
          totalPrice: existingTotalPrice + orderTotal,
          orderCount: existingOrderCount + 1,
        };
      });

      const handleUndo = () => {
        runTransaction(userOrderRef, (currentData) => {
          if (!currentData) return currentData;

          const existingOrders: string[] = currentData.orderList || [];
          const existingOrderPrices: number[] = currentData.orderPrices || [];
          const existingTotalPrice = currentData.totalPrice || 0;
          const existingOrderCount = currentData.orderCount || 0;

          return {
            email: currentData.email,
            orderList: existingOrders.slice(
              0,
              Math.max(0, existingOrders.length - currentOrderItems.length)
            ),
            orderPrices: existingOrderPrices.slice(
              0,
              Math.max(0, existingOrderPrices.length - orderPrices.length)
            ),
            totalPrice: Math.max(0, existingTotalPrice - orderTotal),
            orderCount: Math.max(0, existingOrderCount - 1),
          };
        })
          .then(() => {
            setOrderItems(currentOrderItems);
            setView('order');
            showSnackbar('Mentés visszavonva!', 'info');
          })
          .catch((error) => {
            console.error('Error undoing order:', error);
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
          <h1 className="mt-[5px] text-center text-[40px]">Pultos</h1>
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-5">
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-start overflow-y-auto overflow-x-hidden px-0 py-5">
          {view === 'menu' && (
            <>
              <div className="mx-auto grid min-h-0 w-full max-w-[500px] flex-1 grid-cols-2 content-start gap-[15px] overflow-y-auto overflow-x-hidden py-[5px] pb-[100px]">
                {DRINKS.map((drink) => (
                  <button
                    key={drink.name}
                    className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
                    onClick={() => addItem(drink.name)}
                  >
                    <Image
                      src={drink.image}
                      alt={drink.alt}
                      className="mb-[15px] h-[100px] w-[100px] max-[360px]:h-[80px] max-[360px]:w-[80px]"
                      width={100}
                      height={100}
                    />
                    <span>{drink.label}</span>
                  </button>
                ))}
              </div>
              <div className="fixed-bottom">
                <button className="res-adj1" onClick={() => setView('order')}>
                  Rendelés megnézése
                </button>
                <button className="res-adj2" onClick={openCheckout}>
                  Mentés
                </button>
                <p className="res-adj3">Teljes ár: {totalPrice} Ft</p>
              </div>
            </>
          )}

          {view === 'order' && (
            <div className="mx-auto flex w-full max-w-[560px] flex-col gap-[15px]">
              <h2 className="px-1 pb-2 text-[24px] font-bold text-gombapp-text">Rendelt italok</h2>

              {orderItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-10">
                  <div className="text-[18px] font-semibold opacity-80">A kosár üres</div>
                </div>
              ) : (
                <div className="flex w-full flex-col gap-2.5">
                  {Object.entries(groupedItems).map(([name, qty]) => {
                    const unitPrice = getDrinkPrice(name);
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
        </div>
      </main>
    </>
  );
}
