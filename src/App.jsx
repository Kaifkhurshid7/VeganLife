import { useEffect } from 'react';
import Lenis from 'lenis';
import Home from './pages/Home';
import { NoiseOverlay, ScrollIndicator } from './components/ui';
import { ParallaxLayers, FloatingLeaves, CursorTrail } from './components/ambient';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <ScrollIndicator />
      <NoiseOverlay />
      <ParallaxLayers />
      <FloatingLeaves count={6} />
      <CursorTrail />
      <Home />
    </>
  );
}
