export const countTicketsByType = (orders: string[]) => {
  const counts = { friday: 0, saturday: 0, sunday: 0, pass: 0 };
  orders.forEach((ticket) => {
    switch (ticket) {
      case 'Bérlet':
        counts.pass++;
        break;
      case 'Napijegy (péntek)':
        counts.friday++;
        break;
      case 'Napijegy (szombat)':
        counts.saturday++;
        break;
      case 'Napijegy (vasárnap)':
        counts.sunday++;
        break;
    }
  });
  return counts;
};

import { MaxCounts } from './types';

export const isTicketDisabled = (ticketName: string, maxCounts: MaxCounts | null): boolean => {
  if (!maxCounts) return false;
  if (ticketName === 'Bérlet') {
    return maxCounts.friday === 0 || maxCounts.saturday === 0 || maxCounts.sunday === 0;
  }
  if (ticketName === 'Napijegy (péntek)') return maxCounts.friday === 0;
  if (ticketName === 'Napijegy (szombat)') return maxCounts.saturday === 0;
  if (ticketName === 'Napijegy (vasárnap)') return maxCounts.sunday === 0;
  return false;
};
