'use client';

import { useEffect, useRef, useState } from 'react';

const lineupData = {
  friday: [
    {
      time: '17:30',
      artist: 'Artur',
      instagram: 'https://www.instagram.com/arturmusicofficial/',
      facebook: 'https://www.facebook.com/arturmusicofficial/',
      spotify: 'https://open.spotify.com/artist/5zjlRer0EwBcz3uRO3ozed',
    },
    { time: '19:15', artist: 'Coming soon' },
    {
      time: '21:00',
      artist: 'Shakar Trio',
      instagram: 'https://www.instagram.com/shakartrio/',
      facebook: 'https://www.facebook.com/shakartrio/',
      spotify: 'https://open.spotify.com/artist/4uxMwBfvrUNDuhgWsWUZ6Z',
    },
    {
      time: '22:45',
      artist: 'AZNAP Projekt',
      instagram: 'https://www.instagram.com/aznapprojekt/',
      facebook: 'https://www.facebook.com/aznapprojekt/',
      spotify: 'https://open.spotify.com/artist/5nKpPdELRt9Ih7CIBegKWW',
    },
  ],
  saturday: [
    {
      time: '17:30',
      artist: 'Sildervald',
      instagram: 'https://www.instagram.com/sildervald/',
      facebook: 'https://www.facebook.com/sildervald/',
      spotify: 'https://open.spotify.com/artist/0PV2CgdfRFTa1VPzm85YpH',
    },
    {
      time: '19:15',
      artist: 'Várhegyutca',
      instagram: 'https://www.instagram.com/varhegyutca/',
      facebook: 'https://www.facebook.com/varhegyutca20',
      spotify: 'https://open.spotify.com/artist/5arfgRXgs0kQH9jQvLchda',
    },
    { time: '21:00', artist: 'Táncház' },
    {
      time: '22:45',
      artist: 'Héba',
      instagram: 'https://www.instagram.com/heba_zenekar/',
      facebook: 'https://www.facebook.com/hebazenekar/',
      spotify: 'https://open.spotify.com/artist/2WBZepnDyHGUAfIK4GdnYn',
    },
  ],
  sunday: [
    {
      time: '15:45',
      artist: 'Kvaterka',
      instagram: 'https://www.instagram.com/kvaterkaperka/',
      facebook: 'https://www.facebook.com/kvaterka/',
      spotify: 'https://open.spotify.com/artist/4saOqPzmr82yEkBYPjHjPH',
    },
    { time: '17:30', artist: 'Coming soon' },
    {
      time: '19:15',
      artist: 'Őri-Kiss Boti',
      instagram: 'https://www.instagram.com/okboti/',
      facebook: 'https://www.facebook.com/botondorikiss/',
      spotify: 'https://open.spotify.com/artist/3KDsNtTF0SG4Q7Wi9lIvu7',
    },
    {
      time: '21:00',
      artist: 'Semmi',
      instagram: 'https://www.instagram.com/semmizenekar/',
      facebook: 'https://www.facebook.com/semmizenekar/',
      spotify: 'https://open.spotify.com/artist/4zIEONFFlYdvj8DhUvbFVk',
    },
    {
      time: '22:45',
      artist: 'Kóc',
      instagram: 'https://www.instagram.com/koc_band/',
      facebook: 'https://www.facebook.com/Koczenekar/',
      spotify: 'https://open.spotify.com/artist/2VJp10XXnDl8OPf5iABe4p',
    },
  ],
};

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const SpotifyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C22 6.477 17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.805-.87 7.076-.496 9.714 1.115.294.18.387.563.208.853zm1.192-3.218c-.226.368-.707.49-1.072.265-2.68-1.644-6.78-2.126-9.965-1.163-.418.125-.853-.113-.978-.53-.126-.418.113-.853.53-.98 3.65-1.1 8.196-.566 11.22 1.294.366.225.49.706.265 1.072zm.12-3.376c-3.215-1.906-8.52-2.08-11.564-1.155-.5.15-1.015-.13-1.168-.63-.153-.5.128-1.014.628-1.168 3.515-1.066 9.38-.865 13.085 1.332.443.262.585.834.323 1.277-.26.442-.832.583-1.275.322z" />
  </svg>
);

