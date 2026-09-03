export const siteConfig = {
  features: {
    showPromoToast: false,
    showCountdown: false,
  },
  /** Festival start date/time (local time in Hungary) */
  festivalDate: '2026-08-21T16:00:00+02:00',
  /** Festival end date/time */
  festivalEndDate: '2026-08-23T23:59:59+02:00',
  /** The year of the current festival edition */
  festivalYear: '2026',
  /** Formatted string for UI displays (e.g. Hero, Footer) */
  festivalDateString: '08.21. - 08.23.',
  /** Date string for GombApp Programs (start/end in YYYYMMDD format) */
  gombappProgramsDates: ['20260821', '20260822', '20260823'],
  socials: {
    facebook: 'https://www.facebook.com/vilagombafeszt',
    instagram: 'https://www.instagram.com/vilagombafeszt/',
  },
  contact: {
    phone: '+36301975338',
    emailGeneral: 'info@vilagombafeszt.hu',
    emailTickets: 'jegy@vilagombafeszt.hu',
  },
  externalLinks: {
    ticketSales: 'https://www.tixa.hu/vilagomba-2026',
  },
};
