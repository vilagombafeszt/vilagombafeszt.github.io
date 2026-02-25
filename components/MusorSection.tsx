import Image from 'next/image';

export default function MusorSection() {
  return (
    <div className="section" id="musor">
      <div className="title">Műsor</div>

      <div className="eloadasok">
        <div className="eloadasok-column">
          <div className="eloadasok-day">Péntek</div>
          <div className="eloadasok-item">
            <Image
              src="/page_images/pentek.jpg"
              alt="Pénteki menetrend"
              className="musor-schedule-img"
              width={600}
              height={800}
              unoptimized
            />
          </div>
        </div>

        <div className="eloadasok-column">
          <div className="eloadasok-day">Szombat</div>
          <div className="eloadasok-item">
            <Image
              src="/page_images/szombat.jpg"
              alt="Szombati menetrend"
              className="musor-schedule-img"
              width={600}
              height={800}
              unoptimized
            />
          </div>
        </div>

        <div className="eloadasok-column">
          <div className="eloadasok-day">Vasárnap</div>
          <div className="eloadasok-item">
            <Image
              src="/page_images/vasarnap.jpg"
              alt="Vasárnapi menetrend"
              className="musor-schedule-img"
              width={600}
              height={800}
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="eloadasok-others">
        <p>
          A fent látható műsor a 2025-ös esemény beosztása.{' '}
          <br />
          A jövő évi fesztivál programjain jelenleg dolgozunk, hamarosan közzétesszük itt és a
          közösségi média felületeinken is.
        </p>
      </div>
    </div>
  );
}
