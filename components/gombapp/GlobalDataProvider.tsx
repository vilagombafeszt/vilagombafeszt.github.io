'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue, off, DataSnapshot } from 'firebase/database';
import { database } from '@/lib/firebase';
import { MaxCounts } from '@/components/gombapp/ticketclerk/types';

interface GlobalDataContextType {
  ticketPrices: Record<string, number>;
  drinkPrices: Record<string, number>;
  ticketCapacities: MaxCounts | null;
  loading: boolean;
}

const GlobalDataContext = createContext<GlobalDataContextType>({
  ticketPrices: {},
  drinkPrices: {},
  ticketCapacities: null,
  loading: true,
});

export function useGlobalData() {
  return useContext(GlobalDataContext);
}

export function GlobalDataProvider({ children }: { children: React.ReactNode }) {
  const [ticketPrices, setTicketPrices] = useState<Record<string, number>>({});
  const [drinkPrices, setDrinkPrices] = useState<Record<string, number>>({});
  const [ticketCapacities, setTicketCapacities] = useState<MaxCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!database) {
      setLoading(false);
      return;
    }

    const ticketPricesRef = ref(database, 'Árak/Jegy');
    const drinkPricesRef = ref(database, 'Árak/Ital');
    const capacitiesRef = ref(database, 'Jegyek');

    let ticketsLoaded = false;
    let drinksLoaded = false;
    let capsLoaded = false;

    const checkLoading = () => {
      if (ticketsLoaded && drinksLoaded && capsLoaded) {
        setLoading(false);
      }
    };

    const handleTicketPrices = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) setTicketPrices(snapshot.val());
      ticketsLoaded = true;
      checkLoading();
    };

    const handleDrinkPrices = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) setDrinkPrices(snapshot.val());
      drinksLoaded = true;
      checkLoading();
    };

    const handleCapacities = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTicketCapacities({
          friday: data.pentekMax || 0,
          saturday: data.szombatMax || 0,
          sunday: data.vasarnapMax || 0,
        });
      } else {
        setTicketCapacities(null);
      }
      capsLoaded = true;
      checkLoading();
    };

    onValue(ticketPricesRef, handleTicketPrices, (error) => {
      console.error('Error listening to ticket prices:', error);
      ticketsLoaded = true;
      checkLoading();
    });

    onValue(drinkPricesRef, handleDrinkPrices, (error) => {
      console.error('Error listening to drink prices:', error);
      drinksLoaded = true;
      checkLoading();
    });

    onValue(capacitiesRef, handleCapacities, (error) => {
      console.error('Error listening to ticket capacities:', error);
      capsLoaded = true;
      checkLoading();
    });

    return () => {
      off(ticketPricesRef, 'value', handleTicketPrices);
      off(drinkPricesRef, 'value', handleDrinkPrices);
      off(capacitiesRef, 'value', handleCapacities);
    };
  }, []);

  return (
    <GlobalDataContext.Provider
      value={{
        ticketPrices,
        drinkPrices,
        ticketCapacities,
        loading,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
}
