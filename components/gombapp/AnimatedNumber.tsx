'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (val: number) => string;
}

export function AnimatedNumber({ value, duration = 400, format }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(value);
  const endValue = useRef(value);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // If the value hasn't changed, do nothing
    if (value === endValue.current) return;

    // Starting a new animation
    startValue.current = displayValue;
    endValue.current = value;
    startTime.current = null;

    // Cancel any ongoing animation
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo curve for smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentVal = Math.round(
        startValue.current + (endValue.current - startValue.current) * easeProgress
      );
      setDisplayValue(currentVal);

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [value, duration]);

  return <span>{format ? format(displayValue) : displayValue}</span>;
}
