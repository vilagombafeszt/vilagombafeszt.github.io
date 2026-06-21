'use client';

import { useEffect, useRef, useState } from 'react';

export default function EzUgyVoltSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
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
      id="ez-ugy-volt"
      ref={sectionRef}
      className="landscape:max-h-[500px]:min-h-0 landscape:max-h-[500px]:pt-[80px] flex min-h-[100svh] w-full flex-col items-center bg-[#474738] px-[clamp(16px,5vw,80px)] pb-[clamp(24px,3vh,48px)] pt-[clamp(32px,3vh,56px)] text-center text-[#ac9d9d] selection:bg-[#ac9d9d] selection:text-[#474738]"
    >
      {/* Title Reveal */}
      <h2
        className={`m-0 mb-[clamp(16px,3vh,40px)] text-center font-[family-name:var(--font-brand)] text-[clamp(30px,7vw,48px)] font-normal md:text-[clamp(28px,4.5vw,60px)] ${
          isVisible
            ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
            : 'opacity-0'
        }`}
      >
        Ez úgy volt...
      </h2>

      {/* Staggered Text Blocks */}
      {/* Reduced base gap from gap-6 to gap-4 for mobile, kept md:gap-8 for larger screens */}
      <div className="flex w-full max-w-[1060px] flex-col items-center gap-4 font-[family-name:var(--font-body)] text-[clamp(18px,4.5vw,24px)] font-semibold leading-[1.7] tracking-wide md:gap-8 md:text-[clamp(16px,1.8vw,28px)]">
        <p
          style={{ animationDelay: isVisible ? '0.1s' : '0s' }}
          className={`${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          Szép napokat!
          <br />
          <br />
          Építkezünk, készülődünk, gyülekezünk, megbeszélünk, szervezkedünk, folytatódunk. Hangulat
          várható, kiváló zenészek, ételek még mindig finomak, pultunk is, csak ahogy szeretjük. Egy
          picivel több program, gyökértelenített sátorozás és reméljük, hogy melegebb időjárás.
          Ilyenek. Gyertek minél többen, hozzátok el a barátaitokat is, a további részletekkel pedig
          folyamatosan jelentkezünk!
        </p>

        <p
          style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
          className={`${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          Ezúton is szeretnénk megköszönni először is a helyszínadóinknak, hogy megtarthattuk a
          második fesztiválunkat ezen a csodás helyen! Hálával tartozunk továbbá az összes előadónak
          a fantasztikus koncertekért, előadásokért és színdarabokért, valamint a segítő kezeknek,
          akik önzetlenül rengeteg energiát raktak bele ügyünkbe. Végül, de nem utolsó sorban
          szeretnénk megköszönni Nektek, akik eljöttetek, és megelőlegeztétek nekünk a bizalmat!
        </p>

        <p
          style={{ animationDelay: isVisible ? '0.3s' : '0s' }}
          className={`${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          Ha még nem hallottál a fesztiválunkról, kezdők vagyunk, egyetemista fiatalok, akik
          szeretnek együtt lenni és lelkileg építkezni. Erre alkalmas eseménynek bizonyult egy kis
          létszámú fesztivál rendezése, amiben az érdeklődési körök kibontakoztatását, ismerkedést a
          jövőben felmerülő élethelyzetekkel, a hagyomány megélését, környezettudatosságot és a
          fenntartható életmódot próbáljuk a legjobb tehetségünk szerint Elétek tárni. Ha bármi
          kérdés felmerül, nyugodtan írjatok nekünk Facebookon, Instagramon, e-mailen vagy akár
          hívjatok fel!
        </p>

        <p
          style={{ animationDelay: isVisible ? '0.4s' : '0s' }}
          className={`${
            isVisible
              ? 'animate-[fadeSlideUp_0.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards] opacity-0'
              : 'opacity-0'
          }`}
        >
          Találkozunk Zebegényben 2026. augusztus 21-én! Várunk Titeket!
          <br />
          <br />
          <span className="opacity-90">A ViláGomba csapata</span>
        </p>
      </div>
    </section>
  );
}
