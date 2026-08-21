export type View = 'menu' | 'order';

export interface DrinkItem {
  name: string;
  image: string;
  alt: string;
  label: string;
}

export const DRINKS: DrinkItem[] = [
  {
    name: 'Korsó Kőbányai',
    image: '/GombApp/images/korso-kobi.png',
    alt: 'Korsó Kőbányai',
    label: 'Korsó Kőbányai',
  },
  {
    name: 'Pohár Kőbányai',
    image: '/GombApp/images/pohar-kobi.png',
    alt: 'Pohár Kőbányai',
    label: 'Pohár Kőbányai',
  },
  {
    name: 'Korsó Kézműves',
    image: '/GombApp/images/kezmuves.png',
    alt: 'Korsó Kézműves',
    label: 'Korsó Kézműves',
  },
  {
    name: 'Pohár Kézműves',
    image: '/GombApp/images/kezmuves.png',
    alt: 'Pohár Kézműves',
    label: 'Pohár Kézműves',
  },
  {
    name: 'Nagyfröccs',
    image: '/GombApp/images/nagyfroccs.png',
    alt: 'Nagyfröccs',
    label: 'Nagyfröccs',
  },
  {
    name: 'Kisfröccs',
    image: '/GombApp/images/kisfroccs.png',
    alt: 'Kisfröccs',
    label: 'Kisfröccs',
  },
  {
    name: 'Hosszúlépés',
    image: '/GombApp/images/hosszulepes.png',
    alt: 'Hosszúlépés',
    label: 'Hosszúlépés',
  },
  {
    name: 'Házmester',
    image: '/GombApp/images/hazmester.png',
    alt: 'Házmester',
    label: 'Házmester',
  },
  {
    name: 'Bor 1dl',
    image: '/GombApp/images/kisbor.png',
    alt: 'Bor 1dl',
    label: 'Bor 1dl',
  },
  {
    name: 'Szóda 1dl',
    image: '/GombApp/images/kisszoda.png',
    alt: 'Szóda 1dl',
    label: 'Szóda 1dl',
  },
  {
    name: 'Pálinka 2cl',
    image: '/GombApp/images/palinka.png',
    alt: 'Pálinka 2cl',
    label: 'Pálinka 2cl',
  },
  {
    name: 'Pálinka 4cl',
    image: '/GombApp/images/palinka.png',
    alt: 'Pálinka 4cl',
    label: 'Pálinka 4cl',
  },
  {
    name: 'Kávé',
    image: '/GombApp/images/kave.png',
    alt: 'Kávé',
    label: 'Presszó kávé',
  },
  {
    name: 'Tejes Kávé',
    image: '/GombApp/images/kave.png',
    alt: 'Tejes Kávé',
    label: 'Tejes kávé',
  },
  {
    name: 'Jeges tea/Limonádé',
    image: '/GombApp/images/jegestea.png',
    alt: 'Jeges tea/Limonádé',
    label: 'Jeges tea/Limonádé',
  },
  {
    name: 'Levendula szörp',
    image: '/GombApp/images/jegestea.png',
    alt: 'Levendula szörp',
    label: 'Levendula szörp',
  },
  {
    name: 'Pohár',
    image: '/GombApp/images/pohar.png',
    alt: 'Pohár',
    label: 'Pohár',
  },
  {
    name: 'Viceházmester',
    image: '/GombApp/images/vicehazmester.png',
    alt: 'Viceházmester',
    label: 'Viceházmester',
  },
];

export const PRICE_MAP: Record<string, string> = {
  'Korsó Kőbányai': 'korsoKobiPrice',
  'Pohár Kőbányai': 'poharKobiPrice',
  'Korsó Kézműves': 'korsoKezmuvesPrice',
  'Pohár Kézműves': 'poharKezmuvesPrice',
  Nagyfröccs: 'nagyfroccsPrice',
  Kisfröccs: 'kisfroccsPrice',
  Hosszúlépés: 'hosszulepesPrice',
  Házmester: 'hazmesterPrice',
  'Bor 1dl': 'borDeciPrice',
  'Szóda 1dl': 'szodaDeciPrice',
  'Pálinka 2cl': 'kispalinkaPrice',
  'Pálinka 4cl': 'nagypalinkaPrice',
  Kávé: 'kavePrice',
  'Tejes Kávé': 'tejesKavePrice',
  'Jeges tea/Limonádé': 'teaLimonadePrice',
  'Levendula szörp': 'szorpPrice',
  Pohár: 'poharPrice',
  Viceházmester: 'vicehazmesterPrice',
};

const LEGACY_PRICE_MAP: Partial<Record<string, string[]>> = {
  'Korsó Kézműves': ['korsoNarancsSor'],
  'Pohár Kézműves': ['poharNarancsSor'],
  Házmester: ['haziurPrice', 'sportfroccsPrice'],
  'Bor 1dl': ['kisborPrice'],
  'Szóda 1dl': ['kisszodaPrice'],
  'Jeges tea/Limonádé': ['kisTeaSzorpLimonadePrice', 'jegesteaPrice'],
  'Levendula szörp': ['nagyTeaSzorpLimonadePrice', 'limonadePrice'],
};

export function resolveDrinkPrice(drink: string, prices: Record<string, number>): number {
  const keys = [PRICE_MAP[drink], ...(LEGACY_PRICE_MAP[drink] || [])].filter(Boolean);

  for (const key of keys) {
    const rawPrice = prices[key];
    const normalizedPrice = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
    if (Number.isFinite(normalizedPrice)) {
      return normalizedPrice;
    }
  }

  return 0;
}
