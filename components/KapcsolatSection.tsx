'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function KapcsolatSection() {
  const fbRef   = useRef<HTMLImageElement>(null);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    const el = fbRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSpin(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="section" id="kapcsolat">
      <div className="title">Kapcsolat</div>

      <div className="contacts">
        <div className="social-links">
          <a href="https://www.facebook.com/vilagombafeszt" target="_blank" rel="noopener noreferrer">
            <Image
              ref={fbRef}
              id="facebook-logo"
              src="/page_images/facebook.png"
              alt="Facebook esemény"
              width={150}
              height={150}
              className={spin ? 'spinIn' : ''}
              unoptimized
            />
          </a>
        </div>

        <div className="contact-info">
          <table>
            <tbody>
              <tr>
                <td>Telefon:</td>
                <td><a href="tel:+36301975338">+36 30 197 5338</a></td>
              </tr>
              <tr>
                <td>Általános információk:</td>
                <td><a href="mailto:info@vilagombafeszt.hu">info@vilagombafeszt.hu</a></td>
              </tr>
              <tr>
                <td>Jegyinformációk:</td>
                <td><a href="mailto:jegy@vilagombafeszt.hu">jegy@vilagombafeszt.hu</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="doc-download-wrapper">
        <a className="doc-download" href="/szuloi-nyilatkozat-vilagomba.pdf" download="szuloi-nyilatkozat-vilagomba.pdf">
          <Image
            src="/page_images/document.png"
            alt="Szülői nyilatkozat"
            width={30}
            height={35}
            style={{ marginRight: '5px', verticalAlign: 'middle' }}
            unoptimized
          />
          Szülői nyilatkozat letöltése
        </a>
      </div>

      <div className="copyright">
        © 2025 ViláGomba Fesztivál | Ántáresz Egyesület együttműködésével | Minden jog fenntartva
      </div>
    </div>
  );
}
