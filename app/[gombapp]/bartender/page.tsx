'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ref, set, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import Image from 'next/image';

interface DrinkItem {
  name: string;
  image: string;
  alt: string;
  label: string;
}

const DRINKS: DrinkItem[] = [
  { name: 'Korsó Kőbányai', image: '/GombApp/images/korso-kobi.png', alt: 'Korsó Kőbányai', label: 'Korsó Kőbányai' },
  { name: 'Pohár Kőbányai', image: '/GombApp/images/pohar-kobi.png', alt: 'Pohár Kőbányai', label: 'Pohár Kőbányai' },
  { name: 'Korsó Kézműves', image: '/GombApp/images/kezmuves.png', alt: 'Korsó Kézműves', label: 'Korsó Kézműves' },
  { name: 'Pohár Kézműves', image: '/GombApp/images/kezmuves.png', alt: 'Pohár Kézműves', label: 'Pohár Kézműves' },
  { name: 'Nagyfröccs', image: '/GombApp/images/nagyfroccs.png', alt: 'Nagyfröccs', label: 'Nagyfröccs' },
  { name: 'Kisfröccs', image: '/GombApp/images/kisfroccs.png', alt: 'Kisfröccs', label: 'Kisfröccs' },
  { name: 'Hosszúlépés', image: '/GombApp/images/hosszulepes.png', alt: 'Hosszúlépés', label: 'Hosszúlépés' },
  { name: 'Háziúr', image: '/GombApp/images/haziur.png', alt: 'Háziúr', label: 'Háziúr' },
  { name: 'Sportfröccs', image: '/GombApp/images/sportfroccs.png', alt: 'Sportfröccs', label: 'Sportfröccs' },
  { name: 'Szóda 3dl', image: '/GombApp/images/kisszoda.png', alt: 'Szóda 3dl', label: 'Szóda 1dl' },
  { name: 'Szóda 5dl', image: '/GombApp/images/pohar.png', alt: 'Papír pohár', label: 'Papír pohár' },
  { name: 'Bor 3dl', image: '/GombApp/images/kisbor.png', alt: 'Bor 3dl', label: 'Bor 3dl' },
  { name: 'Bor 5dl', image: '/GombApp/images/nagybor.png', alt: 'Bor 5dl', label: 'Bor 5dl' },
  { name: 'Pálinka 2cl', image: '/GombApp/images/palinka.png', alt: 'Pálinka 2cl', label: 'Pálinka 2cl' },
  { name: 'Pálinka 4cl', image: '/GombApp/images/palinka.png', alt: 'Pálinka 4cl', label: 'Pálinka 4cl' },
  { name: 'Kávé', image: '/GombApp/images/kave.png', alt: 'Kávé', label: 'Presszó kávé' },
  { name: 'Tejes Kávé', image: '/GombApp/images/kave.png', alt: 'Kávé', label: 'Tejes kávé' },
  { name: 'Jeges tea', image: '/GombApp/images/jegestea.png', alt: 'Jeges tea', label: 'Limonádé 3dl' },
  { name: 'Limonádé', image: '/GombApp/images/jegestea.png', alt: 'Limonádé', label: 'Limonádé 5dl' },
];

