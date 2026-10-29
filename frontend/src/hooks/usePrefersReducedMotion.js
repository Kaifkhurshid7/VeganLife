import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the OS "reduce motion" setting.
 *
 * The CSS guard in global.css handles CSS animations and transitions, but this
 * site also drives motion from JavaScript (Framer Motion, GSAP, Lenis smooth
 * scroll, and the ambient canvas layers). Those need to opt out in JS, which is
 * what this hook is for.
 *
 * It listens for changes rather than reading once, so toggling the OS setting
 * takes effect without a reload.
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const mql = window.matchMedia(QUERY);
    const onChange = (event) => setPrefersReduced(event.matches);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}
