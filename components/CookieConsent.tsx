'use client';

import { useEffect, useState, useCallback } from 'react';
import { getConsent, setConsent, loadGoogleAnalytics, type ConsentState } from '@/lib/analytics';

/* ── Cookie category definitions ──────────────────────────────── */

type CategoryKey = 'necessary' | 'functional' | 'analytics' | 'marketing';

interface CookieCategory {
  key: CategoryKey;
  label: string;
  description: string;
  required: boolean;
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    key: 'necessary',
    label: 'Feltétlenül szükséges sütik',
    description:
      'Ezek a sütik elengedhetetlenek a weboldal alapvető működéséhez és a biztonságos böngészéshez. Nem kapcsolhatók ki, de nem tárolnak személyes azonosításra alkalmas adatokat.',
    required: true,
  },
  {
    key: 'functional',
    label: 'Funkcionális sütik',
    description:
      'Ezeket a sütiket arra használjuk, hogy személyre szabottabb élményt nyújtsunk weboldalunkon, és hogy az oldal rögzítse a webhelyünk használata során tett döntéseket (például nyelvi beállítások).',
    required: false,
  },
  {
    key: 'analytics',
    label: 'Statisztikai és analitikai sütik',
    description:
      'Ezek segítségével mérjük fel a weboldal forgalmát és a látogatók interakcióit. Az így kapott anonim statisztikák alapján tudjuk folyamatosan fejleszteni az oldalt és a felhasználói élményt.',
    required: false,
  },
  {
    key: 'marketing',
    label: 'Célirányos és hirdetési sütik',
    description:
      'Ezek a sütik segítenek abban, hogy az érdeklődési körének megfelelő hirdetéseket jelenítsünk meg, illetve nyomon követhessük a marketing kampányaink hatékonyságát.',
    required: false,
  },
];

/* ── Toggle Switch ────────────────────────────────────────────── */

