'use client';

import { useEffect, useRef, useState } from 'react';

interface LazyMapProps {
  src: string;
  title: string;
}

export default function LazyMap({ src, title }: LazyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

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
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={containerRef} className="lazy-map-wrapper">
      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          title={title}
          width="800"
          height="600"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(true)}
        />
      ) : null}
      {!loaded && (
        <div className="lazy-map-placeholder" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="48"
            height="48"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
      )}
    </div>
  );
}
