'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ref, get, push, serverTimestamp, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import { PageLayout } from '@/components/gombapp/PageLayout';
import { CheckoutSheet } from '@/components/gombapp/CheckoutSheet';
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

  // Checkout Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const lastClickRef = useRef(0);

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

      // New schema: push individual orders to Rendelések/Ital/<uid>/orders
      const ordersRef = ref(database!, `Rendelések/Ital/${user.uid}/orders`);
      const newOrderRef = push(ordersRef, {
        email: user.email,
        items: currentOrderItems,
        prices: orderPrices,
        total: orderTotal,
        timestamp: serverTimestamp(),
      });

      const handleUndo = () => {
        remove(newOrderRef)
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
    <PageLayout
      title="Pultos"
      onBack={view === 'menu' ? undefined : () => setView('menu')}
      backHref={view === 'menu' ? `/${gombappBase}/` : undefined}
    >
      {isSaving && (
        <div className="snackbar-backdrop show full-screen-loader-backdrop">
          <div className="inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-white" />
        </div>
      )}

      <CheckoutSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        totalPrice={totalPrice}
        onSave={saveOrder}
      />
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
    </PageLayout>
  );
}
