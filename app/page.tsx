import Menu from '@/components/Menu';
import HeroSection from '@/components/HeroSection';
import MusorSection from '@/components/MusorSection';
import JegyekSection from '@/components/JegyekSection';
import HelyszinSection from '@/components/HelyszinSection';
import EzUgyVoltSection from '@/components/EzUgyVoltSection';
import KeptarSection from '@/components/KeptarSection';
import KapcsolatSection from '@/components/KapcsolatSection';

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
