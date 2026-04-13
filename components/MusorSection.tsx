const lineupData = {
  friday: [
    { time: '17:30', artist: 'Artur' },
    { time: '19:15', artist: 'Coming soon' },
    { time: '21:00', artist: 'Shakar Trio' },
    { time: '22:45', artist: 'Coming soon' },
  ],
  saturday: [
    { time: '17:30', artist: 'Sildervald' },
    { time: '19:15', artist: 'Várhegyutca' },
    { time: '21:00', artist: 'Táncház' },
    { time: '22:45', artist: 'Héba' },
  ],
  sunday: [
    { time: '17:30', artist: 'Kvaterka' },
    { time: '19:15', artist: 'Őri-Kiss Boti' },
    { time: '21:00', artist: 'Semmi' },
    { time: '22:45', artist: 'Kóc' },
  ],
};

function LineupList({ items }: { items: { time: string; artist: string }[] }) {
  return (
    <div className="relative mb-8 mt-4 flex w-full flex-col gap-3 md:mb-10 md:mt-8 md:gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="hover:border-accent/40 group relative flex items-center gap-6 overflow-hidden rounded-2xl border border-white/5 bg-black/10 p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-black/30 hover:shadow-[0_8px_30px_rgba(172,157,157,0.15)]"
        >
          {/* Subtle hover gradient background */}
          <div className="from-accent/0 to-accent/5 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Time badge */}
          <div className="relative z-10 flex min-w-[70px] shrink-0 items-center justify-center rounded-xl bg-black/40 py-2 sm:min-w-[80px]">
            <span className="font-mono text-base font-bold tracking-wider text-amber-500/90 transition-colors group-hover:text-amber-400 sm:text-lg">
              {item.time}
            </span>
          </div>

          {/* Artist name */}
          <div className="relative z-10 flex w-full flex-col">
            <span className="font-body text-2xl font-bold tracking-wide text-accent drop-shadow-sm transition-all group-hover:text-white md:text-3xl">
              {item.artist}
            </span>
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

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-4 md:flex-row md:gap-8 lg:gap-16 xl:gap-32">
        <div className="flex-1">
          <div className="border-accent/20 mb-2 w-full border-b pb-2 text-center font-brand text-3xl text-accent drop-shadow-md md:mb-6 md:pb-3 md:text-4xl">
            Péntek
          </div>
          <LineupList items={lineupData.friday} />
        </div>

        <div className="flex-1">
          <div className="border-accent/20 mb-2 w-full border-b pb-2 text-center font-brand text-3xl text-accent drop-shadow-md md:mb-6 md:pb-3 md:text-4xl">
            Szombat
          </div>
          <LineupList items={lineupData.saturday} />
        </div>

        <div className="flex-1">
          <div className="border-accent/20 mb-2 w-full border-b pb-2 text-center font-brand text-3xl text-accent drop-shadow-md md:mb-6 md:pb-3 md:text-4xl">
            Vasárnap
          </div>
          <LineupList items={lineupData.sunday} />
        </div>
      </div>
    </div>
  );
}
