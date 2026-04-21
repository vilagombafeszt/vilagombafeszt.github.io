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
}: {
  items: {
    time: string;
    artist: string;
    instagram?: string;
    facebook?: string;
    spotify?: string;
  }[];
}) {
  return (
    <div className="relative mb-8 mt-4 flex w-full flex-col gap-3 md:mb-10 md:mt-8 md:gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative flex flex-row items-center gap-3 rounded-2xl border border-white/5 bg-black/10 p-3 shadow-lg backdrop-blur-md sm:gap-4 sm:p-4 md:gap-6"
        >
          {/* Time badge */}
          <div className="relative z-10 flex min-w-[60px] shrink-0 items-center justify-center rounded-xl bg-black/40 py-2 sm:min-w-[80px]">
            <span className="font-mono text-sm font-bold tracking-wider text-amber-500/90 sm:text-lg xl:text-base 2xl:text-lg">
              {item.time}
            </span>
          </div>

          {/* Artist flex container */}
          <div className="relative z-10 flex w-full min-w-0 flex-row items-center justify-between gap-2 sm:gap-3">
            <span className="flex-1 break-words font-body text-lg font-bold leading-tight tracking-wide text-accent drop-shadow-sm sm:text-xl md:text-3xl xl:text-2xl 2xl:text-3xl">
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
                    className="flex items-center justify-center rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/10 hover:text-pink-400"
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
                    className="flex items-center justify-center rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/10 hover:text-blue-400"
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
                    className="flex items-center justify-center rounded-full bg-white/5 p-2 text-white/70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/10 hover:text-green-400"
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
  return (
    <div className="section" id="musor">
      <div className="title">Műsor</div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-4 lg:flex-col xl:flex-row xl:gap-4 2xl:gap-24">
        <div className="min-w-0 flex-1">
          <div className="border-accent/20 mb-2 w-full border-b pb-2 text-center font-brand text-3xl text-accent drop-shadow-md md:mb-6 md:pb-3 md:text-4xl">
            Péntek
          </div>
          <LineupList items={lineupData.friday} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="border-accent/20 mb-2 w-full border-b pb-2 text-center font-brand text-3xl text-accent drop-shadow-md md:mb-6 md:pb-3 md:text-4xl">
            Szombat
          </div>
          <LineupList items={lineupData.saturday} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="border-accent/20 mb-2 w-full border-b pb-2 text-center font-brand text-3xl text-accent drop-shadow-md md:mb-6 md:pb-3 md:text-4xl">
            Vasárnap
          </div>
          <LineupList items={lineupData.sunday} />
        </div>
      </div>
    </div>
  );
}
