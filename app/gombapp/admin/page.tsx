'use client';

import React, { useState, useEffect } from 'react';
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

function computeStats(
  data: Record<string, { orderList: string[]; orderCount: number; totalPrice: number }>
): Stats {
  let totalOrders = 0;
  let totalOrderCount = 0;
  let totalRevenue = 0;
  const itemCounts: Record<string, number> = {};

  for (const uid in data) {
    const userOrders = data[uid];
    totalOrders += userOrders.orderList.length;
    totalOrderCount += userOrders.orderCount;
    totalRevenue += userOrders.totalPrice;

    userOrders.orderList.forEach((item) => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });
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
    <div className="admin-stat-card">
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">
        {formatted}
        <span className="admin-stat-unit">{unit}</span>
      </div>
    </div>
  );
}

function StatTextCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value-text">{value}</div>
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
  const [bartenderStats, setBartenderStats] = useState<Stats>(EMPTY_STATS);
  const [ticketStats, setTicketStats] = useState<Stats>(EMPTY_STATS);
  const [ticketCapacities, setTicketCapacities] = useState<TicketCapacities>({
    friday: 0,
    saturday: 0,
    sunday: 0,
  });

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
    }
  };

  const formatNumber = (n: number) => n.toLocaleString('hu-HU').replace(/,/g, ' ');

  if (loading || !authorized) return null;

  const summaryOrders = bartenderStats.totalOrders + ticketStats.totalOrders;
  const summaryOrderCount = bartenderStats.totalOrderCount + ticketStats.totalOrderCount;
  const summaryRevenue = bartenderStats.totalRevenue + ticketStats.totalRevenue;

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
          <h1 className="bartender-title">Admin</h1>
        </div>
      </header>

      <main>
        {view === 'menu' && (
          <div className="menu adjust">
            <button className="button" onClick={() => setView('bartender')}>
              <Image
                src="/GombApp/images/stats.png"
                alt="Ital statisztika"
                className="profile-pic"
                width={100}
                height={100}
              />
              Ital statisztika
            </button>
            <button className="button" onClick={() => setView('ticket')}>
              <Image
                src="/GombApp/images/stats.png"
                alt="Jegy statisztika"
                className="profile-pic"
                width={100}
                height={100}
              />
              Jegy statisztika
            </button>
            <button className="button" onClick={() => setView('summary')}>
              <Image
                src="/GombApp/images/stats.png"
                alt="Összes statisztika"
                className="profile-pic"
                width={100}
                height={100}
              />
              Összes statisztika
            </button>
          </div>
        )}

        {view === 'bartender' && (
          <div className="bartenderstat-container">
            <div className="admin-stats">
              <div className="admin-stats-header">
                <div className="admin-stats-title">Pultos statisztika</div>
                <div className="admin-stats-subtitle">Ital rendelések összesítve</div>
              </div>

              <div className="admin-stats-grid">
                <StatCard label="Rendelt tételek" value={bartenderStats.totalOrders} unit="db" />
                <StatCard label="Rendelések" value={bartenderStats.totalOrderCount} unit="db" />
                <StatTextCard label="Legnépszerűbb ital" value={bartenderStats.mostOrdered} />
                <div className="admin-stat-card">
                  <div className="admin-stat-label">Bevétel</div>
                  <div className="admin-stat-value">
                    {formatNumber(bartenderStats.totalRevenue)}
                    <span className="admin-stat-unit">HUF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'ticket' && (
          <div className="ticketstat-container">
            <div className="admin-stats">
              <div className="admin-section">
                <div className="admin-stats-header">
                  <div className="admin-stats-title">Jegyeladás statisztika</div>
                  <div className="admin-stats-subtitle">Jegy rendelések összesítve</div>
                </div>

                <div className="admin-stats-grid">
                  <StatCard label="Eladott jegyek" value={ticketStats.totalOrders} unit="db" />
                  <StatCard label="Rendelések" value={ticketStats.totalOrderCount} unit="db" />
                  <StatTextCard label="Legnépszerűbb jegy" value={ticketStats.mostOrdered} />
                  <div className="admin-stat-card">
                    <div className="admin-stat-label">Jegybevétel</div>
                    <div className="admin-stat-value">
                      {formatNumber(ticketStats.totalRevenue)}
                      <span className="admin-stat-unit">HUF</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-section">
                <div className="admin-section-title">Szabad helyek</div>
                <div className="admin-capacity-card">
                  <div className="admin-capacity-row">
                    <div className="admin-capacity-day">Péntek</div>
                    <div className="admin-capacity-right">
                      <span
                        className={`admin-pill ${ticketCapacities.friday === 0 ? 'danger' : ''}`}
                      >
                        {ticketCapacities.friday === 0 ? 'ELFOGYOTT' : 'SZABAD'}
                      </span>
                      <span className="admin-capacity-value">
                        {formatNumber(ticketCapacities.friday)}
                        <span className="admin-stat-unit">hely</span>
                      </span>
                    </div>
                  </div>

                  <div className="admin-capacity-row">
                    <div className="admin-capacity-day">Szombat</div>
                    <div className="admin-capacity-right">
                      <span
                        className={`admin-pill ${ticketCapacities.saturday === 0 ? 'danger' : ''}`}
                      >
                        {ticketCapacities.saturday === 0 ? 'ELFOGYOTT' : 'SZABAD'}
                      </span>
                      <span className="admin-capacity-value">
                        {formatNumber(ticketCapacities.saturday)}
                        <span className="admin-stat-unit">hely</span>
                      </span>
                    </div>
                  </div>

                  <div className="admin-capacity-row">
                    <div className="admin-capacity-day">Vasárnap</div>
                    <div className="admin-capacity-right">
                      <span
                        className={`admin-pill ${ticketCapacities.sunday === 0 ? 'danger' : ''}`}
                      >
                        {ticketCapacities.sunday === 0 ? 'ELFOGYOTT' : 'SZABAD'}
                      </span>
                      <span className="admin-capacity-value">
                        {formatNumber(ticketCapacities.sunday)}
                        <span className="admin-stat-unit">hely</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'summary' && (
          <div className="statsummary-container">
            <div className="admin-stats">
              <div className="admin-stats-header">
                <div className="admin-stats-title">Összes statisztika</div>
                <div className="admin-stats-subtitle">Ital + jegy együtt</div>
              </div>

              <div className="admin-stats-grid">
                <StatCard label="Eladott tételek" value={summaryOrders} unit="db" />
                <StatCard label="Rendelések" value={summaryOrderCount} unit="db" />
                <div className="admin-stat-card full-span">
                  <div className="admin-stat-label">Teljes bevétel</div>
                  <div className="admin-stat-value">
                    {formatNumber(summaryRevenue)}
                    <span className="admin-stat-unit">HUF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
