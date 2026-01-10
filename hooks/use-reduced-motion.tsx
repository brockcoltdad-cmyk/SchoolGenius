"use client";

import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

export function useAnimationConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    shouldAnimate: !prefersReducedMotion,
    duration: prefersReducedMotion ? 0 : undefined,
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { type: 'spring', stiffness: 400, damping: 30 }
  };
}

interface ConditionalAnimationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ConditionalAnimation({ children, fallback }: ConditionalAnimationProps) {
  const { shouldAnimate } = useAnimationConfig();

  if (!shouldAnimate && fallback) {
    return <>{fallback}</>;
  }

  if (!shouldAnimate) {
    return <div className="motion-reduce:transform-none">{children}</div>;
  }

  return <>{children}</>;
}
