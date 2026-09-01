import Menu from '@/components/Menu';
import HeroSection from '@/components/HeroSection';
import dynamic from 'next/dynamic';
import PromoToast from '@/components/PromoToast';
import { siteConfig } from '@/site.config';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

const MusorSection = dynamic(() => import('@/components/MusorSection'));
const JegyekSection = dynamic(() => import('@/components/JegyekSection'));
const HelyszinSection = dynamic(() => import('@/components/HelyszinSection'));
const EzUgyVoltSection = dynamic(() => import('@/components/EzUgyVoltSection'));
const KeptarSection = dynamic(() => import('@/components/KeptarSection'));
const KapcsolatSection = dynamic(() => import('@/components/KapcsolatSection'));

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: { absolute: t('title') },
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://vilagombafeszt.github.io/${locale}`,
    },
    twitter: {
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {siteConfig.features.showPromoToast && <PromoToast />}

      <Menu />
      <HeroSection />
      <MusorSection />
      <JegyekSection />
      <HelyszinSection />
      <EzUgyVoltSection />
      <KeptarSection />
      <KapcsolatSection />
    </NextIntlClientProvider>
  );
}
