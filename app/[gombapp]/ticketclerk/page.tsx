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
        <div className="nav-loader-container">
          <div className="loading">
            <div className="loader loader-mb" />
            <br />
            Betöltés...
          </div>
        </div>
      )}

      {isSaving && (
        <div className="snackbar-backdrop show full-screen-loader-backdrop">
          <div className="loader loader-white" />
        </div>
      )}

      {/* Checkout Bottom Sheet */}
      <BottomSheet isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)}>
        <BottomSheetHeader>Kassza / Visszajáró</BottomSheetHeader>
        <BottomSheetBody>
          <div className="checkout-content">
            <div className="checkout-total">
              Fizetendő: <span>{totalPrice.toLocaleString('hu-HU')} Ft</span>
            </div>
            <div className="checkout-quick-bills">
              <button
                type="button"
                className="checkout-bill-btn"
                onClick={() => setReceivedAmount(500)}
              >
                500 Ft
              </button>
              <button
                type="button"
                className="checkout-bill-btn"
                onClick={() => setReceivedAmount(1000)}
              >
                1 000 Ft
              </button>
              <button
                type="button"
                className="checkout-bill-btn"
                onClick={() => setReceivedAmount(2000)}
              >
                2 000 Ft
              </button>
              <button
                type="button"
                className="checkout-bill-btn"
                onClick={() => setReceivedAmount(5000)}
              >
                5 000 Ft
              </button>
              <button
                type="button"
                className="checkout-bill-btn"
                onClick={() => setReceivedAmount(10000)}
              >
                10 000 Ft
              </button>
              <button
                type="button"
                className="checkout-bill-btn"
                onClick={() => setReceivedAmount(20000)}
              >
                20 000 Ft
              </button>
              <button
                type="button"
                className="checkout-bill-btn pontos-btn"
                onClick={() => setReceivedAmount(totalPrice)}
              >
                Pontos
              </button>
            </div>

            <div className="checkout-input-group">
              <label>Kapott készpénz:</label>
              <input
                type="number"
                className="email-field"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value ? Number(e.target.value) : '')}
                placeholder="Egyedi összeg megadása..."
              />
            </div>

            {receivedAmount !== '' && (
              <div
                className={`checkout-change ${Number(receivedAmount) >= totalPrice ? 'positive' : 'negative'}`}
              >
                {Number(receivedAmount) >= totalPrice
                  ? `Visszajáró: ${(Number(receivedAmount) - totalPrice).toLocaleString('hu-HU')} Ft`
                  : `Hiányzik: ${(totalPrice - Number(receivedAmount)).toLocaleString('hu-HU')} Ft`}
              </div>
            )}
          </div>
        </BottomSheetBody>
        <BottomSheetFooter>
          <div className="loginform-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsCheckoutOpen(false)}
            >
              Mégse
            </button>
            <button type="button" className="submit-button" onClick={saveOrder}>
              Mentés
            </button>
          </div>
        </BottomSheetFooter>
      </BottomSheet>

      <header>
        <div className="header-content">
          {view === 'menu' ? (
            <button className="back-button" onClick={() => handleNavigation(`/${gombappBase}/`)}>
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
              <div className="item-grid ticket-grid">
                {TICKETS.map((ticket) => {
                  const disabled = !capacityLoading && isTicketDisabled(ticket.name);
                  return (
                    <button
                      key={ticket.name}
                      className={`item-button ${disabled ? 'item-button-disabled' : ''}`.trim()}
                      onClick={() => !disabled && addItem(ticket.name)}
                      disabled={disabled}
                    >
                      <Image
                        src={ticket.image}
                        alt={ticket.alt}
                        className="item-pic"
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
                            className={`qty-btn ${qty === 1 ? 'qty-btn-remove' : ''}`.trim()}
                            onClick={() => throttle(() => removeOneOfType(name))}
                          >
                            <span className="material-symbols-rounded qty-icon">
                              {qty === 1 ? 'delete' : 'remove'}
                            </span>
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
                  <span className="order-summary-value">
                    {totalPrice.toLocaleString('hu-HU')} Ft
                  </span>
                </div>
                <span className="order-summary-count">
                  {orderItems.length} tétel · {Object.keys(groupedItems).length} féle
                </span>
                <div className="order-actions-container">
                  <button className="order-clear-btn" onClick={() => setOrderItems([])}>
                    <span className="material-symbols-rounded">delete</span>
                  </button>
                  <button className="order-save-btn" onClick={saveOrder}>
                    Gyors mentés
                  </button>
                  <button className="order-save-btn" onClick={openCheckout}>
                    Kassza
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === 'stats' && (
            <div className="statistics-container">
              {statsLoading || capacityLoading ? (
                <div className="loading">
                  <div className="loader loader-mb" />
                  <br />
                  Statisztika betöltése...
                </div>
              ) : maxCounts ? (
                <div className="statistics-content">
                  <div className="stats-header">
                    <h2 className="stats-title">Jegy Statisztikák</h2>
                    <p className="stats-subtitle">Elérhető helyek naponta</p>
                  </div>
                  <div className="stats-rows">
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
                      <div key={label} className={`stat-row${count === 0 ? 'stat-row-full' : ''}`}>
                        <div className="stat-row-accent" />
                        <div className="stat-row-info">
                          <div className="stat-row-day">{label}</div>
                          <div
                            className={`stat-row-badge ${count === 0 ? 'stat-row-badge-full' : 'stat-row-badge-open'}`}
                          >
                            {count === 0 ? 'Megtelt' : 'Elérhető'}
                          </div>
                        </div>
                        <div className="stat-row-right">
                          <div className="stat-row-count">{count}</div>
                          <div className="stat-row-unit">szabad hely</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="statistics-content">
                  <div className="stats-header">
                    <h2 className="stats-title">Jegy Statisztikák</h2>
                  </div>
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
