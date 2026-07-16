import { countTicketsByType } from '@/components/gombapp/ticketclerk/utils';
import { useGlobalData } from '@/components/gombapp/GlobalDataProvider';
import { updateTicketCapacity, revertTicketCapacity } from '@/lib/firebase/api';

export function useTicketCapacity() {
  const { ticketCapacities: maxCounts, loading } = useGlobalData();

  const refreshCapacity = async () => {
    return Promise.resolve();
  };

  const updateCapacity = async (ticketCounts: ReturnType<typeof countTicketsByType>) => {
    return updateTicketCapacity(
      ticketCounts.friday,
      ticketCounts.saturday,
      ticketCounts.sunday,
      ticketCounts.pass
    );
  };

  const revertCapacity = async (ticketCounts: ReturnType<typeof countTicketsByType>) => {
    return revertTicketCapacity(
      ticketCounts.friday,
      ticketCounts.saturday,
      ticketCounts.sunday,
      ticketCounts.pass
    );
  };

  return {
    maxCounts,
    loading,
    refreshCapacity,
    updateCapacity,
    revertCapacity,
  };
}
