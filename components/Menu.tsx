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

  // Touch Drag State
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
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

  /* ── close mobile menu when tapping outside ──────────────────────── */
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  /* ── Interactive Drag-to-Close Handlers ──────────────────────────── */
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if (deltaY < 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragY < -60) {
      setMenuOpen(false);
    }

    setDragY(0);
  };

  /* ── Navigation Handlers ──────────────────────────────────────────── */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const target = window.innerWidth >= 700 ? hash : hash.toLowerCase();

    if (menuOpen) {
      setMenuOpen(false);
      // Fired almost instantly, just 10ms to let the body unlock so Safari allows scrolling
      setTimeout(() => smoothScrollTo(target), 10);
    } else {
      smoothScrollTo(target);
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(() => smoothScrollTo('#Otthon'), 10);
    } else {
      smoothScrollTo('#Otthon');
    }
  };

  const handleLogoClick = (
    e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.innerWidth <= 768) {
      if (menuOpen) {
        // ONLY close the menu on mobile if it is open (don't scroll)
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    } else {
      // On desktop, it acts as a normal "back to top" link
      smoothScrollTo('#Otthon');
    }
  };

  return (
    <nav className="pointer-events-none fixed left-0 top-0 z-[1000] w-full md:pointer-events-auto md:flex md:h-[72px] md:flex-row md:items-center md:justify-center md:bg-[var(--color-menu-bg)] md:px-5">
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 touch-none overscroll-none bg-black/40 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* The Anchor Logo */}
      <a
        href="#Otthon"
        onClick={handleLogoClick}
        onTouchEnd={handleLogoClick}
        className="pointer-events-auto absolute left-4 top-[max(16px,env(safe-area-inset-top))] z-[1050] select-none transition-transform duration-300 active:scale-90 md:left-[clamp(12px,3vw,32px)] md:top-1/2 md:-translate-y-1/2 md:hover:scale-110"
      >
        <Image
          src={menuOpen ? LOGO_KEK : logoSrc}
          alt="Világomba logo"
          width={45}
          height={45}
          unoptimized
          priority={true}
          className="block h-[44px] w-auto cursor-pointer drop-shadow-md md:h-[clamp(28px,3.5vw,44px)]"
        />
      </a>

      {/* Interactive Top Sheet */}
      <div
        ref={menuRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={
          {
            '--mobile-translate-y': isDragging ? `${dragY}px` : menuOpen ? '0px' : '-100%',
            boxShadow: menuOpen && !isDragging ? '0 40px 100px rgba(0,0,0,0.5)' : 'none',
          } as React.CSSProperties
        }
        className={`absolute left-0 right-0 top-0 z-[1010] flex translate-y-[var(--mobile-translate-y)] touch-none flex-col gap-2 rounded-b-[40px] bg-[#7c8bb1] px-6 pb-2 pt-[max(16px,env(safe-area-inset-top))] transition-all md:pointer-events-auto md:static md:w-auto md:translate-y-0 md:flex-row md:gap-[clamp(8px,1.5vw,28px)] md:rounded-none md:border-none md:bg-transparent md:p-0 md:opacity-100 md:shadow-none md:backdrop-blur-none ${
          isDragging ? 'duration-0' : 'duration-[500ms] ease-[cubic-bezier(0.32,0.72,0,1)]'
        } ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        {/* Nav Links */}
        <a
          href="#Otthon"
          id="home"
          onClick={handleHomeClick}
          style={{ transitionDelay: menuOpen && !isDragging ? '100ms' : '0ms' }}
          className={`flex h-[44px] w-full select-none items-center justify-center font-[family-name:var(--font-body)] text-[1.5rem] font-bold uppercase tracking-[3px] !text-[#102135] transition-all duration-[400ms] hover:!text-[#8b0000] active:scale-[0.96] active:opacity-70 md:h-auto md:w-auto md:bg-transparent md:py-0 md:text-[clamp(13px,1.4vw,22px)] md:font-semibold md:normal-case md:tracking-[1px] md:hover:scale-110 md:active:scale-100 ${
            menuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0 md:translate-y-0 md:opacity-100'
          }`}
        >
          Otthon
        </a>

        {SECTIONS.map(({ desktopHash, label, domId }, i) => (
          <a
            key={domId}
            href={desktopHash}
            id={domId}
            onClick={(e) => handleNavClick(e, desktopHash)}
            style={{ transitionDelay: menuOpen && !isDragging ? `${(i + 3) * 35}ms` : '0ms' }}
            className={`flex h-[44px] w-full select-none items-center justify-center font-[family-name:var(--font-body)] text-[1.5rem] font-bold uppercase tracking-[3px] !text-[#102135] transition-all duration-[400ms] hover:!text-[#8b0000] active:scale-[0.96] active:opacity-70 md:h-auto md:w-auto md:bg-transparent md:py-0 md:text-[clamp(13px,1.4vw,22px)] md:font-semibold md:normal-case md:tracking-[1px] md:hover:scale-110 md:active:scale-100 ${
              menuOpen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-4 opacity-0 md:translate-y-0 md:opacity-100'
            }`}
          >
            {label}
          </a>
        ))}

        {/* Tactile Drag Handle Pill */}
        <div className="mb-2 mt-4 flex w-full justify-center md:hidden">
          <div className="h-1.5 w-12 rounded-full bg-[#102135]/20" />
        </div>
      </div>
    </nav>
  );
}
