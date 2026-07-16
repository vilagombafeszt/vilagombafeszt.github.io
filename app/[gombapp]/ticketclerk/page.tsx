'use client';

import React, { useState, useEffect, useCallback, useMemo, startTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { saveOrder as apiSaveOrder, undoOrder as apiUndoOrder } from '@/lib/firebase/api';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import { PageLayout } from '@/components/gombapp/PageLayout';
import { CheckoutSheet } from '@/components/gombapp/CheckoutSheet';
import { Undo2 } from 'lucide-react';
import { usePrices } from '@/hooks/usePrices';
import { useTicketCapacity } from '@/hooks/useTicketCapacity';
import { View } from '@/components/gombapp/ticketclerk/types';
import { countTicketsByType } from '@/components/gombapp/ticketclerk/utils';
import { PRICE_MAP } from '@/components/gombapp/ticketclerk/constants';
import { TicketMenu } from '@/components/gombapp/ticketclerk/TicketMenu';
import { TicketCart } from '@/components/gombapp/ticketclerk/TicketCart';
import { TicketStats } from '@/components/gombapp/ticketclerk/TicketStats';

export default function TicketClerkPage() {
  const { user, loading: authLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const gombappBase = params.gombapp || 'GombApp';

  const [view, setView] = useState<View>('menu');
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const { prices, loading: pricesLoading } = usePrices('Jegy');
  const {
    maxCounts,
    loading: capacityLoading,
    refreshCapacity,
    updateCapacity,
    revertCapacity,
  } = useTicketCapacity();
  const [statsLoading, setStatsLoading] = useState(false);

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

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      showSnackbar('Kérlek, jelentkezz be az oldal használatához!', 'info');
      router.push(`/${gombappBase}/`);
    }
  }, [user, authLoading, router, showSnackbar, gombappBase]);

  const getTicketPrice = useCallback(
    (ticket: string): number => {
      const key = PRICE_MAP[ticket];
      return key ? prices[key] || 0 : 0;
    },
    [prices]
  );

  const totalPrice = orderItems.reduce((sum, item) => sum + getTicketPrice(item), 0);

  const addItem = useCallback((ticket: string) => {
    startTransition(() => {
      setOrderItems((prev) => [...prev, ticket]);
    });
  }, []);

  const removeOneOfType = useCallback((name: string) => {
    startTransition(() => {
      setOrderItems((prev) => {
        const idx = prev.lastIndexOf(name);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
    });
  }, []);

  const groupedItems = useMemo(() => {
    return orderItems.reduce<Record<string, number>>((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  }, [orderItems]);

  const showStatistics = async () => {
    setView('stats');
    setStatsLoading(true);
    await refreshCapacity();
    setStatsLoading(false);
  };

  const openCheckout = () => {
    if (orderItems.length === 0) {
      showSnackbar('Adj hozzá legalább egy jegyet a rendeléshez!', 'info');
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
      await refreshCapacity();
      // Notice: refreshCapacity updates the state asynchronously, so this might use old state.
      // However, we can use the snapshot directly if we need to. Since we extracted the hook,
      // let's fetch it directly to be perfectly safe, or just check what we have.
      // Actually, we can just fetch it again to be safe.
      const [fridaySnap, saturdaySnap, sundaySnap] = await Promise.all([
        get(ref(database!, 'Jegyek/pentekMax')),
        get(ref(database!, 'Jegyek/szombatMax')),
        get(ref(database!, 'Jegyek/vasarnapMax')),
      ]);
      const freshCounts = {
        friday: fridaySnap.exists() ? fridaySnap.val() : 0,
        saturday: saturdaySnap.exists() ? saturdaySnap.val() : 0,
        sunday: sundaySnap.exists() ? sundaySnap.val() : 0,
      };

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

      let orderTotal = 0;
      const orderPrices: number[] = [];

      orderItems.forEach((ticket) => {
        const price = getTicketPrice(ticket);
        orderTotal += price;
        orderPrices.push(price);
      });

      const currentOrderItems = [...orderItems];

      // New schema: push individual orders to Rendelések/Jegy/<uid>/orders
      const orderId = await apiSaveOrder(
        'Jegy',
        user.uid,
        user.email,
        currentOrderItems,
        orderPrices,
        orderTotal
      );

      await updateCapacity(ticketCounts);
      await refreshCapacity();

      const handleUndo = async () => {
        if (!orderId) return;
        try {
          await Promise.all([
            apiUndoOrder('Jegy', user.uid, orderId),
            revertCapacity(ticketCounts),
          ]);
          setOrderItems(currentOrderItems); // repopulate cart
          setView('order');
          showSnackbar('Mentés visszavonva!', 'info');
        } catch (error) {
          console.error('Error undoing ticket order:', error);
          showSnackbar('Hiba a visszavonás közben.', 'error');
        }
      };

      setIsCheckoutOpen(false);
      showSnackbar('Sikeresen mentve!', 'success', 10000, {
        label: (
          <div className="flex items-center gap-1.5">
            <Undo2 size={16} />
            <span>Visszavonás</span>
          </div>
        ),
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
      title="Jegyárus"
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
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-start overflow-hidden px-0 py-5">
        {view === 'menu' && (
          <TicketMenu
            isLoading={capacityLoading || pricesLoading}
            maxCounts={maxCounts}
            addItem={addItem}
            setView={setView}
            openCheckout={openCheckout}
            showStatistics={showStatistics}
          />
        )}

        {view === 'order' && (
          <TicketCart
            orderItems={orderItems}
            groupedItems={groupedItems}
            getTicketPrice={getTicketPrice}
            totalPrice={totalPrice}
            removeOneOfType={removeOneOfType}
            addItem={addItem}
            setOrderItems={setOrderItems}
            capacityLoading={capacityLoading}
            ticketCapacities={maxCounts}
            saveOrder={saveOrder}
            openCheckout={openCheckout}
          />
        )}

        {view === 'stats' && (
          <TicketStats
            statsLoading={statsLoading}
            capacityLoading={capacityLoading}
            maxCounts={maxCounts}
          />
        )}
      </div>
    </PageLayout>
  );
}
