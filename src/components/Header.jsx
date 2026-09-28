import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import Logo from './Logo.jsx';
import Oval from './Oval.jsx';
import { Bag, Close, Search } from './Icons.jsx';
import { products, sockSrc, logoColor } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { pushAccent } from '../lib/accent.js';
import { lockScroll, reducedMotion, unlockScroll } from '../lib/scroll.js';
import './header.css';

function CartButton({ className = '' }) {
  const { count, setOpen, spin, registerIcon } = useCart();
  const [scope, animate] = useAnimate();
  const first = useRef(true);

  useEffect(() => registerIcon(scope.current), [registerIcon, scope]);

  // washing-machine spin cycle whenever a sock lands in the cart
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reducedMotion()) return;
    animate(scope.current, { rotate: [0, -25, 1080 + 25, 1080], x: [0, -1.5, 1.5, 0] }, { duration: 1.25, ease: [0.65, 0, 0.25, 1] }).then(
      () => scope.current && animate(scope.current, { rotate: 0 }, { duration: 0 })
    );
    animate('.cart-bubble', { scale: [0.2, 1.35, 1] }, { duration: 0.5, delay: 0.9 });
  }, [spin, animate, scope]);

  return (
    <button
      ref={scope}
      type="button"
      className={`circle-btn cart-btn ${className}`}
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} ${count === 1 ? 'sock' : 'socks'}`}
    >
      <Bag />
      {count > 0 && (
        <span className="cart-bubble" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
}

function SockTile({ p, onNavigate, variant = 'mega' }) {
  const release = useRef(null);
  return (
    <Link
      to={`/socks/${p.slug}`}
      viewTransition
      className={`${variant}__tile`}
      onClick={onNavigate}
      onPointerEnter={() => (release.current = pushAccent(logoColor(p)))}
      onPointerLeave={() => release.current?.()}
    >
      <span className={`${variant}__tile-media`} style={{ background: p.color }}>
        <img src={sockSrc(p.n, 400)} alt="" loading="lazy" width="400" height="500" />
      </span>
      <span className={`${variant}__tile-title`}>{p.name}</span>
    </Link>
  );
}

function SearchPanel({ onClose }) {
  const [q, setQ] = useState('');
  const input = useRef(null);
  useEffect(() => input.current?.focus(), []);
  const term = q.trim().toLowerCase();
  const results = term
    ? products.filter((p) => `${p.name} ${p.subtitle} ${p.description}`.toLowerCase().includes(term))
    : products;
  return (
    <motion.div
      className="search"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-label="Search socks"
    >
      <div className="search__inner">
        <label className="search__field">
          <Search />
          <span className="visually-hidden">Search</span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search one sock at a time"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
          />
          <button type="button" className="search__close" onClick={onClose} aria-label="Close search">
            <Close />
          </button>
        </label>
        {results.length ? (
          <div className="search__results">
            {results.map((p) => (
              <SockTile key={p.slug} p={p} onNavigate={onClose} variant="mega" />
            ))}
          </div>
        ) : (
          <p className="search__empty t-mono">No results. Like the other sock, it was never here.</p>
        )}
      </div>
    </motion.div>
  );
}

function MobileMenu({ onClose }) {
  const [openGroup, setOpenGroup] = useState(true);
  return (
    <motion.div
      className="mm"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="mm__bar">
        <button type="button" className="mm__pill" onClick={onClose}>
          <Close /> Close
        </button>
        <Link to="/" viewTransition className="mm__logo" onClick={onClose} aria-label="Holey home">
          <Logo />
        </Link>
        <CartButton />
      </div>
      <div className="mm__body" data-lenis-prevent>
        <button type="button" className="mm__group-title" aria-expanded={openGroup} onClick={() => setOpenGroup((o) => !o)}>
          <img src="/logo/holey_03_nail-icon-H.svg" alt="" className="mm__group-icon" />
          Socks
          <span className={`mm__toggle ${openGroup ? 'is-open' : ''}`} aria-hidden="true" />
        </button>
        <AnimatePresence initial={false}>
          {openGroup && (
            <motion.div
              className="mm__grid"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {products.map((p) => (
                <SockTile key={p.slug} p={p} onNavigate={onClose} variant="mm" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <nav className="mm__links" aria-label="Mobile">
          <Link to="/" viewTransition onClick={onClose}>Home</Link>
          <Link to="/shop" viewTransition onClick={onClose}>Shop all</Link>
          <Link to="/about" viewTransition onClick={onClose}>About</Link>
          <Link to="/faq" viewTransition onClick={onClose}>FAQ</Link>
          <Link to="/contact" viewTransition onClick={onClose}>Contact</Link>
        </nav>
        <div className="mm__cta">
          <Oval to="/shop" onClick={onClose}>Shop the sock</Oval>
        </div>
      </div>
    </motion.div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState(null); // 'mega' | 'search' | 'menu' | null
  const closeTimer = useRef(0);
  const headerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close panels on route change
  useEffect(() => setPanel(null), [pathname]);

  useEffect(() => {
    if (panel !== 'menu') return undefined;
    lockScroll();
    const onKey = (e) => e.key === 'Escape' && setPanel(null);
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [panel]);

  useEffect(() => {
    if (panel !== 'mega') return undefined;
    const onKey = (e) => e.key === 'Escape' && setPanel(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setPanel('mega');
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPanel((p) => (p === 'mega' ? null : p)), 180);
  };

  const transparent = isHome && !scrolled && panel !== 'mega' && panel !== 'search';

  return (
    <>
      <header ref={headerRef} className="hdr" data-transparent={transparent || undefined} data-home={isHome || undefined}>
        <div className="hdr__row">
          <div className="hdr__left">
            <nav className="hdr__nav" aria-label="Main">
              <NavLink to="/" end viewTransition className="hdr__link">
                Home
              </NavLink>
              <span className="hdr__has-mega" onPointerEnter={openMega} onPointerLeave={scheduleClose}>
                <NavLink
                  to="/shop"
                  viewTransition
                  className="hdr__link"
                  aria-haspopup="true"
                  aria-expanded={panel === 'mega'}
                  onFocus={openMega}
                >
                  Socks
                </NavLink>
              </span>
              <NavLink to="/about" viewTransition className="hdr__link">
                About
              </NavLink>
              <NavLink to="/faq" viewTransition className="hdr__link">
                FAQ
              </NavLink>
            </nav>
            <button
              type="button"
              className="hdr__menu-btn"
              aria-expanded={panel === 'menu'}
              aria-controls="mobile-menu"
              onClick={() => setPanel('menu')}
            >
              Menu
            </button>
            <button
              type="button"
              className="circle-btn hdr__search-m"
              aria-label="Search"
              onClick={() => setPanel((p) => (p === 'search' ? null : 'search'))}
            >
              <Search />
            </button>
          </div>

          <Link to="/" viewTransition className="hdr__logo" aria-label="Holey home">
            <Logo />
          </Link>

          <div className="hdr__actions">
            <button
              type="button"
              className="circle-btn hdr__search-d"
              aria-label="Search"
              aria-expanded={panel === 'search'}
              onClick={() => setPanel((p) => (p === 'search' ? null : 'search'))}
            >
              <Search />
            </button>
            <CartButton />
          </div>
        </div>

        <AnimatePresence>
          {panel === 'mega' && (
            <motion.div
              className="mega"
              onPointerEnter={openMega}
              onPointerLeave={scheduleClose}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mega__inner">
                <div className="mega__links">
                  <Link to="/shop" viewTransition className="mega__link">
                    All socks
                  </Link>
                  <Link to="/about" viewTransition className="mega__link">
                    Manifesto
                  </Link>
                  <Link to="/faq" viewTransition className="mega__link">
                    FAQ
                  </Link>
                  <Link to="/shop" viewTransition className="mega__link mega__link--bottom">
                    Shop all
                  </Link>
                </div>
                <div className="mega__tiles">
                  {products.map((p) => (
                    <SockTile key={p.slug} p={p} onNavigate={() => setPanel(null)} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {panel === 'search' && <SearchPanel onClose={() => setPanel(null)} />}
        </AnimatePresence>
      </header>
      <AnimatePresence>{panel === 'menu' && <MobileMenu onClose={() => setPanel(null)} />}</AnimatePresence>
    </>
  );
}
