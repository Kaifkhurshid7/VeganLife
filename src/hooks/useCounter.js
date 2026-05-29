import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

/**
 * Animated counter that triggers when element enters viewport.
 * Handles comma-formatted numeric strings (e.g. "15,400").
 */
export function useCounter(value, duration = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;

    const numericValue = parseFloat(value.replace(/,/g, ''));
    if (isNaN(numericValue)) {
      setCount(value);
      return;
    }

    const fps = 60;
    const increment = numericValue / (duration * fps);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        clearInterval(timer);
        setCount(value);
      } else {
        setCount(Math.floor(current).toLocaleString());
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return { ref, count };
}
