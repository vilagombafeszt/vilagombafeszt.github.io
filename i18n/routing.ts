import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['hu', 'en'],

  // Used when no locale matches
  defaultLocale: 'hu',

  // Use path-based routing: /hu/... and /en/...
  // The default locale does not have a prefix (i.e. / → /hu)
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];