const PRICE_MAP: Record<string, string> = {
  'Korsó Kőbányai': 'korsoKobiPrice',
  'Pohár Kőbányai': 'poharKobiPrice',
  'Korsó Kézműves': 'korsoNarancsSor',
  'Pohár Kézműves': 'poharNarancsSor',
  'Nagyfröccs': 'nagyfroccsPrice',
  'Kisfröccs': 'kisfroccsPrice',
  'Hosszúlépés': 'hosszulepesPrice',
  'Háziúr': 'haziurPrice',
  'Sportfröccs': 'sportfroccsPrice',
  'Szóda 3dl': 'kisszodaPrice',
  'Szóda 5dl': 'nagyszodaPrice',
  'Bor 3dl': 'kisborPrice',
  'Bor 5dl': 'nagyborPrice',
  'Pálinka 2cl': 'kispalinkaPrice',
  'Pálinka 4cl': 'nagypalinkaPrice',
  'Kávé': 'kavePrice',
  'Tejes Kávé': 'tejesKavePrice',
  'Jeges tea': 'jegesteaPrice',
  'Limonádé': 'limonadePrice',
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
  const [prices, setPrices] = useState<Record<string, number>>({});
  const lastClickRef = useRef(0);

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
      return key ? (prices[key] || 0) : 0;
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

  const saveOrder = () => {
    if (orderItems.length === 0) {
      showSnackbar('Adj hozzá legalább egy italt a rendeléshez!', 'info');
      return;
    }
    if (!user) {
      showSnackbar('Kérlek, jelentkezz be a mentéshez.', 'info');
      return;
    }

    const userOrderRef = ref(database!, 'Rendelések/Ital/' + user.uid);

    get(ref(database!, 'Árak/Ital'))
      .then((priceSnap) => {
        const freshPrices = priceSnap.exists() ? priceSnap.val() : {};
        let orderTotal = 0;
        const orderPrices: number[] = [];

        orderItems.forEach((drink) => {
          const key = PRICE_MAP[drink];
          const price = key ? (freshPrices[key] || 0) : 0;
          orderTotal += price;
          orderPrices.push(price);
        });

        return get(userOrderRef).then((snapshot) => {
          let existingOrders: string[] = [];
          let existingOrderPrices: number[] = [];
          let existingTotalPrice = 0;
          let existingOrderCount = 0;

          if (snapshot.exists()) {
            const data = snapshot.val();
            existingOrders = data.orderList || [];
            existingOrderPrices = data.orderPrices || [];
            existingTotalPrice = data.totalPrice || 0;
            existingOrderCount = data.orderCount || 0;
          }

          return set(userOrderRef, {
            email: user.email,
            orderList: existingOrders.concat(orderItems),
            orderPrices: existingOrderPrices.concat(orderPrices),
            totalPrice: existingTotalPrice + orderTotal,
            orderCount: existingOrderCount + 1,
          });
        });
      })
      .then(() => {
        showSnackbar('Sikeresen mentve!', 'success');
        setOrderItems([]);
        setView('menu');
      })
      .catch((error) => {
        console.error('Error saving order:', error);
        showSnackbar('Hiba történt az adatok mentése közben.', 'error');
      });
  };

  if (loading) return null;

  return (
    <>
      <header>
        <div className="header-content">
          {view === 'menu' ? (
            <button className="back-button" onClick={() => router.push(`/${gombappBase}/`)}>
              Vissza
            </button>
          ) : (
            <button className="back-button" onClick={() => setView('menu')}>
              Vissza
            </button>
          )}
          <h1 className="bartender-title">Pultos</h1>
        </div>
      </header>

      <main>
        <div className="order-container">
          {view === 'menu' && (
            <>
              <div className="item-grid">
                {DRINKS.map((drink) => (
                  <button
                    key={drink.name}
                    className="item-button"
                    onClick={() => addItem(drink.name)}
                  >
                    <Image src={drink.image} alt={drink.alt} className="item-pic" width={100} height={100} />
                    <span>{drink.label}</span>
                  </button>
                ))}
              </div>
              <div className="fixed-bottom">
                <button className="res-adj1" onClick={() => setView('order')}>
                  Rendelés megnézése
                </button>
                <button className="res-adj2" onClick={saveOrder}>
                  Mentés
                </button>
                <p className="res-adj3">Teljes ár: {totalPrice} Ft</p>
              </div>
            </>
          )}

          {view === 'order' && (
            <div className="order-list">
              <h2 className="order-list-header">Rendelt italok</h2>

              {orderItems.length === 0 ? (
                <div className="order-empty">
                  <div className="order-empty-text">A kosár üres</div>
                </div>
              ) : (
                <div className="order-list-items">
                  {Object.entries(groupedItems).map(([name, qty]) => {
                    const unitPrice = getDrinkPrice(name);
                    return (
                      <div key={name} className="order-card">
                        <div className="order-card-info">
                          <div className="order-card-name">{name}</div>
                          <div className="order-card-price">{unitPrice} Ft / db</div>
                        </div>
                        <div className="order-card-controls">
                          <button
                            className={`qty-btn${qty === 1 ? ' qty-btn-remove' : ''}`}
                            onClick={() => throttle(() => removeOneOfType(name))}
                          >
                            <span className="material-symbols-rounded qty-icon">{qty === 1 ? 'delete' : 'remove'}</span>
                          </button>
                          <span className="qty-count">{qty}</span>
                          <button className="qty-btn" onClick={() => throttle(() => addItem(name))}>
                            <span className="material-symbols-rounded qty-icon">add</span>
                          </button>
                        </div>
                        <div className="order-card-total">{unitPrice * qty} Ft</div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="order-summary">
                <div className="order-summary-row">
                  <span className="order-summary-label">Összesen</span>
                  <span className="order-summary-value">{totalPrice} Ft</span>
                </div>
                <span className="order-summary-count">
                  {orderItems.length} tétel · {Object.keys(groupedItems).length} féle
                </span>
                <button className="order-save-btn" onClick={saveOrder}>
                  Mentés
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
