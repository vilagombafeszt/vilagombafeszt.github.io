'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const SECTIONS = [
  { id: 'musor', label: 'Műsor' },
  { id: 'jegyeket-berleteket', label: 'Jegyeket, Bérleteket!' },
  { id: 'helyszin', label: 'Helyszín' },
  { id: 'ez-ugy-volt', label: 'Ez úgy volt...' },
  { id: 'keptar', label: 'Képtár' },
  { id: 'kapcsolat', label: 'Kapcsolat' },
] as const;

const LOGO_VAJ = '/page_images/cimlogo_vaj.png';
const LOGO_KEK = '/page_images/cimlogo_kek.png';

function smoothScrollTo(id: string) {
  const elId = id.replace('#', '');
  const el = document.getElementById(elId);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (history.pushState) history.pushState(null, '', `#${elId}`);
}

export default function Menu() {
  const [logoSrc, setLogoSrc] = useState(LOGO_KEK);
  const [menuOpen, setMenuOpen] = useState(false);

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  /* ── Ultra-Performant Hit-Testing for Logo Color ─────────────────── */
  const handleScroll = useCallback(() => {
    // Desktop always uses the blue logo
    if (window.innerWidth > 768) {
      setLogoSrc(LOGO_KEK);
      return;
    }

    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const logoEl = document.getElementById('mobile-logo');
        if (logoEl) {
          const rect = logoEl.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;

          const elementsUnderLogo = document.elementsFromPoint(x, y);

          let foundTheme = 'kek';
          for (const el of elementsUnderLogo) {
            const theme = el.getAttribute('data-logo-theme');
            if (theme) {
              foundTheme = theme;
              break;
            }
          }

          setLogoSrc(foundTheme === 'vaj' ? LOGO_VAJ : LOGO_KEK);
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
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
      if (window.innerWidth > 900) setMenuOpen(false);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  /* ── mobile menu: lock body scroll (SAFARI SAFE) ────────────────── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
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
    setDragY(deltaY < 0 ? deltaY : 0);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY < -60) setMenuOpen(false);
    setDragY(0);
  };

  /* ── Navigation Handlers ──────────────────────────────────────────── */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(() => smoothScrollTo(id), 10);
    } else {
      smoothScrollTo(id);
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (menuOpen) {
      setMenuOpen(false);
      setTimeout(() => smoothScrollTo('otthon'), 10);
    } else {
      smoothScrollTo('otthon');
    }
  };

  const handleLogoClick = (
    e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      setMenuOpen(!menuOpen);
    } else {
      smoothScrollTo('otthon');
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
        id="mobile-logo"
        href="#otthon"
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
          href="#otthon"
          id="nav-home"
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

        {SECTIONS.map(({ id, label }, i) => (
          <a
            key={id}
            href={`#${id}`}
            id={`nav-${id}`}
            onClick={(e) => handleNavClick(e, id)}
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
