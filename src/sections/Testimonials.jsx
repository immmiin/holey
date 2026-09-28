import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLong } from '../components/Icons.jsx';
import { reducedMotion } from '../lib/scroll.js';

const quotes = [
  {
    q: '“I bought one sock to see what the fuss was about. I left with one sock.”',
    who: 'Margot Vance, Ceramicist',
    pic: { src: '/logo/holey_03_nail-icon-H.svg', bg: '#A9C6EE', contain: true }
  },
  {
    q: '“Finally, a sock that doesn’t make me choose between left and right.”',
    who: 'Desmond Achebe, Tax Attorney',
    pic: { src: '/img/lifestyle/life-2-toe-600.webp', bg: '#F4A9BC' }
  },
  {
    q: '“My big toe hasn’t felt this seen since 2014.”',
    who: 'Ines Park, Pilates Instructor',
    pic: { src: '/logo/holey_04_nail-icon-holey.svg', bg: '#F6E7A0', contain: true }
  }
];

export default function Testimonials({ padTop = true }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const paused = useRef(false);

  const go = useCallback((next) => {
    setDir(next > 0 ? 1 : -1);
    setI((cur) => (cur + next + quotes.length) % quotes.length);
  }, []);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const t = setInterval(() => !paused.current && go(1), 7000);
    return () => clearInterval(t);
  }, [go]);

  const cur = quotes[i];
  return (
    <section
      className={`tst ${padTop ? '' : 'tst--flush'}`}
      id="reviews"
      aria-roledescription="carousel"
      aria-label="What customers say"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="rule" aria-hidden="true" />
      <div className="tst__stage">
        <div className="tst__viewport" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.figure
              key={i}
              className="tst__slide"
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${quotes.length}`}
            >
              <blockquote className="tst__quote">{cur.q}</blockquote>
              <figcaption className="tst__who">
                <span className="tst__pic" style={{ background: cur.pic.bg }}>
                  <img src={cur.pic.src} alt="" className={cur.pic.contain ? 'is-contain' : ''} loading="lazy" />
                </span>
                <span className="tst__author">{cur.who}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="tst__arrows">
          <button type="button" className="tst__arrow tst__arrow--prev" onClick={() => go(-1)} aria-label="Previous review">
            <ArrowLong />
          </button>
          <button type="button" className="tst__arrow" onClick={() => go(1)} aria-label="Next review">
            <ArrowLong />
          </button>
        </div>
        <div className="dots tst__dots">
          {quotes.map((_, k) => (
            <button
              key={k}
              type="button"
              className={`dot ${k === i ? 'is-active' : ''}`}
              aria-label={`Show review ${k + 1}`}
              aria-current={k === i || undefined}
              onClick={() => go(k - i)}
            />
          ))}
        </div>
      </div>
      <img className="tst__mascot" src="/logo/holey_07_nail-icon-H-exclaim.svg" alt="" loading="lazy" width="1200" height="930" />
    </section>
  );
}
