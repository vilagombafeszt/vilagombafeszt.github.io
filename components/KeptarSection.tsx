'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

function useRandomImage(jsonUrl: string, folder: string) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    fetch(jsonUrl)
      .then<string[]>((r) => r.json())
      .then((files) => {
        if (files && files.length > 0) {
          const idx = Math.floor(Math.random() * files.length);
          setSrc(`/${folder}/${files[idx]}`);
        }
      })
      .catch(console.error);
  }, [jsonUrl, folder]);

  return src;
}

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

export default function KeptarSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>();

  const album1Src = useRandomImage('/images.json', 'index_pictures');
  const album2Src = useRandomImage('/images2.json', 'index_pictures2');

  return (
    <section
      id="keptar"
      data-logo-theme="vaj"
      ref={sectionRef}
      className="landscape:max-h-[500px]:min-h-0 landscape:max-h-[500px]:pt-[80px] flex min-h-[100svh] w-full flex-col items-center bg-[#253529] px-[clamp(16px,5vw,80px)] pb-[clamp(24px,3vh,48px)] pt-[clamp(32px,3vh,56px)] text-center text-[#ac9d9d] selection:bg-[#ac9d9d] selection:text-[#253529]"
    >
      <h2
        className={`m-0 mb-[clamp(24px,5vh,48px)] text-center font-[family-name:var(--font-brand)] text-[clamp(30px,7vw,48px)] font-normal md:text-[clamp(28px,4.5vw,60px)] lg:mb-[clamp(24px,5vh,64px)] ${
          isVisible
            ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
            : 'opacity-0'
        }`}
      >
        Képtár
      </h2>

      <div className="grid w-full max-w-[700px] grid-cols-1 gap-10 lg:max-w-[1400px] lg:grid-cols-2 lg:gap-[clamp(24px,3vw,48px)]">
        <a
          href="https://photos.app.goo.gl/5kMuzpd7iqXdGfGV7"
          target="_blank"
          rel="noopener noreferrer"
          style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
          className={`group relative block overflow-hidden rounded-2xl border-2 border-[#ac9d9d] shadow-[0_30px_60px_rgba(0,0,0,0.6),0_15px_25px_rgba(0,0,0,0.4)] ${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          {album1Src && (
            <Image
              src={album1Src}
              alt="Világomba 2024"
              width={800}
              height={600}
              unoptimized
              loading="lazy"
              className="group-hover:saturate-125 block aspect-[16/9] h-auto w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-rotate-1 group-hover:scale-110 md:aspect-[16/10]"
            />
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap bg-black/20 font-[family-name:var(--font-body)] text-[clamp(28px,8vw,44px)] font-bold tracking-wide text-[#ac9d9d] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] [text-shadow:2px_2px_8px_rgba(0,0,0,0.7)] group-hover:bg-black/40 group-hover:tracking-[clamp(4px,1vw,10px)] group-hover:text-white md:text-[clamp(28px,4.5vw,64px)]">
            ViláGomba 2024
          </div>
        </a>

        <a
          href="https://photos.app.goo.gl/njhqn6NmA3wEk73H7"
          target="_blank"
          rel="noopener noreferrer"
          style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
          className={`group relative block overflow-hidden rounded-2xl border-2 border-[#ac9d9d] shadow-[0_30px_60px_rgba(0,0,0,0.6),0_15px_25px_rgba(0,0,0,0.4)] ${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          {album2Src && (
            <Image
              src={album2Src}
              alt="Világomba 2025"
              width={800}
              height={600}
              unoptimized
              loading="lazy"
              className="group-hover:saturate-125 block aspect-[16/9] h-auto w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-rotate-1 group-hover:scale-110 md:aspect-[16/10]"
            />
          )}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap bg-black/20 font-[family-name:var(--font-body)] text-[clamp(28px,8vw,44px)] font-bold tracking-wide text-[#ac9d9d] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] [text-shadow:2px_2px_8px_rgba(0,0,0,0.7)] group-hover:bg-black/40 group-hover:tracking-[clamp(4px,1vw,10px)] group-hover:text-white md:text-[clamp(28px,4.5vw,64px)]">
            ViláGomba 2025
          </div>
        </a>
      </div>

      <div
        style={{ animationDelay: isVisible ? '0.35s' : '0s' }}
        className={`mt-[clamp(36px,6vh,80px)] font-[family-name:var(--font-body)] text-[clamp(17px,4vw,22px)] font-semibold text-[#ac9d9d] md:text-[clamp(18px,2vw,28px)] ${
          isVisible
            ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
            : 'opacity-0'
        }`}
      >
        Kattints a képre a teljes galéria megtekintéséhez!
      </div>

      <div
        style={{ animationDelay: isVisible ? '0.45s' : '0s' }}
        className={`mt-2 flex w-full items-center justify-center font-[family-name:var(--font-body)] text-[clamp(16px,3.5vw,20px)] font-semibold text-[#ac9d9d] md:text-[clamp(16px,1.8vw,26px)] ${
          isVisible
            ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
            : 'opacity-0'
        }`}
      >
        <span>Képeket készítette:&nbsp;</span>
        <a
          href="https://www.instagram.com/g.adam.llery/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center whitespace-nowrap text-[#ac9d9d] transition-colors duration-300 hover:text-white"
        >
          <InstagramIcon className="mx-1.5 mb-[1px] h-[0.8em] w-[0.8em]" /> Kovács Ádám
        </a>
      </div>
    </section>
  );
}
