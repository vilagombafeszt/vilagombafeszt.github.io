import Image from 'next/image';
import ScrollRevealWrapper from './ScrollRevealWrapper';
import CopyButton from './CopyButton';
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
              <tr className="contact-row cursor-pointer transition-colors duration-300">
                <td className="contact-text whitespace-nowrap px-2 py-1 align-top text-[17px] opacity-80 transition-all duration-300 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <span className="contact-trigger inline-block">Telefon:</span>
                </td>
                <td className="contact-text px-2 py-1 align-top text-[17px] opacity-80 transition-all duration-300 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <span className="contact-trigger inline-block">
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="contact-link outline-none transition-colors duration-300"
                    >
                      +36 30 197 5338
                    </a>
                  </span>
                </td>
              </tr>
              <tr className="contact-row cursor-pointer transition-colors duration-300">
                <td className="contact-text whitespace-nowrap px-2 py-1 align-top text-[17px] opacity-80 transition-all duration-300 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <span className="contact-trigger inline-block">Általános információk:</span>
                </td>
                <td className="contact-text px-2 py-1 align-top text-[17px] opacity-80 transition-all duration-300 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <span className="contact-trigger inline-flex items-center gap-2.5">
                    <a
                      href={`mailto:${siteConfig.contact.emailGeneral}`}
                      className="contact-link outline-none transition-colors duration-300"
                    >
                      info@vilagombafeszt.hu
                    </a>
                    <CopyButton text={siteConfig.contact.emailGeneral} />
                  </span>
                </td>
              </tr>
              <tr className="contact-row cursor-pointer transition-colors duration-300">
                <td className="contact-text whitespace-nowrap px-2 py-1 align-top text-[17px] opacity-80 transition-all duration-300 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <span className="contact-trigger inline-block">Jegyinformációk:</span>
                </td>
                <td className="contact-text px-2 py-1 align-top text-[17px] opacity-80 transition-all duration-300 md:px-2.5 md:py-1.5 md:text-[clamp(14px,1.5vw,22px)]">
                  <span className="contact-trigger inline-flex items-center gap-2.5">
                    <a
                      href={`mailto:${siteConfig.contact.emailTickets}`}
                      className="contact-link outline-none transition-colors duration-300"
                    >
                      jegy@vilagombafeszt.hu
                    </a>
                    <CopyButton text={siteConfig.contact.emailTickets} />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{ animationDelay: '0.3s' }}
        className="mb-[clamp(12px,2vh,24px)] mt-[clamp(8px,1.5vh,16px)] text-center opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
      >
        <a
          className="group/doc inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[clamp(16px,3.5vw,20px)] font-semibold text-[#ac9d9d] transition-colors duration-300 hover:text-white md:text-[clamp(14px,1.5vw,22px)]"
          href="/szuloi-nyilatkozat-vilagomba.pdf"
          download="szuloi-nyilatkozat-vilagomba.pdf"
        >
          <div className="relative mr-1 flex items-center justify-center">
            <div
              className="h-[30px] w-[24px] bg-[#ac9d9d] transition-colors duration-300 group-hover/doc:bg-white md:h-[35px] md:w-[30px]"
              style={{
                WebkitMaskImage: 'url(/page_images/document.webp)',
                WebkitMaskSize: 'contain',
                WebkitMaskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskImage: 'url(/page_images/document.webp)',
                maskSize: 'contain',
                maskPosition: 'center',
                maskRepeat: 'no-repeat',
              }}
            />
          </div>
          <span className="border-b border-transparent transition-colors duration-300 group-hover/doc:border-white/30">
            Szülői nyilatkozat letöltése
          </span>
        </a>
      </div>

      <h3
        style={{ animationDelay: '0.35s' }}
        className="m-0 mb-[clamp(12px,2vh,24px)] mt-[clamp(32px,5vh,64px)] text-center font-[family-name:var(--font-brand)] text-[clamp(18px,4vw,28px)] font-normal opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:text-[clamp(18px,2.5vw,32px)]"
      >
        Támogatók
      </h3>

      <div
        style={{ animationDelay: '0.4s' }}
        className="mb-[clamp(24px,4vh,48px)] flex items-center justify-center opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
      >
        <a
          href="https://dumaszinhaz.hu/"
          target="_blank"
          rel="noopener noreferrer"
          className="group/sponsor inline-block"
        >
          <Image
            src="/page_images/dumaszinhaz_logo.webp"
            alt="Dumaszínház"
            width={200}
            height={80}
            className="h-auto w-[150px] transition-all duration-300 ease-out group-hover/sponsor:scale-110 group-hover/sponsor:brightness-125 md:w-[200px]"
            unoptimized
          />
        </a>
      </div>

      <div
        style={{ animationDelay: '0.5s' }}
        className="w-full max-w-[1200px] text-center font-[family-name:var(--font-body)] text-[14px] text-[#ac9d9d] opacity-0 group-data-[visible=true]:animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] md:text-[clamp(13px,1.4vw,20px)]"
      >
        © {siteConfig.festivalYear} ViláGomba Fesztivál | Ántáresz Egyesület együttműködésével |
        Minden jog fenntartva
      </div>
    </ScrollRevealWrapper>
  );
}
