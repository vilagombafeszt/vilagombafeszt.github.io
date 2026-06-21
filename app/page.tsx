import Menu from '@/components/Menu';
import HeroSection from '@/components/HeroSection';
import dynamic from 'next/dynamic';

const MusorSection = dynamic(() => import('@/components/MusorSection'));
const JegyekSection = dynamic(() => import('@/components/JegyekSection'));
const HelyszinSection = dynamic(() => import('@/components/HelyszinSection'));
const EzUgyVoltSection = dynamic(() => import('@/components/EzUgyVoltSection'));
const KeptarSection = dynamic(() => import('@/components/KeptarSection'));
const KapcsolatSection = dynamic(() => import('@/components/KapcsolatSection'));

export default function Home() {
  return (
    <>
      <Menu />
      <HeroSection />
      <MusorSection />
      <JegyekSection />
      <HelyszinSection />
      <EzUgyVoltSection />
      <KeptarSection />
      <KapcsolatSection />
    </>
  );
}
