import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { AnimatePresence, motion, useAnimate } from 'motion/react';
import SockStage from '../components/sock3d/SockStage.jsx';
import Oval from '../components/Oval.jsx';
import { Minus, Plus, Rotate } from '../components/Icons.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import Banner from '../sections/Banner.jsx';
import ProductRow from '../sections/ProductRow.jsx';
import NotFound from './NotFound.jsx';
import { bySlug, holeSrc, holeSrcSet, logoColor, money, products, sockSrc } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { pushAccent } from '../lib/accent.js';
import { reducedMotion } from '../lib/scroll.js';
import useTitle from '../lib/useTitle.js';
import './pages.css';

function galleryFor(p) {
  const g = [
    { kind: '3d', label: '360° view' },
    { kind: 'img', src: holeSrc(p.n, 1000), srcSet: holeSrcSet(p.n), alt: `The hole in the toe of ${p.name}, up close.`, label: 'The hole' }
  ];
  if (p.n === 1) {
    g.push(
      { kind: 'img', src: '/img/lifestyle/life-1-1000.webp', alt: 'Two feet wearing Heel Yeah socks, toes out.', label: 'On foot', cover: true },
      { kind: 'img', src: '/img/lifestyle/life-2-1000.webp', alt: 'A Heel Yeah sock with a Holey-painted toenail through the hole.', label: 'Toe detail', cover: true }
    );
  }
  return g;
}

// Quantity is locked at 1. Trying to change it earns a wiggle and a reminder.
function LockedQty() {
  const [scope, animate] = useAnimate();
  const [tip, setTip] = useState(0);
  const timer = useRef(0);
  const nope = () => {
    if (!reducedMotion()) animate(scope.current, { x: [0, -9, 8, -6, 5, -2, 0], rotate: [0, -3, 3, -2, 1, 0] }, { duration: 0.5 });
    setTip((t) => t + 1);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setTip(0), 1800);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="qty-wrap">
      <div ref={scope} className="pdp__qty" role="group" aria-label="Quantity">
        <button type="button" className="pdp__qty-btn" onClick={nope} aria-label="Decrease quantity (it's one sock)">
          <Minus />
        </button>
        <output className="pdp__qty-val" aria-live="polite">
          1
        </output>
        <button type="button" className="pdp__qty-btn" onClick={nope} aria-label="Increase quantity (it's one sock)">
          <Plus />
        </button>
      </div>
      <AnimatePresence>
        {tip > 0 && (
          <motion.span
            key="tip"
            className="qty-tip"
            role="status"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            It’s one sock.
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const p = bySlug[slug];
  useTitle(p ? p.name : 'Not found');
  const cart = useCart();
  const [active, setActive] = useState(0);
  const main = useRef(null);

  useEffect(() => setActive(0), [slug]);
  useEffect(() => (p ? pushAccent(logoColor(p)) : undefined), [p]);

  if (!p) return <NotFound />;

  const gallery = galleryFor(p);
  const cur = gallery[active] || gallery[0];
  const inCart = cart.has(p.slug);
  const others = products.filter((x) => x.slug !== p.slug).slice(0, 4);

  return (
    <>
      <section className="pdp" style={{ '--sock': p.color }}>
        <div className="pdp__wrapper">
          <div className="pdp__gallery">
            <div className="pdp__thumbs" role="tablist" aria-label="Product views">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={g.label}
                  className={`pdp__thumb ${active === i ? 'is-active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {g.kind === '3d' ? (
                    <span className="pdp__thumb-3d">
                      <img src={sockSrc(p.n, 400)} alt="" />
                      <Rotate />
                    </span>
                  ) : (
                    <img src={g.src} alt="" loading="lazy" className={g.cover ? '' : 'is-cover'} />
                  )}
                </button>
              ))}
            </div>
            <div className="pdp__main" ref={main}>
              {cur.kind === '3d' ? (
                <SockStage product={p} mode="drag" hint eager sizes="(min-width: 750px) 38vw, 100vw" />
              ) : (
                <motion.img
                  key={cur.src}
                  src={cur.src}
                  srcSet={cur.srcSet}
                  alt={cur.alt}
                  className="pdp__main-img"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </div>
          </div>

          <div className="pdp__info">
            <div className="pdp__heading-group">
              <p className="t-mono">{p.subtitle}</p>
              <h1 className="pdp__title">{p.name}</h1>
            </div>
            <div className="rule" aria-hidden="true" />
            <p className="pdp__body t-mono">{p.description}</p>
            <dl className="pdp__specs">
              {p.specs.map(([k, v]) => (
                <div key={k} className="pdp__spec">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="rule" aria-hidden="true" />
            <div className="pdp__buy">
              <div className="pdp__price-qty">
                <p className="pdp__price">{money(p.price)}</p>
                <LockedQty />
              </div>
              <Oval className="pdp__add" onClick={() => cart.add(p.slug, main.current)} aria-describedby="pdp-note">
                {inCart ? 'In your cart' : 'Add to cart'}
              </Oval>
            </div>
            <p id="pdp-note" className="t-mono pdp__note">
              {inCart ? 'Already yours. We only have the one.' : 'Ships alone, as intended. Free returns on the sock, not the feelings.'}
            </p>
          </div>
        </div>
      </section>
      <Testimonials />
      <Banner src={2} position="center 95%" alt="A single toe poking through the hole of a pink and green Holey sock, nail painted with the Holey logo." />
      <ProductRow heading="You may also like…" items={others} padTop={false} />
    </>
  );
}
