import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SplashScreen from './components/ui/SplashScreen';
import PageTransition from './components/ui/PageTransition';
import ScrollToTop from './components/ui/ScrollToTop';
import RouteFallback from './components/ui/RouteFallback';
import { NoiseOverlay, ScrollIndicator } from './components/ui';
import { Navbar, Footer } from './components/layout';
import { ParallaxLayers, FloatingLeaves, CursorTrail } from './components/ambient';
import { usePrefersReducedMotion } from './hooks';
import { ROUTES } from './constants/routes';

// Home stays eager — it's the most common entry point and lazy-loading it would
// only add a round trip before first paint. Everything else is split, which
// keeps the initial bundle to the shell plus the landing page instead of all
// twenty-odd routes (Recharts, Swiper and the admin panel included).
import Home from './pages/Home';

const WhatIsVeganism = lazy(() => import('./pages/WhatIsVeganism'));
const WhyVeganism = lazy(() => import('./pages/WhyVeganism'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Recipes = lazy(() => import('./pages/Recipes'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Sources = lazy(() => import('./pages/Sources'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Cookies = lazy(() => import('./pages/Cookies'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const Grievance = lazy(() => import('./pages/Grievance'));
const Calculator = lazy(() => import('./pages/Calculator'));
const SavingsCalculator = lazy(() => import('./pages/SavingsCalculator'));
const Planner = lazy(() => import('./pages/Planner'));
const SeasonalProduce = lazy(() => import('./pages/SeasonalProduce'));
const Compare = lazy(() => import('./pages/Compare'));
const WorldMap = lazy(() => import('./pages/WorldMap'));
const Infographic = lazy(() => import('./pages/Infographic'));
const Community = lazy(() => import('./pages/Community'));
const Chat = lazy(() => import('./pages/Chat'));
const Hashtag = lazy(() => import('./pages/Hashtag'));
const Auth = lazy(() => import('./pages/Auth'));
const Profile = lazy(() => import('./pages/Profile'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Wraps a route element in the shared enter/exit transition. */
const page = (element) => <PageTransition>{element}</PageTransition>;

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/*
        Suspense sits inside AnimatePresence so a pending chunk shows the
        skeleton in place rather than unmounting the whole tree.
      */}
      <Suspense fallback={<RouteFallback />} key={location.pathname}>
        <Routes location={location}>
          <Route path={ROUTES.home} element={page(<Home />)} />

          {/* Learn */}
          <Route path={ROUTES.whatIsVeganism} element={page(<WhatIsVeganism />)} />
          <Route path={ROUTES.whyVeganism} element={page(<WhyVeganism />)} />
          <Route path={ROUTES.getStarted} element={page(<GetStarted />)} />
          <Route path={ROUTES.articles} element={page(<Articles />)} />
          <Route path={ROUTES.article} element={page(<ArticleDetail />)} />
          <Route path={ROUTES.recipes} element={page(<Recipes />)} />
          <Route path={ROUTES.recipe} element={page(<RecipeDetail />)} />

          {/* Tools */}
          <Route path={ROUTES.calculator} element={page(<Calculator />)} />
          <Route path={ROUTES.savings} element={page(<SavingsCalculator />)} />
          <Route path={ROUTES.planner} element={page(<Planner />)} />
          <Route path={ROUTES.seasonal} element={page(<SeasonalProduce />)} />
          <Route path={ROUTES.compare} element={page(<Compare />)} />
          <Route path={ROUTES.worldMap} element={page(<WorldMap />)} />
          <Route path={ROUTES.infographic} element={page(<Infographic />)} />

          {/* Organisation & trust */}
          <Route path={ROUTES.about} element={page(<About />)} />
          <Route path={ROUTES.contact} element={page(<Contact />)} />
          <Route path={ROUTES.sources} element={page(<Sources />)} />
          <Route path={ROUTES.privacy} element={page(<Privacy />)} />
          <Route path={ROUTES.terms} element={page(<Terms />)} />
          <Route path={ROUTES.cookies} element={page(<Cookies />)} />
          <Route path={ROUTES.disclaimer} element={page(<Disclaimer />)} />
          <Route path={ROUTES.grievance} element={page(<Grievance />)} />

          {/* Community */}
          <Route path={ROUTES.community} element={page(<Community />)} />
          <Route path={ROUTES.chat} element={page(<Chat />)} />
          <Route path={ROUTES.chatRoom} element={page(<Chat />)} />
          <Route path={ROUTES.hashtag} element={page(<Hashtag />)} />

          {/* Account */}
          <Route path={ROUTES.auth} element={page(<Auth />)} />
          <Route path={ROUTES.profile} element={page(<Profile />)} />
          <Route path={ROUTES.editProfile} element={page(<EditProfile />)} />
          <Route path={ROUTES.admin} element={page(<Admin />)} />

          <Route path="*" element={page(<NotFound />)} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

/**
 * The splash used to gate the entire router (`{!showSplash && <Routes/>}`), so
 * for the first ~3 seconds the document had no content at all — bad for
 * crawlers, and bad for anyone arriving on a deep link. Now it overlays a
 * fully-rendered page, and only on the first visit of a browsing session.
 */
const SPLASH_SEEN_KEY = 'veganlife:splash-seen';

function useSplash(prefersReducedMotion) {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    // An intro animation is exactly what "reduce motion" asks us to skip.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    // Deep links should go straight to the content the visitor asked for.
    if (window.location.pathname !== '/') return false;
    try {
      return window.sessionStorage.getItem(SPLASH_SEEN_KEY) !== '1';
    } catch {
      // Private mode / storage disabled — don't let it break the app.
      return true;
    }
  });

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(SPLASH_SEEN_KEY, '1');
    } catch {
      /* storage unavailable; the splash simply shows again next load */
    }
    setShowSplash(false);
  };

  useEffect(() => {
    if (prefersReducedMotion && showSplash) dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return [showSplash, dismiss];
}

/**
 * Routes where the marketing footer would get in the way. These are
 * app-like, full-height surfaces (chat, moderation, the auth form) rather
 * than content pages, so they end at the viewport instead of a sitemap.
 */
const FOOTERLESS_PREFIXES = [ROUTES.chat, ROUTES.admin, ROUTES.auth];

function useShowFooter() {
  const { pathname } = useLocation();
  return !FOOTERLESS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function AppShell() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showSplash, dismissSplash] = useSplash(prefersReducedMotion);
  const showFooter = useShowFooter();

  // Lenis smooth scroll. Skipped entirely under reduced-motion, where hijacking
  // the native scroll is the opposite of what the user asked for.
  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    // Exposed so ScrollToTop can reset Lenis' internal position on navigation.
    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      // The previous version never cancelled this loop, so a destroyed Lenis
      // instance kept getting raf()'d after unmount.
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, [prefersReducedMotion]);

  // The splash is fixed and full-screen; locking the body underneath stops the
  // page behind it from scrolling on wheel/touch.
  useEffect(() => {
    document.body.style.overflow = showSplash ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollToTop />
      <ScrollIndicator />
      <NoiseOverlay />
      <ParallaxLayers />
      <FloatingLeaves count={6} />
      <CursorTrail />

      {/*
        Navigation and footer live here rather than inside each page. Previously
        only Home and Chat rendered the Navbar, which left every tool and content
        route (calculator, seasonal produce, community, profile...) with no way to
        move around the site except the browser back button — and no crawlable
        internal links either.
      */}
      <Navbar />

      {/* Content renders immediately and stays in the DOM behind the splash. */}
      <main id="main-content">
        <AnimatedRoutes />
      </main>

      {showFooter && <Footer />}

      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={dismissSplash} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <ChatProvider>
              <AppShell />
            </ChatProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
