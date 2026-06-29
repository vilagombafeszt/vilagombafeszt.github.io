import Image from 'next/image';
import ScrollRevealWrapper from './ScrollRevealWrapper';
import { siteConfig } from '@/site.config';

const TICKET_IMAGES = [
  { src: '/page_images/normal_napijegy.webp', alt: 'Normál Napijegy' },
  { src: '/page_images/normal_berlet.webp', alt: 'Normál Bérlet' },
  { src: '/page_images/helyszini_napijegy.webp', alt: 'Helyszíni Napijegy' },
  { src: '/page_images/helyszini_berlet.webp', alt: 'Helyszíni Bérlet' },
];

/* ── Social Icons for the Buttons ─────────────────────────────── */
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function JegyekSection() {
  return (
    <ScrollRevealWrapper
      id="jegyeket-berleteket"
      dataLogoTheme="vaj"
      className="landscape:max-h-[500px]:min-h-0 landscape:max-h-[500px]:pt-[80px] flex min-h-[85svh] w-full flex-col items-center bg-[#355168] px-[clamp(16px,5vw,80px)] pb-[clamp(40px,5vh,72px)] pt-[clamp(32px,3vh,56px)] text-center text-[#ac9d9d] selection:bg-[#ac9d9d] selection:text-[#355168]"
    >
      <h2 className="m-0 mb-[clamp(16px,3vh,40px)] text-center font-[family-name:var(--font-brand)] text-[clamp(30px,7vw,48px)] font-normal opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:text-[clamp(28px,4.5vw,60px)]">
        Jegyeket, Bérleteket!
      </h2>

      <div
        style={{ animationDelay: '0.1s' }}
        className="w-full max-w-[800px] font-[family-name:var(--font-body)] opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
      >
        <div className="mb-[clamp(28px,4vh,48px)] inline-block animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-[#ac9d9d] px-7 py-2.5 text-[clamp(17px,4vw,24px)] font-bold tracking-[2px] text-[#102135] shadow-lg md:text-[clamp(16px,2vw,26px)]">
          ELINDULT A JEGYÉRTÉKESÍTÉS!
        </div>
      </div>

      <div className="mx-auto mb-10 mt-4 grid w-full max-w-[1600px] grid-cols-1 justify-items-center gap-6 md:mb-12 md:mt-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 lg:gap-6 xl:gap-8">
        {TICKET_IMAGES.map((img, index) => (
          <a
            key={index}
            href={siteConfig.externalLinks.ticketSales}
            target="_blank"
            rel="noopener noreferrer"
            style={{ animationDelay: `${0.2 + index * 0.15}s` }}
            className="group/ticket block opacity-0 drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-4 hover:drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={350}
              height={500}
              loading="lazy"
              className="h-auto w-[250px] object-cover transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover/ticket:-rotate-2 group-hover/ticket:scale-105 group-hover/ticket:brightness-110 sm:w-[280px] md:w-[260px] lg:w-[220px] xl:w-[260px] 2xl:w-[300px]"
            />
          </a>
        ))}
      </div>

      <div
        style={{ animationDelay: '0.8s' }}
        className="w-full max-w-[800px] font-[family-name:var(--font-body)] opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
      >
        <p className="mb-[clamp(36px,5vh,56px)] text-[clamp(18px,4vw,24px)] leading-[1.6] md:text-[clamp(16px,2vw,26px)]">
          A 2026-os fesztiválra az Early Bird jegyek elfogytak! Már csak a normál jegyek elérhetőek,
          de azok is csak korlátozott számban. Érdemes megvenni a jegyeket előre, hogy biztosan
          legyen helyetek a fesztiválon! A legfrissebb információkért kövessetek be minket a
          hivatalos Facebook- és Instagram-oldalunkon.
        </p>

        <div className="flex flex-col items-center justify-center gap-[clamp(16px,2vw,24px)] sm:flex-row">
          <a
            href={siteConfig.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#ac9d9d] px-7 py-3.5 text-[clamp(17px,4vw,22px)] font-bold tracking-[1.5px] !text-[#102135] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:!text-[#102135] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] active:translate-y-0 active:scale-[0.96] sm:w-auto md:px-8 md:text-[clamp(16px,1.8vw,22px)]"
          >
            <FacebookIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Kövess Facebookon
          </a>
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#ac9d9d] px-7 py-3.5 text-[clamp(17px,4vw,22px)] font-bold tracking-[1.5px] !text-[#102135] shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:!text-[#102135] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] active:translate-y-0 active:scale-[0.96] sm:w-auto md:px-8 md:text-[clamp(16px,1.8vw,22px)]"
          >
            <InstagramIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Kövess Instagramon
          </a>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
