import { Link } from 'react-router';
import Pop from '../components/motion/Pop.jsx';
import Wipe from '../components/motion/Wipe.jsx';
import { bySlug, sockSrc } from '../data/products.js';

const cards = [
  {
    tag: 'Rituals',
    title: 'Big Toe, Big Meeting',
    to: '/socks/heel-yeah',
    img: '/img/lifestyle/life-2-toe-1200.webp',
    alt: 'A pink painted toenail reading Holey, peeking out of a sock.'
  },
  {
    tag: 'Rituals',
    title: 'Sunday, Left Foot Only',
    to: '/socks/purple-reign',
    sock: bySlug['purple-reign']
  },
  {
    tag: 'Rituals',
    title: 'Two Feet, Two Separate Orders',
    to: '/socks/heel-yeah',
    img: '/img/lifestyle/life-1-toe-1200.webp',
    alt: 'Two big toes poking out of two pink and green socks, bought one at a time.'
  }
];

export function StarBadge({ children, className = '', rotate = -10 }) {
  return (
    <Pop className={`star ${className}`} rotate={rotate}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M50 3 58 13 70 7 74 20 88 19 86 33 97 40 89 51 97 62 85 68 88 82 74 82 70 95 58 89 50 98 42 89 30 95 26 82 12 82 15 68 3 62 11 51 3 40 14 33 12 19 26 20 30 7 42 13Z"
          fill="var(--hi)"
          stroke="var(--ink)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </Pop>
  );
}

export default function Rituals() {
  return (
    <section className="rit">
      <div className="rule" aria-hidden="true" />
      <div className="rit__wrapper">
        <Wipe text="Rituals." className="t-h2 rit__heading" />
        <div className="rit__zone">
          <StarBadge className="rit__badge">One foot at a time</StarBadge>
          <div className="rit__row">
            {cards.map((c) => (
              <Link key={c.title} to={c.to} viewTransition className="rit__card">
                <div className="rit__media box" style={c.sock ? { background: c.sock.color } : undefined}>
                  {c.sock ? (
                    <img className="rit__sock" src={sockSrc(c.sock.n, 800)} alt={`${c.sock.name} sock, alone on a lavender background.`} loading="lazy" width="800" height="1000" />
                  ) : (
                    <img src={c.img} alt={c.alt} loading="lazy" width="1200" height="1000" />
                  )}
                </div>
                <div className="rit__meta">
                  <p className="rit__tag t-mono">{c.tag}</p>
                  <h3 className="rit__title">{c.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
