import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SplashScreen from './components/ui/SplashScreen';
import PageTransition from './components/ui/PageTransition';
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
import Profile from './pages/Profile';
import Hashtag from './pages/Hashtag';
import NotFound from './pages/NotFound';
import { NoiseOverlay, ScrollIndicator } from './components/ui';
import { ParallaxLayers, FloatingLeaves, CursorTrail } from './components/ambient';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/calculator" element={<PageTransition><Calculator /></PageTransition>} />
        <Route path="/world-map" element={<PageTransition><WorldMap /></PageTransition>} />
        <Route path="/infographic" element={<PageTransition><Infographic /></PageTransition>} />
        <Route path="/seasonal" element={<PageTransition><SeasonalProduce /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
        <Route path="/savings" element={<PageTransition><SavingsCalculator /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/profile/:username" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/hashtag/:tag" element={<PageTransition><Hashtag /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

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
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AnimatePresence>
              {showSplash && <SplashScreen />}
            </AnimatePresence>

            {!showSplash && (
              <>
                <ScrollIndicator />
                <NoiseOverlay />
                <ParallaxLayers />
                <FloatingLeaves count={6} />
                <CursorTrail />
                <AnimatedRoutes />
              </>
            )}
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
