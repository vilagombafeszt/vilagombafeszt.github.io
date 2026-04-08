'use client';

import { useEffect } from 'react';

export function IosDetector() {
  useEffect(() => {
    const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isIos) {
      document.querySelector('.gombapp')?.classList.add('ios-device');
    }
  }, []);

  return null;
}
