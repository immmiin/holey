import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import ProductCard from '../components/ProductCard.jsx';
import ValueAccordion from '../sections/ValueAccordion.jsx';
import { Plus } from '../components/Icons.jsx';
import { products } from '../data/products.js';
import useTitle from '../lib/useTitle.js';
import './pages.css';

const filters = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'pastel', label: 'Pastel', test: (p) => !p.dark && p.n !== 5 },
  { id: 'neutral', label: 'Neutral', test: (p) => p.dark || p.n === 5 }
];

const sorts = [
  { id: 'featured', label: 'Featured', fn: (a, b) => a.n - b.n },
  { id: 'low', label: 'Price, low to high', fn: (a, b) => a.price - b.price || a.n - b.n },
  { id: 'high', label: 'Price, high to low', fn: (a, b) => b.price - a.price || a.n - b.n },
  { id: 'az', label: 'A to Z', fn: (a, b) => a.name.localeCompare(b.name) },
  { id: 'za', label: 'Z to A', fn: (a, b) => b.name.localeCompare(a.name) }
];

export default function Shop() {
  useTitle('All socks');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('featured');
  const [hover, setHover] = useState(null);
  const sortRef = useRef(null);

  // close the sort menu on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (sortRef.current?.open && !sortRef.current.contains(e.target)) sortRef.current.open = false;
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  const list = products.filter(filters.find((f) => f.id === filter).test).sort(sorts.find((s) => s.id === sort).fn);
  // Vibe's rhythm: in a full row of six, the 3rd and 4th cards go wide
  const wide = (i) => list.length === 6 && (i === 2 || i === 3);

  return (
    <>
      <section
        className="plp"
        style={{ '--sec-bg': hover ? hover.color : 'var(--cream)', '--sec-fg': hover?.dark ? 'var(--cream)' : 'var(--ink)' }}
      >
        <header className="plp__header">
          <h1 className="plp__title">Socks</h1>
          <div className="plp__toolbar">
            <div className="plp__filters" role="group" aria-label="Filter">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`plp__pill ${filter === f.id ? 'is-active' : ''}`}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="plp__meta-tools">
              <span className="plp__count" aria-live="polite">
                {list.length} {list.length === 1 ? 'Sock' : 'Socks'} · 0 Pairs
              </span>
              <details className="plp__sort" ref={sortRef}>
                <summary className="plp__pill">
                  Sort <Plus />
                </summary>
                <div className="plp__sort-menu">
                  {sorts.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-current={sort === s.id || undefined}
                      onClick={() => {
                        setSort(s.id);
                        sortRef.current.open = false;
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                  <p className="plp__sort-note">Everything is $9. Sorting by price is a formality.</p>
                </div>
              </details>
            </div>
          </div>
        </header>
        <motion.div className="plp__grid" layout>
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                className={`plp__cell ${wide(i) ? 'plp__cell--wide' : ''}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <ProductCard p={p} onHover={setHover} wide={wide(i)} sizes={wide(i) ? '(min-width: 750px) 50vw, 100vw' : '(min-width: 750px) 25vw, 50vw'} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
      <ValueAccordion />
    </>
  );
}
