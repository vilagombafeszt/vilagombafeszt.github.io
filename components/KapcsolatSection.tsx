import Image from 'next/image';
import ScrollRevealWrapper from './ScrollRevealWrapper';
import { siteConfig } from '@/site.config';

export default function KapcsolatSection() {
  return (
    <ScrollRevealWrapper
      id="kapcsolat"
      dataLogoTheme="vaj"
      className="landscape:max-h-[500px]:min-h-0 landscape:max-h-[500px]:pt-[80px] flex w-full flex-col items-center bg-[#594a66] px-[clamp(16px,5vw,80px)] pb-[clamp(32px,5vh,64px)] pt-[clamp(32px,3vh,56px)] text-[#ac9d9d] selection:bg-[#ac9d9d] selection:text-[#594a66]"
    >
      <h2 className="m-0 mb-[clamp(16px,3vh,40px)] text-center font-[family-name:var(--font-brand)] text-[clamp(30px,7vw,48px)] font-normal opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:text-[clamp(28px,4.5vw,60px)]">
        Kapcsolat
      </h2>

      <div className="mb-[clamp(24px,4vh,60px)] flex w-full max-w-[900px] flex-col items-center justify-center gap-6 font-[family-name:var(--font-body)] text-[clamp(16px,1.8vw,26px)] font-semibold md:flex-row md:items-start md:gap-[clamp(24px,4vw,48px)]">
        <div
          style={{ animationDelay: '0.1s' }}
          className="flex flex-row items-center gap-4 opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:gap-5"
        >
          <a
            href={siteConfig.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="group/fb inline-block"
          >
            <div className="opacity-0 group-data-[visible=true]:animate-[spinIn_1.5s_cubic-bezier(0.25,1,0.5,1)_forwards]">
              <Image
                src="/page_images/facebook.webp"
                alt="Facebook esemény"
                width={150}
                height={150}
                className="h-auto w-[60px] transition-transform duration-300 ease-out group-hover/fb:scale-110 md:w-[80px] lg:w-[clamp(60px,8vw,110px)]"
                unoptimized
              />
            </div>
          </a>
        </div>

        <div
          style={{ animationDelay: '0.2s' }}
          className="min-w-0 flex-none opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:flex-[0_1_auto]"
        >
          <table className="w-auto border-collapse">
            <tbody>
              <tr>
                <td className="whitespace-nowrap px-2 py-1 align-top text-[17px] opacity-80 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  Telefon:
                </td>
                <td className="px-2 py-1 align-top text-[17px] md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="transition-colors duration-300 hover:text-[#102135]"
                  >
                    +36 30 197 5338
                  </a>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-2 py-1 align-top text-[17px] opacity-80 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  Általános információk:
                </td>
                <td className="px-2 py-1 align-top text-[17px] md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <a
                    href={`mailto:${siteConfig.contact.emailGeneral}`}
                    className="transition-colors duration-300 hover:text-[#102135]"
                  >
                    info@vilagombafeszt.hu
                  </a>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-2 py-1 align-top text-[17px] opacity-80 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  Jegyinformációk:
                </td>
                <td className="px-2 py-1 align-top text-[17px] md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <a
                    href={`mailto:${siteConfig.contact.emailTickets}`}
                    className="transition-colors duration-300 hover:text-[#102135]"
                  >
                    jegy@vilagombafeszt.hu
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{ animationDelay: '0.3s' }}
        className="mb-[clamp(12px,2vh,24px)] mt-[clamp(20px,3vh,40px)] text-center opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
      >
        <a
          className="group/doc inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[clamp(16px,3.5vw,20px)] font-semibold text-[#ac9d9d] transition-colors duration-300 hover:text-[#102135] md:text-[clamp(14px,1.5vw,22px)]"
          href="/szuloi-nyilatkozat-vilagomba.pdf"
          download="szuloi-nyilatkozat-vilagomba.pdf"
        >
          <div className="relative mr-1 flex items-center justify-center">
            <Image
              src="/page_images/document.webp"
              alt="Szülői nyilatkozat"
              width={30}
              height={35}
              className="h-auto w-[24px] transition-opacity duration-300 group-hover/doc:opacity-0 md:w-[30px]"
              unoptimized
            />
            <Image
              src="/page_images/document_blue.webp"
              alt="Szülői nyilatkozat"
              width={30}
              height={35}
              className="absolute inset-0 h-auto w-[24px] opacity-0 transition-opacity duration-300 group-hover/doc:opacity-100 md:w-[30px]"
              unoptimized
            />
          </div>
          <span className="border-b-2 border-transparent transition-colors duration-300 group-hover/doc:border-[#102135]/50">
            Szülői nyilatkozat letöltése
          </span>
        </a>
      </div>

      <div
        style={{ animationDelay: '0.4s' }}
        className="w-full max-w-[1200px] text-center font-[family-name:var(--font-body)] text-[14px] text-[#ac9d9d] opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:text-[clamp(13px,1.4vw,20px)]"
      >
        © 2026 ViláGomba Fesztivál | Ántáresz Egyesület együttműködésével | Minden jog fenntartva
      </div>
    </ScrollRevealWrapper>
  );
}
