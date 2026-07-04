'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ref, get, child } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { database, firestoreDB } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import Image from 'next/image';

type View = 'menu' | 'bartender' | 'ticket' | 'summary';

interface Stats {
  totalOrders: number;
  totalOrderCount: number;
  totalRevenue: number;
  mostOrdered: string;
}

interface TicketCapacities {
  friday: number;
  saturday: number;
  sunday: number;
}

const EMPTY_STATS: Stats = {
  totalOrders: 0,
  totalOrderCount: 0,
  totalRevenue: 0,
  mostOrdered: 'N/A',
};

type HybridOrderData = {
  orderList?: string[];
  orderCount?: number;
  totalPrice?: number;
  orders?: Record<string, { items: string[]; total: number }>;
};

function computeStats(data: Record<string, HybridOrderData>): Stats {
  let totalOrders = 0;
  let totalOrderCount = 0;
  let totalRevenue = 0;
  const itemCounts: Record<string, number> = {};

  for (const uid in data) {
    const userObject = data[uid];

    // 1. Process legacy schema (array-based)
    if (userObject.orderList && Array.isArray(userObject.orderList)) {
      totalOrders += userObject.orderList.length;
      totalOrderCount += userObject.orderCount || 1;
      totalRevenue += userObject.totalPrice || 0;

      userObject.orderList.forEach((item: string) => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
      });
    }

    // 2. Process new schema (push-based subcollection)
    if (userObject.orders && typeof userObject.orders === 'object') {
      for (const pushId in userObject.orders) {
        const order = userObject.orders[pushId];
        if (order.items && Array.isArray(order.items)) {
          totalOrders += order.items.length;
          totalOrderCount += 1;
          totalRevenue += order.total || 0;

          order.items.forEach((item: string) => {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
          });
        }
      }
    }
  }

  const mostOrdered =
    Object.keys(itemCounts).length > 0
      ? Object.keys(itemCounts).reduce((a, b) => (itemCounts[a] > itemCounts[b] ? a : b))
      : 'N/A';

  return { totalOrders, totalOrderCount, totalRevenue, mostOrdered };
}

function StatCard({ label, value, unit }: { label: string; value: number; unit: string }) {
  const formatted = value.toLocaleString('hu-HU').replace(/,/g, ' ');

  return (
    <div className="rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5">
      <div className="text-[20px] font-semibold tracking-[0.2px] opacity-95">{label}</div>
      <div className="mt-2 break-words text-[34px] font-bold leading-none text-gombapp-text">
        {formatted}
        <span className="ml-1.5 text-[18px] font-semibold opacity-95">{unit}</span>
      </div>
    </div>
  );
}

function StatTextCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5">
      <div className="text-[20px] font-semibold tracking-[0.2px] opacity-95">{label}</div>
      <div className="mt-2 break-words text-[22px] font-bold leading-[1.2]">{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';
  const [view, setView] = useState<View>('menu');
  const [authorized, setAuthorized] = useState(false);
  const [isFetchingStats, setIsFetchingStats] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [bartenderStats, setBartenderStats] = useState<Stats>(EMPTY_STATS);
  const [ticketStats, setTicketStats] = useState<Stats>(EMPTY_STATS);
  const [ticketCapacities, setTicketCapacities] = useState<TicketCapacities>({
    friday: 0,
    saturday: 0,
    sunday: 0,
  });
  const [isViewLoaded, setIsViewLoaded] = useState(false);

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

  // Load view from sessionStorage on mount
  useEffect(() => {
    const savedView = sessionStorage.getItem('admin_view') as View;
    if (savedView) {
      setView(savedView);
    }
    setIsViewLoaded(true);
  }, []);

  // Save view to sessionStorage when it changes
  useEffect(() => {
    if (isViewLoaded) {
      sessionStorage.setItem('admin_view', view);
    }
  }, [view, isViewLoaded]);

  // Auth & admin check
  useEffect(() => {
    if (loading) return;

    if (!user) {
      showSnackbar('Nincs jogosultságod az admin oldal megtekintéséhez!', 'error');
      router.push(`/${gombappBase}/`);
      return;
    }

    // Check Firestore admin document
    const checkAdmin = async () => {
      try {
        const adminDocRef = doc(firestoreDB!, 'admins', 'admin');
        const docSnap = await getDoc(adminDocRef);
        if (docSnap.exists()) {
          const adminData = docSnap.data();
          if (adminData[user.uid] === true) {
            setAuthorized(true);
            fetchStatistics();
          } else {
            showSnackbar('Nincs jogosultságod az admin oldal megtekintéséhez!', 'error');
            router.push(`/${gombappBase}/`);
          }
        } else {
          console.log('No admin document found');
          router.push(`/${gombappBase}/`);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push(`/${gombappBase}/`);
      }
    };

    checkAdmin();
  }, [user, loading, router, showSnackbar, gombappBase]);

  const fetchStatistics = async () => {
    setIsFetchingStats(true);
    const dbRef = ref(database!);

    try {
      const drinkSnap = await get(child(dbRef, 'Rendelések/Ital'));
      if (drinkSnap.exists()) {
        setBartenderStats(computeStats(drinkSnap.val()));
      }
    } catch (error) {
      console.error('Error fetching drink stats:', error);
    }

    try {
      const ticketSnap = await get(child(dbRef, 'Rendelések/Jegy'));
      if (ticketSnap.exists()) {
        setTicketStats(computeStats(ticketSnap.val()));
      }
    } catch (error) {
      console.error('Error fetching ticket stats:', error);
    }

    try {
      const [fridaySnap, saturdaySnap, sundaySnap] = await Promise.all([
        get(child(dbRef, 'Jegyek/pentekMax')),
        get(child(dbRef, 'Jegyek/szombatMax')),
        get(child(dbRef, 'Jegyek/vasarnapMax')),
      ]);
      setTicketCapacities({
        friday: fridaySnap.exists() ? fridaySnap.val() : 0,
        saturday: saturdaySnap.exists() ? saturdaySnap.val() : 0,
        sunday: sundaySnap.exists() ? sundaySnap.val() : 0,
      });
    } catch (error) {
      console.error('Error fetching ticket capacities:', error);
    } finally {
      setIsFetchingStats(false);
    }
  };

  const formatNumber = (n: number) => n.toLocaleString('hu-HU').replace(/,/g, ' ');

  if (!authorized) return null;

  const summaryOrders = bartenderStats.totalOrders + ticketStats.totalOrders;
  const summaryOrderCount = bartenderStats.totalOrderCount + ticketStats.totalOrderCount;
  const summaryRevenue = bartenderStats.totalRevenue + ticketStats.totalRevenue;

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
          <h1 className="mt-[5px] text-center text-[40px]">Admin</h1>
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden px-5">
        {view === 'menu' && (
          <div className="menu adjust static z-auto mx-auto grid h-auto w-full max-w-[500px] grid-cols-2 gap-5 overflow-y-auto overflow-x-hidden bg-transparent p-0">
            <button
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => setView('bartender')}
            >
              <Image
                src="/GombApp/images/stats.png"
                alt="Ital statisztika"
                className="mb-2.5 h-[100px] w-[100px]"
                width={100}
                height={100}
              />
              Ital statisztika
            </button>
            <button
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => setView('ticket')}
            >
              <Image
                src="/GombApp/images/stats.png"
                alt="Jegy statisztika"
                className="mb-2.5 h-[100px] w-[100px]"
                width={100}
                height={100}
              />
              Jegy statisztika
            </button>
            <button
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-start rounded-xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
              onClick={() => setView('summary')}
            >
              <Image
                src="/GombApp/images/stats.png"
                alt="Összes statisztika"
                className="mb-2.5 h-[100px] w-[100px]"
                width={100}
                height={100}
              />
              Összes statisztika
            </button>
          </div>
        )}

        {isFetchingStats && view !== 'menu' ? (
          <div className="mt-[50px] p-10 text-center text-[18px] text-[#666]">
            <div className="mb-[15px] inline-block h-10 w-10 animate-gombapp-spin rounded-full border-r-4 border-t-4 border-r-transparent border-t-gombapp-text" />
            <br />
            Adatok betöltése...
          </div>
        ) : (
          <>
            {view === 'bartender' && (
              <div className="w-full overflow-y-auto py-4 pb-6">
                <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3.5">
                  <div className="flex flex-col gap-1 px-0.5 py-2">
                    <div className="text-[clamp(30px,3.2vh,38px)] font-bold tracking-[0.2px]">
                      Pultos statisztika
                    </div>
                    <div className="text-[22px] font-semibold opacity-90">
                      Ital rendelések összesítve
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-3 max-[360px]:grid-cols-1">
                    <StatCard
                      label="Rendelt tételek"
                      value={bartenderStats.totalOrders}
                      unit="db"
                    />
                    <StatCard label="Rendelések" value={bartenderStats.totalOrderCount} unit="db" />
                    <StatTextCard label="Legnépszerűbb ital" value={bartenderStats.mostOrdered} />
                    <div className="rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5">
                      <div className="text-[20px] font-semibold tracking-[0.2px] opacity-95">
                        Bevétel
                      </div>
                      <div className="mt-2 break-words text-[34px] font-bold leading-none text-gombapp-text">
                        {formatNumber(bartenderStats.totalRevenue)}
                        <span className="ml-1.5 text-[18px] font-semibold opacity-95">HUF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'ticket' && (
              <div className="w-full overflow-y-auto py-4 pb-6">
                <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3.5">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1 px-0.5 py-2">
                      <div className="text-[clamp(30px,3.2vh,38px)] font-bold tracking-[0.2px]">
                        Jegyeladás statisztika
                      </div>
                      <div className="text-[22px] font-semibold opacity-90">
                        Jegy rendelések összesítve
                      </div>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-3 max-[360px]:grid-cols-1">
                      <StatCard label="Eladott jegyek" value={ticketStats.totalOrders} unit="db" />
                      <StatCard label="Rendelések" value={ticketStats.totalOrderCount} unit="db" />
                      <StatTextCard label="Legnépszerűbb jegy" value={ticketStats.mostOrdered} />
                      <div className="rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5">
                        <div className="text-[20px] font-semibold tracking-[0.2px] opacity-95">
                          Jegybevétel
                        </div>
                        <div className="mt-2 break-words text-[34px] font-bold leading-none text-gombapp-text">
                          {formatNumber(ticketStats.totalRevenue)}
                          <span className="ml-1.5 text-[18px] font-semibold opacity-95">HUF</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="px-0.5 text-[24px] font-bold">Szabad helyek</div>
                    <div className="rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5">
                      <div className="flex items-center justify-between gap-3 border-t border-gombapp-row-border px-0.5 py-2.5 first:border-t-0 first:pt-0.5">
                        <div className="text-[20px] font-bold">Péntek</div>
                        <div className="inline-flex items-center gap-2.5">
                          <span
                            className={`rounded-full border px-2.5 py-1.5 text-[14px] font-bold tracking-[0.4px] ${ticketCapacities.friday === 0 ? 'border-[#c62828] bg-gombapp-pill-danger-bg text-[#c62828]' : 'border-gombapp-card-border bg-gombapp-pill-bg'}`}
                          >
                            {ticketCapacities.friday === 0 ? 'ELFOGYOTT' : 'SZABAD'}
                          </span>
                          <span className="text-[22px] font-extrabold">
                            {formatNumber(ticketCapacities.friday)}
                            <span className="ml-1.5 text-[18px] font-semibold opacity-95">
                              hely
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-gombapp-row-border px-0.5 py-2.5 first:border-t-0 first:pt-0.5">
                        <div className="text-[20px] font-bold">Szombat</div>
                        <div className="inline-flex items-center gap-2.5">
                          <span
                            className={`rounded-full border px-2.5 py-1.5 text-[14px] font-bold tracking-[0.4px] ${ticketCapacities.saturday === 0 ? 'border-[#c62828] bg-gombapp-pill-danger-bg text-[#c62828]' : 'border-gombapp-card-border bg-gombapp-pill-bg'}`}
                          >
                            {ticketCapacities.saturday === 0 ? 'ELFOGYOTT' : 'SZABAD'}
                          </span>
                          <span className="text-[22px] font-extrabold">
                            {formatNumber(ticketCapacities.saturday)}
                            <span className="ml-1.5 text-[18px] font-semibold opacity-95">
                              hely
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-gombapp-row-border px-0.5 py-2.5 first:border-t-0 first:pt-0.5">
                        <div className="text-[20px] font-bold">Vasárnap</div>
                        <div className="inline-flex items-center gap-2.5">
                          <span
                            className={`rounded-full border px-2.5 py-1.5 text-[14px] font-bold tracking-[0.4px] ${ticketCapacities.sunday === 0 ? 'border-[#c62828] bg-gombapp-pill-danger-bg text-[#c62828]' : 'border-gombapp-card-border bg-gombapp-pill-bg'}`}
                          >
                            {ticketCapacities.sunday === 0 ? 'ELFOGYOTT' : 'SZABAD'}
                          </span>
                          <span className="text-[22px] font-extrabold">
                            {formatNumber(ticketCapacities.sunday)}
                            <span className="ml-1.5 text-[18px] font-semibold opacity-95">
                              hely
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'summary' && (
              <div className="w-full overflow-y-auto py-4 pb-6">
                <div className="mx-auto flex w-full max-w-[560px] flex-col gap-3.5">
                  <div className="flex flex-col gap-1 px-0.5 py-2">
                    <div className="text-[clamp(30px,3.2vh,38px)] font-bold tracking-[0.2px]">
                      Összes statisztika
                    </div>
                    <div className="text-[22px] font-semibold opacity-90">Ital + jegy együtt</div>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-3 max-[360px]:grid-cols-1">
                    <StatCard label="Eladott tételek" value={summaryOrders} unit="db" />
                    <StatCard label="Rendelések" value={summaryOrderCount} unit="db" />
                    <div className="col-span-full rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5">
                      <div className="text-[20px] font-semibold tracking-[0.2px] opacity-95">
                        Teljes bevétel
                      </div>
                      <div className="mt-2 break-words text-[34px] font-bold leading-none text-gombapp-text">
                        {formatNumber(summaryRevenue)}
                        <span className="ml-1.5 text-[18px] font-semibold opacity-95">HUF</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
