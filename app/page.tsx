import Menu from '@/components/Menu';
import HeroSection from '@/components/HeroSection';
import dynamic from 'next/dynamic';
import PromoToast from '@/components/PromoToast';
import { siteConfig } from '@/site.config';
import GradientDivider from '@/components/GradientDivider';

const MusorSection = dynamic(() => import('@/components/MusorSection'));
const JegyekSection = dynamic(() => import('@/components/JegyekSection'));
const HelyszinSection = dynamic(() => import('@/components/HelyszinSection'));
const EzUgyVoltSection = dynamic(() => import('@/components/EzUgyVoltSection'));
const KeptarSection = dynamic(() => import('@/components/KeptarSection'));
const KapcsolatSection = dynamic(() => import('@/components/KapcsolatSection'));

export default function Home() {
  return (
    <>
      {siteConfig.features.showPromoToast && <PromoToast />}

      <Menu />
      <HeroSection />

      <GradientDivider
        topColor="transparent"
        bottomColor="#354b3d"
        className="-mt-[15px] h-[15px]"
      />
      <MusorSection />

      <GradientDivider topColor="#354b3d" bottomColor="#355168" />
      <JegyekSection />

      <GradientDivider topColor="#355168" bottomColor="#a44041" />
      <HelyszinSection />

      <GradientDivider topColor="#a44041" bottomColor="#474738" />
      <EzUgyVoltSection />

      <GradientDivider topColor="#474738" bottomColor="#253529" />
      <KeptarSection />

      <GradientDivider topColor="#253529" bottomColor="#594a66" />
      <KapcsolatSection />
    </>
  );
}
