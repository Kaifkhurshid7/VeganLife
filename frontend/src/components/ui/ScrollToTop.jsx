import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll position on navigation.
 *
 * React Router doesn't do this for you, so before this component every route
 * change landed you wherever you happened to be scrolled on the previous page —
 * usually halfway down a new article.
 *
 * Two behaviours worth noting:
 * - A `#hash` target is left alone and scrolled into view instead, so the
 *   homepage anchor links (/#why-vegan) still work.
 * - Lenis hijacks scrolling, so we ask it to reset too when it's running.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target element exists after the route renders.
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
      return;
    }

    window.lenis?.scrollTo(0, { immediate: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}
