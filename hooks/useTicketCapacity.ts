import { ref, runTransaction } from 'firebase/database';
import { database } from '@/lib/firebase';
import { countTicketsByType } from '@/components/gombapp/ticketclerk/utils';
import { useGlobalData } from '@/components/gombapp/GlobalDataProvider';

export function useTicketCapacity() {
  const { ticketCapacities: maxCounts, loading } = useGlobalData();

  // The refreshCapacity function is kept for backward compatibility with the components,
  // but it doesn't need to do anything anymore because GlobalDataProvider automatically syncs.
  const refreshCapacity = async () => {
    return Promise.resolve();
  };

  const updateCapacity = async (ticketCounts: ReturnType<typeof countTicketsByType>) => {
    if (!database) return;
    const promises: Promise<unknown>[] = [];

    if (ticketCounts.friday > 0 || ticketCounts.pass > 0) {
      const fridayRef = ref(database, 'Jegyek/pentekMax');
      promises.push(
        runTransaction(fridayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return Math.max(0, currentMax - (ticketCounts.friday + ticketCounts.pass));
        })
      );
    }

    if (ticketCounts.saturday > 0 || ticketCounts.pass > 0) {
      const saturdayRef = ref(database, 'Jegyek/szombatMax');
      promises.push(
        runTransaction(saturdayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return Math.max(0, currentMax - (ticketCounts.saturday + ticketCounts.pass));
        })
      );
    }

    if (ticketCounts.sunday > 0 || ticketCounts.pass > 0) {
      const sundayRef = ref(database, 'Jegyek/vasarnapMax');
      promises.push(
        runTransaction(sundayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return Math.max(0, currentMax - (ticketCounts.sunday + ticketCounts.pass));
        })
      );
    }

    return Promise.all(promises);
  };

  const revertCapacity = async (ticketCounts: ReturnType<typeof countTicketsByType>) => {
    if (!database) return;
    const promises: Promise<unknown>[] = [];

    if (ticketCounts.friday > 0 || ticketCounts.pass > 0) {
      const fridayRef = ref(database, 'Jegyek/pentekMax');
      promises.push(
        runTransaction(fridayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return currentMax + ticketCounts.friday + ticketCounts.pass;
        })
      );
    }

    if (ticketCounts.saturday > 0 || ticketCounts.pass > 0) {
      const saturdayRef = ref(database, 'Jegyek/szombatMax');
      promises.push(
        runTransaction(saturdayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return currentMax + ticketCounts.saturday + ticketCounts.pass;
        })
      );
    }

    if (ticketCounts.sunday > 0 || ticketCounts.pass > 0) {
      const sundayRef = ref(database, 'Jegyek/vasarnapMax');
      promises.push(
        runTransaction(sundayRef, (currentValue) => {
          const currentMax = currentValue || 0;
          return currentMax + ticketCounts.sunday + ticketCounts.pass;
        })
      );
    }

    return Promise.all(promises);
  };

  return {
    maxCounts,
    loading,
    refreshCapacity,
    updateCapacity,
    revertCapacity,
  };
}
