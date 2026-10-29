import { useState, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Mouse offset from the viewport centre, scaled down by `divisor`.
 * Used for the parallax drift in the hero and ambient layers.
 *
 * Two things this deliberately does:
 *
 * 1. Coalesces updates with requestAnimationFrame. The previous version called
 *    setState directly in the mousemove handler, so moving the cursor across the
 *    hero re-rendered it once per pointer event (easily 100+/second) instead of
 *    once per frame.
 * 2. Returns a frozen {0,0} when the user asks for reduced motion, and skips
 *    attaching the listener entirely — no parallax, no work.
 */
export function useMousePosition(divisor = 35) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const frame = useRef(null);
  const latest = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) {
      setPosition({ x: 0, y: 0 });
      return undefined;
    }

    // Fine-pointer only: on touch devices `mousemove` fires on tap and would
    // leave the parallax stuck at the tap position.
    if (window.matchMedia?.('(hover: none)').matches) return undefined;

    const flush = () => {
      frame.current = null;
      setPosition(latest.current);
    };

    const handleMouseMove = (e) => {
      latest.current = {
        x: (e.clientX - window.innerWidth / 2) / divisor,
        y: (e.clientY - window.innerHeight / 2) / divisor,
      };
      if (frame.current === null) frame.current = requestAnimationFrame(flush);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [divisor, prefersReducedMotion]);

  return position;
}
