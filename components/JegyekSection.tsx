import Image from 'next/image';

export default function JegyekSection() {
  return (
    <div className="section" id="jegyeket-berleteket">
      <div className="title">Jegyeket, Bérleteket!</div>

      <div className="ticket-status">
        <div className="ticket-badge animate-pulse">ELINDULT A JEGYÉRTÉKESÍTÉS!</div>

        <div className="mx-auto mb-8 mt-4 flex w-full max-w-5xl flex-col items-center justify-center gap-8 md:mb-8 md:mt-4 md:flex-row md:gap-12 lg:gap-20">
          <a
            href="https://www.tixa.hu/vilagomba-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl transition-all hover:scale-105"
          >
            <Image
              src="/page_images/early_bird_berlet.webp"
              alt="Early Bird Bérlet"
              width={350}
              height={500}
              className="h-auto w-[260px] object-cover md:w-[300px] lg:w-[350px]"
            />
          </a>
          <a
            href="https://www.tixa.hu/vilagomba-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block overflow-hidden rounded-2xl transition-all hover:scale-105"
          >
            <Image
              src="/page_images/early_bird_napijegy.webp"
              alt="Early Bird Napijegy"
              width={350}
              height={500}
              className="h-auto w-[260px] object-cover md:w-[300px] lg:w-[350px]"
            />
          </a>
        </div>

        <p className="ticket-text">
          A 2026-os fesztiválra a jegyértékesítés elkezdődött! Csapjatok le minél hamarabb az Early
          Bird jegyekre, mert csak korlátozott számban (és ideig) érhetők el. A legfrissebb
          információkért kövessetek minket a hivatalos Facebook- és Instagram-oldalunkon.
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
