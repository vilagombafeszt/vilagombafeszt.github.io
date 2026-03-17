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

function computeStats(data: Record<string, { orderList: string[]; orderCount: number; totalPrice: number }>): Stats {
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
  const [ticketCapacities, setTicketCapacities] = useState<TicketCapacities>({ friday: 0, saturday: 0, sunday: 0 });

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
              <Image src="/GombApp/images/stats.png" alt="Ital statisztika" className="profile-pic" width={100} height={100} />
              Ital statisztika
            </button>
            <button className="button" onClick={() => setView('ticket')}>
              <Image src="/GombApp/images/stats.png" alt="Jegy statisztika" className="profile-pic" width={100} height={100} />
              Jegy statisztika
            </button>
            <button className="button" onClick={() => setView('summary')}>
              <Image src="/GombApp/images/stats.png" alt="Összes statisztika" className="profile-pic" width={100} height={100} />
              Összes statisztika
            </button>
          </div>
        )}

        {view === 'bartender' && (
          <div className="bartenderstat-container">
            <h2 className="bartenderstats-title">Pultos statisztika</h2>
            <h3 style={{ marginTop: '20px' }}>Rendelt italok száma: {bartenderStats.totalOrders} db</h3>
            <h3 style={{ marginTop: '10px' }}>Rendelések száma: {bartenderStats.totalOrderCount} db</h3>
            <h3 style={{ marginTop: '10px' }}>Legtöbbet rendelt ital: {bartenderStats.mostOrdered}</h3>
            <h3 style={{ marginTop: '10px' }}>Teljes bevétel: {formatNumber(bartenderStats.totalRevenue)} HUF</h3>
          </div>
        )}

        {view === 'ticket' && (
          <div className="ticketstat-container">
            <h2 className="ticketstats-title">Jegyeladás statisztika</h2>
            <h3 style={{ marginTop: '20px' }}>Eladott jegyek száma: {ticketStats.totalOrders} db</h3>
            <h3 style={{ marginTop: '10px' }}>Rendelések száma: {ticketStats.totalOrderCount} db</h3>
            <h3 style={{ marginTop: '10px' }}>Legtöbbet eladott jegy: {ticketStats.mostOrdered}</h3>
            <h3 style={{ marginTop: '10px', marginBottom: '20px' }}>Teljes jegybevétel: {formatNumber(ticketStats.totalRevenue)} HUF</h3>

            <h2 style={{ marginTop: '40px' }} className="ticketstats-title">Szabad helyek száma</h2>
            <h3 style={{ marginTop: '20px', color: ticketCapacities.friday === 0 ? '#d32f2f' : 'inherit' }}>Péntek: {ticketCapacities.friday} hely</h3>
            <h3 style={{ marginTop: '10px', color: ticketCapacities.saturday === 0 ? '#d32f2f' : 'inherit' }}>Szombat: {ticketCapacities.saturday} hely</h3>
            <h3 style={{ marginTop: '10px', color: ticketCapacities.sunday === 0 ? '#d32f2f' : 'inherit' }}>Vasárnap: {ticketCapacities.sunday} hely</h3>
          </div>
        )}

        {view === 'summary' && (
          <div className="statsummary-container">
            <h2 className="statsummary-title">Összes statisztika</h2>
            <h3 style={{ marginTop: '20px' }}>Eladott jegyek/italok száma: {summaryOrders} db</h3>
            <h3 style={{ marginTop: '10px' }}>Rendelések száma: {summaryOrderCount} db</h3>
            <h3 style={{ marginTop: '10px' }}>Teljes bevétel: {formatNumber(summaryRevenue)} HUF</h3>
          </div>
        )}
      </main>
    </>
  );
}
