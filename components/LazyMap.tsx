'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyMapProps {
  src: string;
  title: string;
}

export default function LazyMap({ src, title }: LazyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIframeSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: '1000px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={containerRef} className="relative h-full w-full bg-black/20">
      {/* ── Placeholder / Loading State ── */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex animate-pulse items-center justify-center text-[#ac9d9d]/40"
          role="status"
        >
          <span className="sr-only">Térkép betöltésre vár…</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-12 w-12"
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
      )}

      {/* ── Natively Styled Iframe ── */}
      {iframeSrc && (
        <iframe
          src={iframeSrc}
          title={title}
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ease-in ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </div>
  );
}
