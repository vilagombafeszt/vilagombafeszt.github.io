/**
 * Navigation utilities with i18n support (next-intl).
 *
 * Usage in components:
 *   import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation';
 *
 * These wrappers ensure locale-aware links and redirects when using
 * the [locale] route group structure.
 */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
