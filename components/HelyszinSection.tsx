import LazyMap from './LazyMap';

export default function HelyszinSection() {
  return (
    <div className="section" id="helyszin">
      <div className="title">Helyszín</div>

      <div className="helyszin-subtitle">
        A Zebegényi vasútállomástól kb. 20 perc sétára található.
      </div>

      <div className="maps-container">
        <div className="map-container">
          <LazyMap
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2679.4895470799856!2d18.908770312394047!3d47.81072997373855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476a87000989500b%3A0x49543d653c531dd9!2zVmlsw6FHb21iYSBGZXN6dGl2w6Vs!5e0!3m2!1shu!2shu!4v1738021487749!5m2!1shu!2sh"
            title="ViláGomba Fesztivál helyszín"
          />
          <div className="map-label">A fesztivál helyszíne</div>
        </div>

        <div className="map-container">
          <LazyMap
            src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d5359.4764598655565!2d18.904987298618558!3d47.80590989080945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e3!4m5!1s0x476a87924aa91591%3A0xb50ebb215f085a1b!2zWmViZWfDqW55LCAyNjI3!3m2!1d47.8013889!2d18.9088889!4m5!1s0x476a87000989500b%3A0x49543d653c531dd9!2zWmViZWfDqW55LCBWaWzDoUdvbWJhLCBPcmdvbmEgw7p0!3m2!1d47.8107264!2d18.9113506!5e0!3m2!1shu!2shu!4v1755619256480!5m2!1shu!2shu"
            title="A helyszín a Zebegényi vasútállomástól"
          />
          <div className="map-label">Útvonal a vasútállomástól</div>
        </div>
      </div>
    </div>
  );
}
