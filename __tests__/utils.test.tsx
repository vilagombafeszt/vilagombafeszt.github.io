import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });
});

describe('rendering sanity check', () => {
  it('renders a simple element', () => {
    render(<p>ViláGomba Fesztivál</p>);
    expect(screen.getByText('ViláGomba Fesztivál')).toBeInTheDocument();
  });
});
