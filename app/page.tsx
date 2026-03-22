import { setRequestLocale } from 'next-intl/server';
import HomePage from './[locale]/page';

export default async function RootPage() {
  setRequestLocale('hu');
  return <HomePage params={Promise.resolve({ locale: 'hu' })} />;
}
