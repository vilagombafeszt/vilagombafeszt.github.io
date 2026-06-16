import Image from 'next/image';

export default function JegyekSection() {
  return (
    <div className="section" id="jegyeket-berleteket">
      <div className="title">Jegyeket, Bérleteket!</div>

      <div className="ticket-status">
        <div className="ticket-badge animate-pulse">ELINDULT A JEGYÉRTÉKESÍTÉS!</div>
      </div>

      <div className="mx-auto mb-8 mt-4 flex w-full max-w-[1600px] flex-col items-center justify-center gap-5 md:mb-8 md:mt-4 md:flex-row md:flex-wrap lg:flex-nowrap lg:gap-8 xl:gap-12">
        <a
          href="https://www.tixa.hu/vilagomba-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block shrink-0 overflow-hidden rounded-2xl transition-all hover:scale-105"
        >
          <Image
            src="/page_images/normal_napijegy.webp"
            alt="Normál Napijegy"
            width={350}
            height={500}
            className="h-auto w-[300px] object-cover sm:w-[320px] md:w-[300px] lg:w-[250px] xl:w-[300px] 2xl:w-[350px]"
          />
        </a>
        <a
          href="https://www.tixa.hu/vilagomba-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block shrink-0 overflow-hidden rounded-2xl transition-all hover:scale-105"
        >
          <Image
            src="/page_images/normal_berlet.webp"
            alt="Normál Bérlet"
            width={350}
            height={500}
            className="h-auto w-[300px] object-cover sm:w-[320px] md:w-[300px] lg:w-[250px] xl:w-[300px] 2xl:w-[350px]"
          />
        </a>
        <a
          href="https://www.tixa.hu/vilagomba-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block shrink-0 overflow-hidden rounded-2xl transition-all hover:scale-105"
        >
          <Image
            src="/page_images/helyszini_napijegy.webp"
            alt="Helyszíni Napijegy"
            width={350}
            height={500}
            className="h-auto w-[300px] object-cover sm:w-[320px] md:w-[300px] lg:w-[250px] xl:w-[300px] 2xl:w-[350px]"
          />
        </a>
        <a
          href="https://www.tixa.hu/vilagomba-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block shrink-0 overflow-hidden rounded-2xl transition-all hover:scale-105"
        >
          <Image
            src="/page_images/helyszini_berlet.webp"
            alt="Helyszíni Bérlet"
            width={350}
            height={500}
            className="h-auto w-[300px] object-cover sm:w-[320px] md:w-[300px] lg:w-[250px] xl:w-[300px] 2xl:w-[350px]"
          />
        </a>
      </div>

      <div className="ticket-status">
        <p className="ticket-text">
          A 2026-os fesztiválra az Early Bird jegyek elfogytak! Már csak a normál jegyek elérhetőek,
          de azok is csak korlátozott számban. Érdemes megvenni a jegyeket előre, hogy biztosan
          legyen helyetek a fesztiválon! A legfrissebb információkért kövessetek be minket a
          hivatalos Facebook- és Instagram-oldalunkon.
        </p>

        <div className="ticket-links">
          <a
            href="https://www.facebook.com/vilagombafeszt"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link-btn"
          >
            Kövess Facebookon
          </a>
          <a
            href="https://www.instagram.com/vilagombafeszt/"
            target="_blank"
            rel="noopener noreferrer"
            className="ticket-link-btn ticket-link-btn-outline"
          >
            Kövess Instagramon
          </a>
        </div>
      </div>
    </div>
  );
}
