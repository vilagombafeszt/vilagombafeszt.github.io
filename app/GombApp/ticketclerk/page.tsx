'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ref, set, get, runTransaction } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import Image from 'next/image';

interface TicketItem {
  name: string;
  image: string;
  alt: string;
  label: string;
}

const TICKETS: TicketItem[] = [
  { name: 'Bérlet', image: '/GombApp/images/pass.png', alt: 'Bérlet', label: 'Bérlet \n 10.000 Ft' },
  { name: 'Napijegy (péntek)', image: '/GombApp/images/ticket1.png', alt: 'Napijegy (péntek)', label: 'Napijegy (péntek) \n 4.500 Ft' },
  { name: 'Napijegy (szombat)', image: '/GombApp/images/ticket1.png', alt: 'Napijegy (szombat)', label: 'Napijegy (szombat) \n 4.500 Ft' },
  { name: 'Napijegy (vasárnap)', image: '/GombApp/images/ticket1.png', alt: 'Napijegy (vasárnap)', label: 'Napijegy (vasárnap) \n 4.500 Ft' },
];

const PRICE_MAP: Record<string, string> = {
  'Bérlet': 'passPrice',
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
  const [view, setView] = useState<View>('menu');
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [maxCounts, setMaxCounts] = useState<MaxCounts | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
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
      router.push('/GombApp/');
    }
  }, [user, loading, router, showSnackbar]);

  // Fetch prices
  useEffect(() => {
    if (!database) return;
    get(ref(database, 'Árak/Jegy'))
      .then((snapshot) => {
        if (snapshot.exists()) setPrices(snapshot.val());
      })
      .catch((error) => console.error('Error fetching prices:', error));
  }, []);

  const getTicketPrice = useCallback(
    (ticket: string): number => {
      const key = PRICE_MAP[ticket];
      return key ? (prices[key] || 0) : 0;
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
        case 'Bérlet': counts.pass++; break;
        case 'Napijegy (péntek)': counts.friday++; break;
        case 'Napijegy (szombat)': counts.saturday++; break;
        case 'Napijegy (vasárnap)': counts.sunday++; break;
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

  const saveOrder = async () => {
    if (orderItems.length === 0) {
      showSnackbar('Adj hozzá legalább egy jegytípust a rendeléshez!', 'info');
      return;
    }
    if (!user) {
      showSnackbar('Kérlek, jelentkezz be a mentéshez.', 'info');
      return;
    }

    try {
      const priceSnap = await get(ref(database!, 'Árak/Jegy'));
      const freshPrices = priceSnap.exists() ? priceSnap.val() : {};
      let orderTotal = 0;
      const orderPrices: number[] = [];

      orderItems.forEach((ticket) => {
        const key = PRICE_MAP[ticket];
        const price = key ? (freshPrices[key] || 0) : 0;
        orderTotal += price;
        orderPrices.push(price);
      });

      const userOrderRef = ref(database!, 'Rendelések/Jegy/' + user.uid);
      const snapshot = await get(userOrderRef);

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

      const ticketCounts = countTicketsByType(orderItems);

      await Promise.all([
        set(userOrderRef, {
          email: user.email,
          orderList: existingOrders.concat(orderItems),
          orderPrices: existingOrderPrices.concat(orderPrices),
          totalPrice: existingTotalPrice + orderTotal,
          orderCount: existingOrderCount + 1,
        }),
        updateMaxTicketCounts(ticketCounts),
      ]);

      showSnackbar('Sikeresen mentve!', 'success');
      setOrderItems([]);
      setView('menu');
    } catch (error) {
      console.error('Error saving order:', error);
      showSnackbar('Hiba történt az adatok mentése közben.', 'error');
    }
  };

  if (loading) return null;

  return (
    <>
      <header>
        <div className="header-content">
          {view === 'menu' ? (
            <button className="back-button" onClick={() => router.push('/GombApp/')}>
              Vissza
            </button>
          ) : (
            <button className="back-button" onClick={() => setView('menu')}>
              Vissza
            </button>
          )}
          <h1 className="ticketclerk-title">Jegyárus</h1>
        </div>
      </header>

      <main>
        <div className="order-container">
          {view === 'menu' && (
            <>
              <div className="menu">
                {TICKETS.map((ticket) => (
                  <button
                    key={ticket.name}
                    className="type-button"
                    onClick={() => addItem(ticket.name)}
                  >
                    <Image src={ticket.image} alt={ticket.alt} className="type-pic" width={100} height={100} />
                    {ticket.label.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i === 0 && <br />}
                      </React.Fragment>
                    ))}
                  </button>
                ))}
              </div>
              <div className="fixed-bottom">
                <button className="res-adj1" onClick={() => setView('order')}>
                  Kosár megnézése
                </button>
                <button className="res-adj2" onClick={saveOrder}>
                  Mentés
                </button>
                <button className="res-adj6" onClick={showStatistics}>
                  Statisztika
                </button>
              </div>
            </>
          )}

          {view === 'order' && (
            <div className="order-list">
              <h2 className="order-list-header">Rendelt jegyek</h2>

              {orderItems.length === 0 ? (
                <div className="order-empty">
                  <div className="order-empty-text">A kosár üres</div>
                </div>
              ) : (
                <div className="order-list-items">
                  {Object.entries(groupedItems).map(([name, qty]) => {
                    const unitPrice = getTicketPrice(name);
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

          {view === 'stats' && (
            <div className="statistics-container" style={{ display: 'flex' }}>
              {statsLoading ? (
                <div className="loading">Statisztika betöltése...</div>
              ) : maxCounts ? (
                <div className="statistics-content">
                  <h2>Jegy Statisztikák</h2>
                  <div
                    className="stat-item"
                    style={{ borderLeftColor: maxCounts.friday === 0 ? '#d32f2f' : '#4CAF50' }}
                  >
                    <div className="stat-day">Péntek</div>
                    <div className="stat-count">Elérhető helyek: {maxCounts.friday}</div>
                  </div>
                  <div
                    className="stat-item"
                    style={{ borderLeftColor: maxCounts.saturday === 0 ? '#d32f2f' : '#4CAF50' }}
                  >
                    <div className="stat-day">Szombat</div>
                    <div className="stat-count">Elérhető helyek: {maxCounts.saturday}</div>
                  </div>
                  <div
                    className="stat-item"
                    style={{ borderLeftColor: maxCounts.sunday === 0 ? '#d32f2f' : '#4CAF50' }}
                  >
                    <div className="stat-day">Vasárnap</div>
                    <div className="stat-count">Elérhető helyek: {maxCounts.sunday}</div>
                  </div>
                </div>
              ) : (
                <div className="statistics-content">
                  <h2>Jegy Statisztikák</h2>
                  <div className="error">Hiba történt az adatok betöltése közben.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
