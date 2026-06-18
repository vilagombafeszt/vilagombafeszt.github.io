'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const SECTIONS = [
  { id: 'musor', desktopHash: '#Musor', label: 'Műsor', domId: 'artists' },
  {
    id: 'jegyeket-berleteket',
    desktopHash: '#Jegyeket-berleteket',
    label: 'Jegyeket, Bérleteket!',
    domId: 'tickets',
  },
  { id: 'helyszin', desktopHash: '#Helyszin', label: 'Helyszín', domId: 'place' },
  { id: 'ez-ugy-volt', desktopHash: '#Ez-ugy-volt', label: 'Ez úgy volt...', domId: 'story' },
  { id: 'keptar', desktopHash: '#Keptar', label: 'Képtár', domId: 'gallery' },
  { id: 'kapcsolat', desktopHash: '#Kapcsolat', label: 'Kapcsolat', domId: 'coninfo' },
] as const;

const LOGO_VAJ = '/page_images/cimlogo_vaj.png';
const LOGO_KEK = '/page_images/cimlogo_kek.png';

function smoothScrollTo(hash: string) {
  const id = hash.startsWith('#') ? hash.slice(1) : hash;
  const el = document.getElementById(id);
  if (!el) return;

  const menu = document.querySelector<HTMLElement>('nav');
  const offset = window.innerWidth > 900 ? (menu?.offsetHeight ?? 0) : 0;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: 'smooth' });

  if (history.pushState) history.pushState(null, '', hash);
}

export default function Menu() {
  const [logoSrc, setLogoSrc] = useState(LOGO_KEK);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* ── update logo colour based on scroll position ─────────────────── */
  const handleScroll = useCallback(() => {
    if (window.innerWidth > 768) {
      setLogoSrc(LOGO_KEK);
      return;
    }

    const scroll = window.scrollY;
    const musor = document.getElementById('musor');
    const kapcsolat = document.getElementById('kapcsolat');

    if (!musor || !kapcsolat) return;

    const beforeMusor = scroll < musor.offsetTop;
    setLogoSrc(beforeMusor ? LOGO_KEK : LOGO_VAJ);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── scroll to hash anchor on page load / refresh ────────────────── */
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const timer = setTimeout(() => smoothScrollTo(hash), 150);
      return () => clearTimeout(timer);
    }
  }, []);

  /* ── close menu when viewport grows past the breakpoint ──────────── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
      }
      handleScroll();
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [handleScroll]);

  /* ── close mobile menu when tapping outside (Fallback for desktop) ─ */
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  /* ── mobile menu: lock body scroll (SAFARI SAFE) ────────────────── */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const target = window.innerWidth >= 700 ? hash : hash.toLowerCase();
    if (window.innerWidth <= 900 && menuOpen) {
      setMenuOpen(false);
      setTimeout(() => smoothScrollTo(target), 300);
    } else {
      smoothScrollTo(target);
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.innerWidth <= 900 && menuOpen) {
      setMenuOpen(false);
      setTimeout(() => smoothScrollTo('#Otthon'), 300);
    } else {
      smoothScrollTo('#Otthon');
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.innerWidth <= 768) {
      if (menuOpen) {
        setMenuOpen(false);
        setTimeout(() => smoothScrollTo('#Otthon'), 300);
      } else {
        setMenuOpen(true);
      }
    } else {
      smoothScrollTo('#Otthon');
    }
  };

  return (
    <nav
      ref={menuRef}
      className="pointer-events-none fixed left-0 top-0 z-[1000] w-full md:pointer-events-auto md:flex md:h-[72px] md:flex-row md:items-center md:justify-center md:bg-[var(--color-menu-bg)] md:px-5"
    >
      {/* Mobile Backdrop Overlay - Absorbs swipes securely */}
      <div
        className={`duration-400 fixed inset-0 touch-none overscroll-none bg-black/30 backdrop-blur-sm transition-opacity md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Logo Toggle: Stripped of clunky borders, acts as pure geometric header */}
      <a
        href="#Otthon"
        onClick={handleLogoClick}
        className={`pointer-events-auto absolute z-[1020] select-none transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-90 md:left-[clamp(12px,3vw,32px)] md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:scale-100 md:hover:scale-110 ${
          menuOpen
            ? 'left-1/2 top-8 -translate-x-1/2 scale-125 drop-shadow-xl'
            : 'left-4 top-4 translate-x-0 scale-100 drop-shadow-sm'
        }`}
      >
        <Image
          src={menuOpen ? LOGO_KEK : logoSrc}
          alt="Világomba logo"
          width={45}
          height={45}
          unoptimized
          priority={true}
          className="block h-[44px] w-auto cursor-pointer md:h-[clamp(28px,3.5vw,44px)]"
        />
      </a>

      {/* Unified Geometric Glass Card */}
      <div
        className={`absolute left-4 right-4 top-4 z-[1010] grid grid-cols-2 gap-3 rounded-[32px] border border-white/40 bg-[#7c8bb1]/95 px-4 pb-4 pt-[88px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:pointer-events-auto md:static md:flex md:w-auto md:translate-y-0 md:scale-100 md:flex-row md:gap-[clamp(8px,1.5vw,28px)] md:rounded-none md:border-none md:bg-transparent md:p-0 md:opacity-100 md:shadow-none md:backdrop-blur-none ${
          menuOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-8 scale-95 opacity-0'
        }`}
      >
        {/* Full Width Home Button */}
        <a
          href="#Otthon"
          id="home"
          onClick={handleHomeClick}
          className="col-span-2 flex h-14 w-full select-none items-center justify-center rounded-[20px] bg-white/40 text-center font-[family-name:var(--font-body)] text-[1.4rem] font-bold tracking-[2px] !text-[#102135] shadow-sm ring-1 ring-white/50 transition-all duration-200 hover:!text-[#8b0000] active:scale-95 md:col-span-1 md:h-auto md:w-auto md:bg-transparent md:text-[clamp(13px,1.4vw,22px)] md:font-semibold md:normal-case md:tracking-[1px] md:shadow-none md:ring-0 md:hover:scale-110"
        >
          Otthon
        </a>

        {/* 2-Column Grid Sections */}
        {SECTIONS.map(({ desktopHash, label, domId }) => (
          <a
            key={domId}
            href={desktopHash}
            id={domId}
            onClick={(e) => handleNavClick(e, desktopHash)}
            className="flex h-[4rem] w-full select-none items-center justify-center rounded-[20px] bg-white/20 px-2 text-center font-[family-name:var(--font-body)] text-[1.25rem] font-bold leading-tight tracking-[1px] !text-[#102135] shadow-sm ring-1 ring-white/30 transition-all duration-200 hover:!text-[#8b0000] active:scale-95 md:h-auto md:w-auto md:bg-transparent md:px-0 md:text-[clamp(13px,1.4vw,22px)] md:font-semibold md:tracking-[1px] md:shadow-none md:ring-0 md:hover:scale-110"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
