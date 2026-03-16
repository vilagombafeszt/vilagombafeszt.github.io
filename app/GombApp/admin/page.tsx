'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get, child } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { database, firestoreDB } from '@/lib/firebase';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import Image from 'next/image';

type View = 'menu' | 'bartender' | 'foodserver' | 'summary';

interface Stats {
  totalOrders: number;
  totalOrderCount: number;
  totalRevenue: number;
  mostOrdered: string;
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
  const [view, setView] = useState<View>('menu');
  const [authorized, setAuthorized] = useState(false);
  const [bartenderStats, setBartenderStats] = useState<Stats>(EMPTY_STATS);
  const [foodserverStats, setFoodserverStats] = useState<Stats>(EMPTY_STATS);

  // Auth & admin check
  useEffect(() => {
    if (loading) return;

    if (!user) {
      showSnackbar('Nincs jogosultságod az admin oldal megtekintéséhez!', 'error');
      router.push('/GombApp/');
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
            router.push('/GombApp/');
          }
        } else {
          console.log('No admin document found');
          router.push('/GombApp/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/GombApp/');
      }
    };

    checkAdmin();
  }, [user, loading, router, showSnackbar]);

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
      const foodSnap = await get(child(dbRef, 'Rendelések/Étel'));
      if (foodSnap.exists()) {
        setFoodserverStats(computeStats(foodSnap.val()));
      }
    } catch (error) {
      console.error('Error fetching food stats:', error);
    }
  };

  const formatNumber = (n: number) => n.toLocaleString('hu-HU').replace(/,/g, ' ');

  if (loading || !authorized) return null;

  const summaryOrders = bartenderStats.totalOrders + foodserverStats.totalOrders;
  const summaryOrderCount = bartenderStats.totalOrderCount + foodserverStats.totalOrderCount;
  const summaryRevenue = bartenderStats.totalRevenue + foodserverStats.totalRevenue;

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
          <h1 className="bartender-title">Admin</h1>
        </div>
      </header>

      <main>
        {view === 'menu' && (
          <div className="menu adjust">
            <button className="button" onClick={() => setView('bartender')}>
              <Image src="/GombApp/images/stats.png" alt="Pultos statisztika" className="profile-pic" width={100} height={100} />
              Pultos statisztika
            </button>
            <button className="button" onClick={() => setView('foodserver')}>
              <Image src="/GombApp/images/stats.png" alt="Ételárus statisztika" className="profile-pic" width={100} height={100} />
              Ételárus statisztika
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

        {view === 'foodserver' && (
          <div className="foodserverstat-container">
            <h2 className="foodserverstats-title">Ételárus statisztika</h2>
            <h3 style={{ marginTop: '20px' }}>Rendelt ételek száma: {foodserverStats.totalOrders} db</h3>
            <h3 style={{ marginTop: '10px' }}>Rendelések száma: {foodserverStats.totalOrderCount} db</h3>
            <h3 style={{ marginTop: '10px' }}>Legtöbbet rendelt étel: {foodserverStats.mostOrdered}</h3>
            <h3 style={{ marginTop: '10px' }}>Teljes bevétel: {formatNumber(foodserverStats.totalRevenue)} HUF</h3>
          </div>
        )}

        {view === 'summary' && (
          <div className="statsummary-container">
            <h2 className="statsummary-title">Összes statisztika</h2>
            <h3 style={{ marginTop: '20px' }}>Rendelt ételek/italok száma: {summaryOrders} db</h3>
            <h3 style={{ marginTop: '10px' }}>Rendelések száma: {summaryOrderCount} db</h3>
            <h3 style={{ marginTop: '10px' }}>Teljes bevétel: {formatNumber(summaryRevenue)} HUF</h3>
          </div>
        )}
      </main>
    </>
  );
}
