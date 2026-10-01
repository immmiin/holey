import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Btn from '../components/Btn.jsx';
import BounceText from '../components/motion/BounceText.jsx';
import { products, sockSrc } from '../data/products.js';

const NEAR = [
  'So close. One’s a left.',
  'Same pattern, different life choices.',
  'That’s a 7/10 match.',
  'Technically siblings.',
  'The hole’s on the wrong side.',
  'One of them has been through the dryer.',
  'They’ve met. They didn’t click.'
];
const MISS = ['Not even close.', 'No. Absolutely not.', 'Those two have never met.', 'Wrong drawer.'];

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const deal = () =>
  shuffle(products.flatMap((p) => [
    { key: `${p.slug}-a`, p, twin: false },
    { key: `${p.slug}-b`, p, twin: true }
  ]));

function Card({ c, up, found, onFlip, index }) {
  return (
    <button
      type="button"
      className={`lf-card ${up ? 'is-up' : ''} ${found ? 'is-found' : ''}`}
      onClick={() => onFlip(index)}
      aria-label={up ? `${c.p.name}${c.twin ? ' (the other one?)' : ''}` : `Card ${index + 1}, face down`}
      aria-pressed={up}
      disabled={found}
    >
      <motion.span
        className="lf-card__inner"
        animate={{ rotateY: up ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 17 }}
      >
        <span className="lf-card__back" aria-hidden="true">
          <img src="/logo/holey_03_nail-icon-H.svg" alt="" width="1110" height="1260" />
        </span>
        <span className="lf-card__face" style={{ '--sock': c.p.color }} aria-hidden="true">
          <img className={c.twin ? 'is-twin' : ''} src={sockSrc(c.p.n, 400)} alt="" width="400" height="500" />
          <span className="lf-card__name">{c.twin ? 'the other one?' : c.p.name}</span>
          {found && <span className="lf-card__stamp">near match</span>}
        </span>
      </motion.span>
    </button>
  );
}

export default function LostFound() {
  const [cards, setCards] = useState(deal);
  const [up, setUp] = useState([]); // indices currently face up (not yet resolved)
  const [found, setFound] = useState(() => new Set()); // slugs
  const [moves, setMoves] = useState(0);
  const [say, setSay] = useState('Flip two cards. Find the pairs. Good luck with that.');
  const lock = useRef(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);

  const done = found.size === products.length;

  const flip = useCallback(
    (i) => {
      if (lock.current || up.includes(i) || found.has(cards[i].p.slug)) return;
      const next = [...up, i];
      setUp(next);
      if (next.length < 2) return;
      setMoves((m) => m + 1);
      const [a, b] = next.map((k) => cards[k]);
      lock.current = true;
      if (a.p.slug === b.p.slug) {
        setSay(NEAR[Math.floor(Math.random() * NEAR.length)]);
        timer.current = setTimeout(() => {
          setFound((f) => new Set(f).add(a.p.slug));
          setUp([]);
          lock.current = false;
        }, 650);
      } else {
        setSay(MISS[Math.floor(Math.random() * MISS.length)]);
        timer.current = setTimeout(() => {
          setUp([]);
          lock.current = false;
        }, 950);
      }
    },
    [up, found, cards]
  );

  const reset = () => {
    clearTimeout(timer.current);
    lock.current = false;
    setCards(deal());
    setUp([]);
    setFound(new Set());
    setMoves(0);
    setSay('Fresh laundry. Same problem.');
  };

  const isUp = useMemo(() => new Set(up), [up]);

  return (
    <section className="lf" id="lost-and-found" aria-labelledby="lf-title">
      <div className="lf__head">
        <div>
          <p className="kicker">A game you can’t win</p>
          <BounceText id="lf-title" text="Lost & Found." className="h2" />
        </div>
        <div className="lf__stats" aria-live="polite">
          <span>
            <strong>{moves}</strong> moves
          </span>
          <span>
            <strong>{found.size}</strong>/{products.length} almost-pairs
          </span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={say}
          className="lf__say"
          initial={{ y: 12, opacity: 0, rotate: -2 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          role="status"
        >
          {say}
        </motion.p>
      </AnimatePresence>

      <div className="lf__table">
        <div className="lf__grid">
          {cards.map((c, i) => (
            <Card key={c.key} c={c} index={i} up={isUp.has(i) || found.has(c.p.slug)} found={found.has(c.p.slug)} onFlip={flip} />
          ))}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              className="lf__end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-label="Game over"
            >
              <motion.div
                className="lf__end-card card-ink"
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1, rotate: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
              >
                <p className="kicker">Results</p>
                <p className="h3">
                  {products.length} pairs found.
                  <br />0 actually match.
                </p>
                <p>That’s not a bug. That’s laundry. ({moves} moves, if you’re counting.)</p>
                <div className="lf__end-ctas">
                  <Btn to="/shop">Shop single socks</Btn>
                  <Btn variant="care" tilt={1} onClick={reset}>
                    Play again
                  </Btn>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!done && (
        <button type="button" className="lf__reset" onClick={reset}>
          Shuffle the pile
        </button>
      )}
    </section>
  );
}
