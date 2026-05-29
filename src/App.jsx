import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Home from './pages/Home';
import NoiseOverlay from './components/UI/NoiseOverlay';
import ScrollIndicator from './components/UI/ScrollIndicator';

export default function App() {
  useEffect(() => {
    // Initialize premium buttery-smooth Lenis scrolling
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ScrollIndicator />
      <NoiseOverlay />
      <Home />
    </>
  );
}