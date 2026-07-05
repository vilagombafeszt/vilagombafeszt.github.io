import { useGlobalData } from '@/components/gombapp/GlobalDataProvider';

export function usePrices(category: 'Jegy' | 'Ital') {
  const { ticketPrices, drinkPrices, loading } = useGlobalData();

  return {
    prices: category === 'Jegy' ? ticketPrices : drinkPrices,
    loading,
  };
}
