'use client';

import React, { useState, useEffect, useCallback, useMemo, startTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { saveOrder as apiSaveOrder, undoOrder as apiUndoOrder } from '@/lib/firebase/api';
import { useAuth } from '@/components/gombapp/AuthProvider';
import { useSnackbar } from '@/components/gombapp/Snackbar';
import { PageLayout } from '@/components/gombapp/PageLayout';
import { CheckoutSheet } from '@/components/gombapp/CheckoutSheet';
import { Undo2 } from 'lucide-react';
import { usePrices } from '@/hooks/usePrices';
import { View } from '@/components/gombapp/bartender/types';
import { PRICE_MAP } from '@/components/gombapp/bartender/constants';
import { BartenderMenu } from '@/components/gombapp/bartender/BartenderMenu';
import { BartenderCart } from '@/components/gombapp/bartender/BartenderCart';

export default function BartenderPage() {
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

  const { prices, loading: pricesLoading } = usePrices('Ital');

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

  // Auth check
  useEffect(() => {
    if (!authLoading && !user) {
      showSnackbar('Kérlek, jelentkezz be az oldal használatához!', 'info');
      router.push(`/${gombappBase}/`);
    }
  }, [user, authLoading, router, showSnackbar, gombappBase]);

  const getDrinkPrice = useCallback(
    (drink: string): number => {
      const key = PRICE_MAP[drink];
      return key ? prices[key] || 0 : 0;
    },
    [prices]
  );

  const totalPrice = orderItems.reduce((sum, item) => sum + getDrinkPrice(item), 0);

  const addItem = useCallback((drink: string) => {
    startTransition(() => {
      setOrderItems((prev) => [...prev, drink]);
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
      // Use the cached prices from the hook for the order total instead of re-fetching
      let orderTotal = 0;
      const orderPrices: number[] = [];

      orderItems.forEach((drink) => {
        const key = PRICE_MAP[drink];
        const price = key ? prices[key] || 0 : 0;
        orderTotal += price;
        orderPrices.push(price);
      });

      const currentOrderItems = [...orderItems];

      // New schema: push individual orders to Rendelések/Ital/<uid>/orders
      const orderId = await apiSaveOrder(
        'Ital',
        user.uid,
        user.email,
        currentOrderItems,
        orderPrices,
        orderTotal
      );

      const handleUndo = async () => {
        if (!orderId) return;
        try {
          await apiUndoOrder('Ital', user.uid, orderId);
          setOrderItems(currentOrderItems); // repopulate cart
          setView('order');
          showSnackbar('Mentés visszavonva!', 'info');
        } catch (error) {
          console.error('Error undoing order:', error);
          showSnackbar('Hiba a visszavonás közben.', 'error');
        }
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
      <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-start overflow-hidden px-0 py-5">
        {view === 'menu' && (
          <BartenderMenu
            isLoading={pricesLoading}
            addItem={addItem}
            setView={setView}
            openCheckout={openCheckout}
            totalPrice={totalPrice}
          />
        )}

        {view === 'order' && (
          <BartenderCart
            orderItems={orderItems}
            groupedItems={groupedItems}
            getDrinkPrice={getDrinkPrice}
            totalPrice={totalPrice}
            removeOneOfType={removeOneOfType}
            addItem={addItem}
            setOrderItems={setOrderItems}
            saveOrder={saveOrder}
            openCheckout={openCheckout}
          />
        )}
      </div>
    </PageLayout>
  );
}
