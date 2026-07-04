import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';

export function usePrices(category: 'Jegy' | 'Ital') {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!database) {
      setLoading(false);
      return;
    }

    setLoading(true);
    get(ref(database, `Árak/${category}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPrices(snapshot.val());
        }
      })
      .catch((error) => console.error(`Error fetching prices for ${category}:`, error))
      .finally(() => setLoading(false));
  }, [category]);

  return { prices, loading };
}
