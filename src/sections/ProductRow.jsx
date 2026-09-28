import { useEffect, useRef, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import Oval from '../components/Oval.jsx';
import Wipe from '../components/motion/Wipe.jsx';

// Four cards in a ruled row. Hovering a card floods the section with that sock's colour.
export default function ProductRow({ heading, items, cta = 'See all', padTop = true }) {
  const [hover, setHover] = useState(null);
  const [active, setActive] = useState(0);
  const row = useRef(null);

  // mobile: dots follow the horizontal scroll-snap row
  useEffect(() => {
    const el = row.current;
    if (!el) return undefined;
    const onScroll = () => {
      const card = el.firstElementChild;
      if (!card) return;
      setActive(Math.round(el.scrollLeft / card.getBoundingClientRect().width / 2));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const pages = Math.ceil(items.length / 2);

  return (
    <section
      className={`grid-sec ${padTop ? '' : 'grid-sec--flush'} ${hover ? 'is-tinted' : ''}`}
      style={{ '--sec-bg': hover ? hover.color : 'var(--cream)', '--sec-fg': hover?.dark ? 'var(--cream)' : 'var(--ink)' }}
    >
      <Wipe text={heading} className="t-h2 grid-sec__heading" />
      <div className="grid-sec__row" ref={row} tabIndex={-1}>
        {items.map((p) => (
          <ProductCard key={p.slug} p={p} onHover={setHover} />
        ))}
      </div>
      <div className="dots grid-sec__dots" role="tablist" aria-label="Product pages">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Show products ${i * 2 + 1} to ${i * 2 + 2}`}
            className={`dot ${active === i ? 'is-active' : ''}`}
            onClick={() => {
              const el = row.current;
              el?.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
            }}
          />
        ))}
      </div>
      {cta && (
        <div className="grid-sec__cta">
          <Oval to="/shop">{cta}</Oval>
        </div>
      )}
    </section>
  );
}
