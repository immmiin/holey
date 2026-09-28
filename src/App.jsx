import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router';
import { CartProvider } from './context/CartContext.jsx';
import Grain from './components/Grain.jsx';
import Marquee from './components/Marquee.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Toast from './components/Toast.jsx';
import Social from './sections/Social.jsx';
import Home from './pages/Home.jsx';
import { initScroll, scrollToTop, ScrollTrigger } from './lib/scroll.js';

// everything but the home page is split out
const Shop = lazy(() => import('./pages/Shop.jsx'));
const Product = lazy(() => import('./pages/Product.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Faq = lazy(() => import('./pages/Faq.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Legal = lazy(() => import('./pages/Legal.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const topline = ['One sock only', 'Hole included', 'No pairs', 'No refunds on feelings', 'Pre-distressed by hand', 'Left or right, who’s counting'];

function RouteEffects() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);
  useEffect(() => {
    // new page → new layout: re-measure every ScrollTrigger once things settle
    const t = setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    initScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }, []);

  return (
    <CartProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <RouteEffects />
      <div className="top-mq">
        <Marquee items={topline} />
      </div>
      <Header />
      <main id="main" className="page" tabIndex={-1}>
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/socks/:slug" element={<Product />} />
            <Route path="/products/:slug" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/legal/:page" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {pathname !== '/checkout' && <Social />}
      <Footer />
      <CartDrawer />
      <Toast />
      <Grain />
    </CartProvider>
  );
}
