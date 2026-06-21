'use client';

export default function HeroSection() {
  return (
    <section
      id="otthon"
      className="relative flex min-h-[100svh] w-full items-center justify-center bg-[url('/page_images/IMG_1367.webp')] bg-cover bg-center selection:bg-[#7c8bb1] selection:text-black"
    >
      <div className="relative z-10 flex flex-col items-center gap-2 md:gap-4">
        {/* Main Title - Gently reduced from max 80px to 72px, and 7vw to 6vw */}
        <h1 className="m-0 animate-[fadeSlideUp_1.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards] font-[family-name:var(--font-brand)] text-[clamp(32px,6vw,72px)] font-normal text-[#7c8bb1] opacity-0 [text-shadow:0_4px_40px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.8)]">
          viláGomba
        </h1>

        {/* Date Subtitle - Gently reduced from max 36px to 32px, and 3vw to 2.5vw */}
        <h2 className="m-0 animate-[fadeSlideUp_1.2s_cubic-bezier(0.2,0.8,0.2,1)_0.3s_forwards] text-center font-[family-name:var(--font-brand)] text-[clamp(16px,2.5vw,32px)] tracking-[2px] text-[#7c8bb1] opacity-0 [text-shadow:0_4px_40px_rgba(0,0,0,1),0_0_15px_rgba(0,0,0,0.8)]">
          08.21. - 08.23.
        </h2>
      </div>
    </section>
  );
}
