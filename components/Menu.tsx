'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const SECTIONS = [
  { id: 'musor',                 desktopHash: '#Musor',                 label: 'Műsor',                   domId: 'artists'  },
  { id: 'jegyeket-berleteket',   desktopHash: '#Jegyeket-berleteket',   label: 'Jegyeket, Bérleteket!',   domId: 'tickets'  },
  { id: 'helyszin',              desktopHash: '#Helyszin',              label: 'Helyszín',                domId: 'place'    },
  { id: 'ez-ugy-volt',           desktopHash: '#Ez-ugy-volt',           label: 'Ez úgy volt...',          domId: 'story'    },
  { id: 'keptar',                desktopHash: '#Keptar',                label: 'Képtár',                  domId: 'gallery'  },
  { id: 'kapcsolat',             desktopHash: '#Kapcsolat',             label: 'Kapcsolat',               domId: 'coninfo'  },
] as const;

const LOGO_VAJ  = '/page_images/cimlogo_vaj.png';
const LOGO_KEK  = '/page_images/cimlogo_kek.png';

function smoothScrollTo(hash: string) {
  const id  = hash.startsWith('#') ? hash.slice(1) : hash;
  const el  = document.getElementById(id);
  if (!el) return;

  const menu     = document.querySelector<HTMLElement>('.menu');
  const offset   = window.innerWidth > 900 ? (menu?.offsetHeight ?? 0) : 0;
  const top      = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({ top, behavior: 'smooth' });

  if (history.pushState) history.pushState(null, '', hash);
}

export default function Menu() {
  const [logoSrc,      setLogoSrc]      = useState(LOGO_KEK);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const menuRef                         = useRef<HTMLDivElement>(null);

  /* ── update logo colour based on scroll position ─────────────────── */
  const handleScroll = useCallback(() => {
    // Only swap logo colours on mobile; desktop always uses kek
    if (window.innerWidth > 768) {
      setLogoSrc(LOGO_KEK);
      return;
    }

    const scroll  = window.scrollY;
    const musor   = document.getElementById('musor');
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
      // Delay to ensure all sections are rendered and laid out
      const timer = setTimeout(() => smoothScrollTo(hash), 150);
      return () => clearTimeout(timer);
    }
  }, []);

  /* ── close menu when viewport grows past the breakpoint ──────────── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) {
        setMenuOpen(false);
        // restore links that may have been hidden on mobile
        menuRef.current?.querySelectorAll<HTMLAnchorElement>('a[data-nav]').forEach((link) => {
          link.style.display = '';
          link.style.opacity = '';
          link.style.transition = '';
        });
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── close mobile menu when tapping outside ─────────────────────── */
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

  /* ── mobile menu: toggle menu-open class + lock body scroll ─────── */
  const scrollYRef = useRef(0);
  useEffect(() => {
    const nav = menuRef.current;
    if (!nav) return;
    if (menuOpen) {
      nav.classList.add('menu-open');
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      nav.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    const target = window.innerWidth >= 700 ? hash : hash.toLowerCase();
    if (window.innerWidth <= 900 && menuOpen) {
      setMenuOpen(false);
      // Wait for the useEffect to restore body position, then scroll
      setTimeout(() => smoothScrollTo(target), 60);
    } else {
      smoothScrollTo(target);
    }
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.innerWidth <= 900 && menuOpen) {
      setMenuOpen(false);
      setTimeout(() => smoothScrollTo('#Otthon'), 60);
    } else {
      smoothScrollTo('#Otthon');
    }
  };

  /* ── on mobile, tapping the logo toggles the menu ─────────────── */
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.innerWidth <= 768) {
      setMenuOpen((o) => !o);
    } else {
      smoothScrollTo('#Otthon');
    }
  };

  return (
    <nav className="menu" ref={menuRef}>
      {/* Logo — on mobile it toggles the menu, on desktop it scrolls to top */}
      <a href="#Otthon" className="menu-logo-link" onClick={handleLogoClick}>
        <Image
          className="menu-logo-img"
          src={logoSrc}
          alt="Világomba logo"
          width={45}
          height={45}
          unoptimized
        />
      </a>

      {/* Nav links — centered on desktop, stacked dropdown on mobile */}
      <a href="#Otthon" id="home" data-nav onClick={handleHomeClick}>
        Otthon
      </a>

      {SECTIONS.map(({ desktopHash, label, domId }) => (
        <a
          key={domId}
          href={desktopHash}
          id={domId}
          data-nav
          onClick={(e) => handleNavClick(e, desktopHash)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
