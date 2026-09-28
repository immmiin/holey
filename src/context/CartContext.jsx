import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { animate } from 'motion';
import { bySlug, sockSrc } from '../data/products.js';
import { reducedMotion } from '../lib/scroll.js';

const CartContext = createContext(null);
const KEY = 'holey-cart-v1';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((s) => bySlug[s]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load); // array of slugs — quantity is always 1
  const [open, setOpen] = useState(false);
  const [spin, setSpin] = useState(0); // bump to make the cart icon do a spin cycle
  const [toast, setToast] = useState(null);
  const iconRefs = useRef(new Set());
  const toastTimer = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* private mode: the sock lives in memory only */
    }
  }, [items]);

  // keep tabs in sync
  useEffect(() => {
    const onStorage = (e) => e.key === KEY && setItems(load());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const registerIcon = useCallback((el) => {
    if (!el) return undefined;
    iconRefs.current.add(el);
    return () => iconRefs.current.delete(el);
  }, []);

  const say = useCallback((text) => {
    clearTimeout(toastTimer.current);
    setToast({ text, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const visibleIcon = () =>
    [...iconRefs.current].find((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });

  const fly = useCallback(async (fromEl, n) => {
    const target = visibleIcon();
    if (!fromEl || !target || reducedMotion()) return;
    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const size = Math.min(Math.max(a.width * 0.6, 90), 220);
    const img = document.createElement('img');
    img.src = sockSrc(n, 400);
    img.alt = '';
    img.className = 'fly-sock';
    Object.assign(img.style, {
      position: 'fixed',
      left: `${a.left + a.width / 2 - size / 2}px`,
      top: `${a.top + a.height / 2 - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain',
      zIndex: 9000,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 10px 14px rgba(26,15,31,.25))'
    });
    document.body.appendChild(img);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const lift = Math.min(160, Math.abs(dy) * 0.4 + 60);
    await animate(
      img,
      {
        x: [0, dx * 0.45, dx],
        y: [0, dy * 0.45 - lift, dy],
        scale: [1, 0.75, 0.12],
        rotate: [0, -25, -300],
        opacity: [1, 1, 0.9]
      },
      { duration: 0.85, ease: [0.55, 0, 0.35, 1], times: [0, 0.45, 1] }
    ).finished;
    img.remove();
  }, []);

  const add = useCallback(
    async (slug, fromEl) => {
      if (items.includes(slug)) {
        say("It's one sock. You already have it.");
        return false;
      }
      const p = bySlug[slug];
      const flight = fly(fromEl, p.n);
      setItems((cur) => (cur.includes(slug) ? cur : [...cur, slug]));
      await flight;
      setSpin((s) => s + 1);
      setTimeout(() => setOpen(true), reducedMotion() ? 0 : 650);
      return true;
    },
    [items, fly, say]
  );

  const remove = useCallback((slug) => setItems((cur) => cur.filter((s) => s !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      subtotal: items.reduce((t, s) => t + bySlug[s].price, 0),
      has: (slug) => items.includes(slug),
      add,
      remove,
      clear,
      open,
      setOpen,
      spin,
      registerIcon,
      toast,
      say
    }),
    [items, add, remove, clear, open, spin, registerIcon, toast, say]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