function LineupList({
  items,
  isVisible,
  baseDelay,
}: {
  items: {
    time: string;
    artist: string;
    instagram?: string;
    facebook?: string;
    spotify?: string;
  }[];
  isVisible: boolean;
  baseDelay: number;
}) {
  return (
    <div className="relative mb-2 mt-4 flex w-full flex-col gap-3 md:mb-10 md:mt-8 md:gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            // Math for the staggered wave reveal
            animationDelay: isVisible ? `${baseDelay + index * 0.1}s` : '0s',
          }}
          className={`group relative flex flex-row items-center gap-3 rounded-2xl border border-white/5 bg-black/10 p-3 shadow-lg backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] sm:gap-4 sm:p-4 md:gap-6 ${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          {/* Time badge */}
          <div className="relative z-10 flex min-w-[60px] shrink-0 items-center justify-center rounded-xl bg-black/40 py-2 transition-transform duration-500 group-hover:scale-110 group-hover:bg-black/60 sm:min-w-[80px]">
            <span className="font-mono text-sm font-bold tracking-wider text-amber-500/90 sm:text-lg xl:text-base 2xl:text-lg">
              {item.time}
            </span>
          </div>

          {/* Artist flex container */}
          <div className="relative z-10 flex w-full min-w-0 flex-row items-center justify-between gap-2 sm:gap-3">
            <span className="flex-1 break-words font-[family-name:var(--font-body)] text-lg font-bold leading-tight tracking-wide text-[#ac9d9d] drop-shadow-sm transition-colors duration-300 group-hover:text-white sm:text-xl md:text-3xl xl:text-2xl 2xl:text-3xl">
              {item.artist}
            </span>

            {/* Social icons */}
            {(item.instagram || item.facebook || item.spotify) && (
              <div className="flex items-center gap-2 sm:gap-3">
                {item.instagram && (
                  <a
                    href={item.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-125 hover:bg-white/10 hover:text-pink-400"
                    aria-label={`${item.artist} Instagram`}
                  >
                    <InstagramIcon className="h-4 w-4 sm:h-5 sm:w-5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5" />
                  </a>
                )}
                {item.facebook && (
                  <a
                    href={item.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-125 hover:bg-white/10 hover:text-blue-400"
                    aria-label={`${item.artist} Facebook`}
                  >
                    <FacebookIcon className="h-4 w-4 sm:h-5 sm:w-5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5" />
                  </a>
                )}
                {item.spotify && (
                  <a
                    href={item.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-sm transition-all duration-300 hover:scale-125 hover:bg-white/10 hover:text-green-400"
                    aria-label={`${item.artist} Spotify`}
                  >
                    <SpotifyIcon className="h-4 w-4 sm:h-5 sm:w-5 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MusorSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation once the section is 10% visible on screen
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once it's triggered
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="musor"
      ref={sectionRef}
      className="landscape:max-h-[500px]:min-h-0 landscape:max-h-[500px]:pt-[80px] flex min-h-[100svh] w-full flex-col items-center bg-[#354b3d] px-[clamp(16px,5vw,80px)] pb-[clamp(24px,3vh,48px)] pt-[clamp(32px,3vh,56px)] text-[#ac9d9d] selection:bg-[#ac9d9d] selection:text-[#354b3d]"
    >
      {/* Main Title Reveal */}
      <h2
        className={`m-0 mb-[clamp(16px,3vh,40px)] text-center font-[family-name:var(--font-brand)] text-[clamp(30px,7vw,48px)] font-normal md:text-[clamp(28px,4.5vw,60px)] ${
          isVisible
            ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
            : 'opacity-0'
        }`}
      >
        Műsor
      </h2>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 md:gap-10 xl:flex-row xl:gap-4 2xl:gap-24">
        {/* Friday Column */}
        <div className="min-w-0 flex-1">
          <h3
            style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
            className={`mb-2 w-full border-b border-[#ac9d9d]/20 pb-2 text-center font-[family-name:var(--font-brand)] text-2xl text-[#ac9d9d] drop-shadow-md md:mb-6 md:pb-3 md:text-4xl ${
              isVisible
                ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
                : 'opacity-0'
            }`}
          >
            Péntek
          </h3>
          <LineupList items={lineupData.friday} isVisible={isVisible} baseDelay={0.2} />
        </div>

        {/* Saturday Column */}
        <div className="min-w-0 flex-1">
          <h3
            style={{ animationDelay: isVisible ? '0.3s' : '0s' }}
            className={`mb-2 w-full border-b border-[#ac9d9d]/20 pb-2 text-center font-[family-name:var(--font-brand)] text-2xl text-[#ac9d9d] drop-shadow-md md:mb-6 md:pb-3 md:text-4xl ${
              isVisible
                ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
                : 'opacity-0'
            }`}
          >
            Szombat
          </h3>
          <LineupList items={lineupData.saturday} isVisible={isVisible} baseDelay={0.4} />
        </div>

        {/* Sunday Column */}
        <div className="min-w-0 flex-1">
          <h3
            style={{ animationDelay: isVisible ? '0.5s' : '0s' }}
            className={`mb-2 w-full border-b border-[#ac9d9d]/20 pb-2 text-center font-[family-name:var(--font-brand)] text-2xl text-[#ac9d9d] drop-shadow-md md:mb-6 md:pb-3 md:text-4xl ${
              isVisible
                ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
                : 'opacity-0'
            }`}
          >
            Vasárnap
          </h3>
          <LineupList items={lineupData.sunday} isVisible={isVisible} baseDelay={0.6} />
        </div>
      </div>
    </section>
  );
}
