'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { ref, get, child } from 'firebase/database';
import { database, firestoreDB } from '@/lib/firebase';
import { fetchOrderStatsByYear, EMPTY_STATS } from '@/lib/firebase/api';
import { Stats } from '@/lib/firebase/types';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import { PageLayout } from '@/components/gombapp/PageLayout';
import Image from 'next/image';

const CURRENT_YEAR = new Date().getFullYear();
const AVAILABLE_YEARS = [2024, 2025, 2026]; // Displayed chronologically in charts

type View = 'menu' | 'bartender' | 'ticket' | 'summary';

interface YearData {
  bartender: Stats;
  ticket: Stats;
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

function LineChart({
  data,
  unit,
  title,
}: {
  data: { label: string; value: number; highlighted: boolean }[];
  unit: string;
  title: string;
}) {
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingYTop = 30;
  const paddingYBottom = 30;

  const maxVal = Math.max(...data.map((d) => d.value), 0);
  const minVal = 0;
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const y =
      height -
      paddingYBottom -
      ((d.value - minVal) / range) * (height - paddingYTop - paddingYBottom);
    return { x, y, ...d };
  });

  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="rounded-2xl border border-gombapp-card-border bg-gombapp-card-bg p-3.5 pt-4">
      <div className="mb-4 text-center text-[18px] font-semibold opacity-95">{title}</div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
        <path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gombapp-text/20"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.highlighted ? 7 : 4}
              className={p.highlighted ? 'fill-gombapp-text' : 'fill-gombapp-text/20'}
            />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              className={`text-[12px] font-bold tracking-[0.5px] ${p.highlighted ? 'fill-gombapp-text' : 'fill-gombapp-text/60'}`}
            >
              {(p.value / 1000).toLocaleString('hu-HU')}E {unit}
            </text>
            <text
              x={p.x}
              y={height - 5}
              textAnchor="middle"
              className={`text-[14px] font-bold ${p.highlighted ? 'fill-gombapp-text' : 'fill-gombapp-text/60'}`}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function YearSelector({
  selectedYear,
  onYearChange,
}: {
  selectedYear: number;
  onYearChange: (year: number) => void;
}) {
  return (
    <div className="mb-4 flex gap-2">
      {AVAILABLE_YEARS.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`cursor-pointer rounded-xl border-2 px-4 py-2 text-[16px] font-bold transition-all active:scale-[0.96] ${
            selectedYear === year
              ? 'border-gombapp-text bg-gombapp-text text-gombapp-bg'
              : 'border-gombapp-text/20 bg-gombapp-text/5 text-gombapp-text hover:bg-gombapp-text/10'
          }`}
        >
          {year}
        </button>
      ))}
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
  const [isViewLoaded, setIsViewLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [yearlyData, setYearlyData] = useState<Record<number, YearData>>({});

  // Load view and year from sessionStorage on mount
  useEffect(() => {
    const savedView = sessionStorage.getItem('admin_view') as View;
    if (savedView) {
      setView(savedView);
    }
    const savedYear = sessionStorage.getItem('admin_year');
    if (savedYear && !isNaN(Number(savedYear))) {
      setSelectedYear(Number(savedYear));
    }
    setIsViewLoaded(true);
  }, []);

  // Save view and year to sessionStorage when they change
  useEffect(() => {
    if (isViewLoaded) {
      sessionStorage.setItem('admin_view', view);
      sessionStorage.setItem('admin_year', selectedYear.toString());
    }
  }, [view, selectedYear, isViewLoaded]);

  const fetchAllStatistics = useCallback(async () => {
    setIsFetchingStats(true);

    try {
      const results: Record<number, YearData> = {};

      await Promise.all(
        AVAILABLE_YEARS.map(async (year) => {
          const [bartender, ticket] = await Promise.all([
            fetchOrderStatsByYear('Ital', year),
            fetchOrderStatsByYear('Jegy', year),
          ]);
          results[year] = { bartender, ticket };
        })
      );

      setYearlyData(results);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setIsFetchingStats(false);
    }
  }, []);

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
            fetchAllStatistics();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router, showSnackbar, gombappBase, fetchAllStatistics]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const formatNumber = (n: number) => n.toLocaleString('hu-HU').replace(/,/g, ' ');

  if (!authorized) return null;

  const currentData = yearlyData[selectedYear] || { bartender: EMPTY_STATS, ticket: EMPTY_STATS };
  const bartenderStats = currentData.bartender;
  const ticketStats = currentData.ticket;

  const summaryOrders = bartenderStats.totalOrders + ticketStats.totalOrders;
  const summaryOrderCount = bartenderStats.totalOrderCount + ticketStats.totalOrderCount;
  const summaryRevenue = bartenderStats.totalRevenue + ticketStats.totalRevenue;

  // Chart data helpers
  const getChartData = (type: 'bartender' | 'ticket' | 'summary') => {
    return AVAILABLE_YEARS.map((year) => {
      const data = yearlyData[year] || { bartender: EMPTY_STATS, ticket: EMPTY_STATS };
      let value = 0;
      if (type === 'bartender') value = data.bartender.totalRevenue;
      if (type === 'ticket') value = data.ticket.totalRevenue;
      if (type === 'summary') value = data.bartender.totalRevenue + data.ticket.totalRevenue;
      return {
        label: year.toString(),
        value,
        highlighted: year === selectedYear,
      };
    });
  };

  return (
    <PageLayout
      title="Admin"
      onBack={view === 'menu' ? undefined : () => setView('menu')}
      backHref={view === 'menu' ? `/${gombappBase}/` : undefined}
    >
      {view === 'menu' && (
        <div className="menu adjust static z-auto mx-auto grid h-auto w-full max-w-[500px] grid-cols-2 gap-5 overflow-y-auto overflow-x-hidden bg-transparent p-0">
          <button
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
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
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
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
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-none bg-gombapp-text px-2.5 py-[15px] text-[1.1em] text-gombapp-bg transition-transform duration-100 ease-in-out active:scale-[0.96]"
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

                <YearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />

                <div className="grid w-full grid-cols-2 gap-3 max-[360px]:grid-cols-1">
                  <StatCard label="Rendelt tételek" value={bartenderStats.totalOrders} unit="db" />
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

                <LineChart
                  data={getChartData('bartender')}
                  unit="Ft"
                  title="Ital bevétel alakulása"
                />
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

                  <YearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />

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

                <LineChart data={getChartData('ticket')} unit="Ft" title="Jegybevétel alakulása" />
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

                <YearSelector selectedYear={selectedYear} onYearChange={handleYearChange} />

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

                <LineChart
                  data={getChartData('summary')}
                  unit="Ft"
                  title="Teljes bevétel alakulása"
                />
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
