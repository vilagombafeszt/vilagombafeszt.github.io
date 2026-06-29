'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ReactNode } from 'react';

interface ScrollRevealWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  dataLogoTheme?: string;
}

export default function ScrollRevealWrapper({
  children,
  id,
  className,
  dataLogoTheme,
}: ScrollRevealWrapperProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section
      id={id}
      data-logo-theme={dataLogoTheme}
      ref={ref}
      className={`group ${className || ''}`}
      data-visible={isVisible ? 'true' : 'false'}
    >
      {children}
    </section>
  );
}
