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
  { name: 'Háziúr', image: '/GombApp/images/haziur.png', alt: 'Háziúr', label: 'Háziúr' },
  {
    name: 'Sportfröccs',
    image: '/GombApp/images/sportfroccs.png',
    alt: 'Sportfröccs',
    label: 'Sportfröccs',
  },
  {
    name: 'Szóda 3dl',
    image: '/GombApp/images/kisszoda.png',
    alt: 'Szóda 3dl',
    label: 'Szóda 1dl',
  },
  {
    name: 'Szóda 5dl',
    image: '/GombApp/images/pohar.png',
    alt: 'Papír pohár',
    label: 'Papír pohár',
  },
  { name: 'Bor 3dl', image: '/GombApp/images/kisbor.png', alt: 'Bor 3dl', label: 'Bor 3dl' },
  { name: 'Bor 5dl', image: '/GombApp/images/nagybor.png', alt: 'Bor 5dl', label: 'Bor 5dl' },
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
  { name: 'Kávé', image: '/GombApp/images/kave.png', alt: 'Kávé', label: 'Presszó kávé' },
  { name: 'Tejes Kávé', image: '/GombApp/images/kave.png', alt: 'Kávé', label: 'Tejes kávé' },
  {
    name: 'Jeges tea',
    image: '/GombApp/images/jegestea.png',
    alt: 'Jeges tea',
    label: 'Limonádé 3dl',
  },
  {
    name: 'Limonádé',
    image: '/GombApp/images/jegestea.png',
    alt: 'Limonádé',
    label: 'Limonádé 5dl',
  },
];

export const PRICE_MAP: Record<string, string> = {
  'Korsó Kőbányai': 'korsoKobiPrice',
  'Pohár Kőbányai': 'poharKobiPrice',
  'Korsó Kézműves': 'korsoNarancsSor',
  'Pohár Kézműves': 'poharNarancsSor',
  Nagyfröccs: 'nagyfroccsPrice',
  Kisfröccs: 'kisfroccsPrice',
  Hosszúlépés: 'hosszulepesPrice',
  Háziúr: 'haziurPrice',
  Sportfröccs: 'sportfroccsPrice',
  'Szóda 3dl': 'kisszodaPrice',
  'Szóda 5dl': 'nagyszodaPrice',
  'Bor 3dl': 'kisborPrice',
  'Bor 5dl': 'nagyborPrice',
  'Pálinka 2cl': 'kispalinkaPrice',
  'Pálinka 4cl': 'nagypalinkaPrice',
  Kávé: 'kavePrice',
  'Tejes Kávé': 'tejesKavePrice',
  'Jeges tea': 'jegesteaPrice',
  Limonádé: 'limonadePrice',
};
