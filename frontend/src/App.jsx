import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import WorldMap from './pages/WorldMap';
import Infographic from './pages/Infographic';
import SeasonalProduce from './pages/SeasonalProduce';
import Compare from './pages/Compare';
import SavingsCalculator from './pages/SavingsCalculator';
import Auth from './pages/Auth';
import Community from './pages/Community';
import Admin from './pages/Admin';
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
    <BrowserRouter>
      <AuthProvider>
        <ScrollIndicator />
        <NoiseOverlay />
        <ParallaxLayers />
        <FloatingLeaves count={6} />
        <CursorTrail />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/world-map" element={<WorldMap />} />
          <Route path="/infographic" element={<Infographic />} />
          <Route path="/seasonal" element={<SeasonalProduce />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/savings" element={<SavingsCalculator />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
