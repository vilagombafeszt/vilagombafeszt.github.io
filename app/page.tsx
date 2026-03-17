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

      {/* Hero */}
      <HeroSection />

      {/* Műsor */}
      <span id="Musor" style={{ display: 'block', height: 0, overflow: 'hidden' }} />
      <MusorSection />

      {/* Jegyeket, Bérleteket */}
      <span id="Jegyeket-berleteket" style={{ display: 'block', height: 0, overflow: 'hidden' }} />
      <JegyekSection />

      {/* Helyszín */}
      <span id="Helyszin" style={{ display: 'block', height: 0, overflow: 'hidden' }} />
      <HelyszinSection />

      {/* Ez úgy volt */}
      <span id="Ez-ugy-volt" style={{ display: 'block', height: 0, overflow: 'hidden' }} />
      <EzUgyVoltSection />

      {/* Képtár */}
      <span id="Keptar" style={{ display: 'block', height: 0, overflow: 'hidden' }} />
      <KeptarSection />

      {/* Kapcsolat */}
      <span id="Kapcsolat" style={{ display: 'block', height: 0, overflow: 'hidden' }} />
      <KapcsolatSection />
    </>
  );
}