function Toggle({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-0 p-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 ${
        checked ? 'bg-yellow-400' : 'bg-white/20'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      style={{ border: 'none' }}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

/* ── Close Icon ───────────────────────────────────────────────── */

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Preferences Center (Modal) ───────────────────────────────── */

function PreferencesCenter({
  onClose,
  onSave,
  initialState,
}: {
  onClose: () => void;
  onSave: (state: ConsentState) => void;
  initialState: ConsentState;
}) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [state, setState] = useState<ConsentState>(initialState);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const tabs = [
    { key: 'overview', label: 'Adatvédelem' },
    ...COOKIE_CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex h-[85vh] w-full max-w-[720px] flex-col overflow-hidden rounded-3xl bg-[#1a1a1a] shadow-[0_20px_60px_rgba(0,0,0,0.8)] sm:h-[650px]">
        {/* Header */}
        <div className="flex flex-col px-6 pb-4 pt-5">
          <div className="flex items-center justify-between">
            <p className="font-[family-name:var(--font-brand)] text-base leading-none text-yellow-400 sm:text-lg">
              ViláGomba Fesztivál
            </p>
            <button
              onClick={onClose}
              className="-mr-2 -mt-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[#ac9d9d] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-95"
              style={{ border: 'none' }}
            >
              <CloseIcon />
            </button>
          </div>
          <h2 className="mt-2 font-[family-name:var(--font-body)] text-xl font-bold leading-tight text-white sm:text-2xl">
            Süti beállítások
          </h2>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-hidden border-t border-white/5 sm:flex-row">
          {/* Sidebar (tabs) */}
          <nav className="hidden w-[220px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-white/5 bg-black/20 p-2 sm:flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer rounded-xl border-0 px-4 py-3 text-left font-[family-name:var(--font-body)] text-base font-bold outline-none transition-all duration-200 sm:text-base ${
                  activeTab === tab.key
                    ? 'bg-white text-black shadow-md'
                    : 'bg-[#e5e5e5] text-black hover:bg-white hover:text-black'
                }`}
                style={{ border: 'none' }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Mobile tab selector */}
          <div className="border-b border-white/5 bg-black/20 p-4 sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full rounded-xl border-0 bg-[#e5e5e5] px-4 py-3.5 font-[family-name:var(--font-body)] text-base font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ border: 'none' }}
            >
              {tabs.map((tab) => (
                <option key={tab.key} value={tab.key} className="text-black">
                  {tab.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div>
                <h3 className="mb-4 font-[family-name:var(--font-body)] text-2xl font-bold text-white sm:text-2xl">
                  Az Ön adatainak védelme kiemelten fontos számunkra
                </h3>
                <p className="mb-4 font-[family-name:var(--font-body)] text-base leading-relaxed text-[#ac9d9d] sm:text-lg">
                  A sütik (cookie-k) olyan kisméretű szöveges fájlok, amelyeket a weboldal tárol el
                  az Ön böngészőjében. Ezeket azért használjuk, hogy biztosítsuk az oldal zavartalan
                  működését, és személyre szabottabb felhasználói élményt nyújtsunk.
                </p>
                <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[#ac9d9d] sm:text-lg">
                  Bármikor dönthet úgy, hogy módosítja a beállításait, és elutasítja bizonyos típusú
                  sütik használatát. Felhívjuk azonban a figyelmét, hogy bizonyos sütik letiltása
                  hatással lehet a weboldal megfelelő működésére és funkcióira.
                </p>
              </div>
            )}

            {COOKIE_CATEGORIES.map(
              (cat) =>
                activeTab === cat.key && (
                  <div key={cat.key}>
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <h3 className="font-[family-name:var(--font-body)] text-2xl font-bold leading-tight text-white sm:text-2xl">
                        {cat.label}
                      </h3>
                      <div className="flex shrink-0 items-center gap-3">
                        {cat.required && (
                          <span className="font-[family-name:var(--font-body)] text-sm font-semibold uppercase tracking-wide text-yellow-400/80 sm:text-sm">
                            Mindig aktív
                          </span>
                        )}
                        <Toggle
                          checked={cat.required ? true : state[cat.key as keyof ConsentState]}
                          disabled={cat.required}
                          onChange={(v) => {
                            if (!cat.required) {
                              setState((prev) => ({ ...prev, [cat.key]: v }));
                            }
                          }}
                        />
                      </div>
                    </div>
                    <p className="font-[family-name:var(--font-body)] text-base leading-relaxed text-[#ac9d9d] sm:text-lg">
                      {cat.description}
                    </p>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-white/10 bg-black/20 px-6 py-5">
          <button
            onClick={() => onSave(state)}
            className="cursor-pointer rounded-full border-0 bg-yellow-400 px-8 py-3.5 font-[family-name:var(--font-body)] text-base font-bold tracking-wide text-black shadow-[0_4px_14px_rgba(250,204,21,0.25)] transition-all duration-300 hover:bg-yellow-300 active:scale-95 sm:text-lg"
            style={{ border: 'none' }}
          >
            Beállítások mentése
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Cookie Consent Banner ───────────────────────────────── */

export default function CookieConsent() {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  useEffect(() => {
    const saved = getConsent();
    if (saved) {
      if (saved.analytics) {
        loadGoogleAnalytics();
      }
    } else {
      setBannerVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(() => setBannerVisible(false), 400);
  }, []);

  const handleAccept = useCallback(() => {
    setConsent('accepted');
    loadGoogleAnalytics();
    dismiss();
  }, [dismiss]);

  const handleReject = useCallback(() => {
    setConsent('rejected');
    dismiss();
  }, [dismiss]);

  const handleSavePrefs = useCallback(
    (newState: ConsentState) => {
      setConsent(newState);
      if (newState.analytics) loadGoogleAnalytics();
      setPrefsOpen(false);
      dismiss();
    },
    [dismiss]
  );

  if (!bannerVisible && !prefsOpen) return null;

  return (
    <>
      {/* ── Banner ── */}
      {bannerVisible && !prefsOpen && (
        <div
          className={`duration-400 fixed inset-x-0 bottom-0 z-[9999] transition-all ${
            dismissing
              ? 'translate-y-full opacity-0'
              : 'animate-[slideUp_0.5s_cubic-bezier(0.2,0.8,0.2,1)_forwards]'
          }`}
        >
          <div className="border-t border-white/10 bg-[#111111]/95 px-[clamp(20px,5vw,48px)] py-6 backdrop-blur-xl">
            <div className="mx-auto max-w-[900px]">
              <h3 className="mb-3 font-[family-name:var(--font-body)] text-2xl font-bold text-white sm:text-3xl">
                Ez a weboldal sütiket (cookie-kat) használ
              </h3>
              <p className="mb-5 font-[family-name:var(--font-body)] text-base leading-relaxed text-[#ac9d9d] sm:text-lg">
                Sütiket és hasonló nyomkövető technológiákat használunk a felhasználói élmény
                javítása, valamint a weboldal forgalmának elemzése érdekében. Ezzel biztosítjuk,
                hogy a fesztivál oldala a lehető legjobban működjön.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleAccept}
                  className="cursor-pointer rounded-full border-0 bg-yellow-400 px-6 py-2.5 font-[family-name:var(--font-body)] text-base font-bold tracking-wide text-black shadow-[0_4px_14px_rgba(250,204,21,0.25)] transition-all duration-300 hover:bg-yellow-300 active:scale-95 sm:px-8 sm:text-lg"
                  style={{ border: 'none' }}
                >
                  Elfogadom
                </button>
                <button
                  onClick={handleReject}
                  className="cursor-pointer rounded-full border-0 bg-white/5 px-6 py-2.5 font-[family-name:var(--font-body)] text-base font-bold tracking-wide text-white transition-all duration-200 hover:bg-white/10 active:scale-95 sm:px-8 sm:text-lg"
                  style={{ border: 'none' }}
                >
                  Elutasítom
                </button>
                <button
                  onClick={() => setPrefsOpen(true)}
                  className="cursor-pointer rounded-full border-0 bg-transparent px-6 py-2.5 font-[family-name:var(--font-body)] text-base font-bold tracking-wide text-[#ac9d9d] transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-95 sm:px-8 sm:text-lg"
                  style={{ border: 'none' }}
                >
                  Beállítások megváltoztatása
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Preferences Center ── */}
      {prefsOpen && (
        <PreferencesCenter
          onClose={() => setPrefsOpen(false)}
          onSave={handleSavePrefs}
          initialState={
            (getConsent() as ConsentState) || {
              analytics: false,
              functional: false,
              marketing: false,
            }
          }
        />
      )}
    </>
  );
}
