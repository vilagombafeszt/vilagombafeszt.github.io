export interface TicketItem {
  name: string;
  image: string;
  alt: string;
  label: string;
}

export const TICKETS: TicketItem[] = [
  {
    name: 'Bérlet',
    image: '/GombApp/images/pass.png',
    alt: 'Bérlet',
    label: 'Bérlet \n 15.000 Ft',
  },
  {
    name: 'Napijegy (péntek)',
    image: '/GombApp/images/ticket1.png',
    alt: 'Napijegy (péntek)',
    label: 'Napijegy (péntek) \n 7.500 Ft',
  },
  {
    name: 'Napijegy (szombat)',
    image: '/GombApp/images/ticket1.png',
    alt: 'Napijegy (szombat)',
    label: 'Napijegy (szombat) \n 7.500 Ft',
  },
  {
    name: 'Napijegy (vasárnap)',
    image: '/GombApp/images/ticket1.png',
    alt: 'Napijegy (vasárnap)',
    label: 'Napijegy (vasárnap) \n 7.500 Ft',
  },
];

export const PRICE_MAP: Record<string, string> = {
  Bérlet: 'passPrice',
  'Napijegy (péntek)': 'fridayPrice',
  'Napijegy (szombat)': 'saturdayPrice',
  'Napijegy (vasárnap)': 'sundayPrice',
};
