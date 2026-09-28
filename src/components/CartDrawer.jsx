import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { useCart } from '../context/CartContext.jsx';
import { bySlug, money, sockSrc } from '../data/products.js';
import { lockScroll, unlockScroll } from '../lib/scroll.js';
import Oval from './Oval.jsx';
import { Close } from './Icons.jsx';
import './drawer.css';

export default function CartDrawer() {
  const { items, open, setOpen, remove, subtotal, count } = useCart();
  const panel = useRef(null);
  const lastFocus = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    lockScroll();
    const t = setTimeout(() => panel.current?.querySelector('button, a')?.focus(), 60);
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && panel.current) {
        // keep focus inside the drawer
        const f = [...panel.current.querySelectorAll('a[href], button:not([disabled]), input')];
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      unlockScroll();
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, setOpen]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <div className="drawer" role="presentation">
          <motion.div
            className="drawer__scrim"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.aside
            ref={panel}
            className="drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '104%' }}
            animate={{ x: 0 }}
            exit={{ x: '104%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 40 }}
          >
            <header className="drawer__head">
              <h2 id="drawer-title" className="drawer__title">
                Cart <span className="drawer__count">{count}</span>
              </h2>
              <button type="button" className="circle-btn" onClick={close} aria-label="Close cart">
                <Close />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="drawer__empty">
                <img src="/logo/holey_04_nail-icon-holey.svg" alt="" width="1110" height="1290" />
                <p className="drawer__empty-title">Your cart is empty.</p>
                <p className="t-mono">Which, frankly, is how most sock drawers end up.</p>
                <Oval to="/shop" onClick={close}>
                  Find the one
                </Oval>
              </div>
            ) : (
              <>
                <ul className="drawer__list" data-lenis-prevent>
                  <AnimatePresence initial={false}>
                    {items.map((slug) => {
                      const p = bySlug[slug];
                      return (
                        <motion.li
                          key={slug}
                          className="drawer__item"
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 60 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link to={`/socks/${p.slug}`} viewTransition onClick={close} className="drawer__thumb" style={{ background: p.color }}>
                            <img src={sockSrc(p.n, 400)} alt={`${p.name} sock`} width="400" height="500" />
                          </Link>
                          <div className="drawer__info">
                            <div className="drawer__row">
                              <Link to={`/socks/${p.slug}`} viewTransition onClick={close} className="drawer__name">
                                {p.name}
                              </Link>
                              <span className="t-mono">{money(p.price)}</span>
                            </div>
                            <p className="t-mono drawer__sub">{p.subtitle}</p>
                            <div className="drawer__row">
                              <span className="drawer__qty t-mono" title="It's one sock.">
                                Qty 1 <span aria-hidden="true">·</span> forever
                              </span>
                              <button type="button" className="drawer__remove t-mono" onClick={() => remove(slug)}>
                                Let it go
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
                <footer className="drawer__foot">
                  <div className="drawer__row drawer__total">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>
                  <p className="t-mono drawer__note">
                    Shipping calculated at checkout. Pairs not available at any price.
                  </p>
                  <Oval
                    className="drawer__checkout"
                    onClick={() => {
                      close();
                      navigate('/checkout', { viewTransition: true });
                    }}
                  >
                    Check out
                  </Oval>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
