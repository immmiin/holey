import Wipe from '../components/motion/Wipe.jsx';
import { Instagram, TikTok, XLogo } from '../components/Icons.jsx';
import { bySlug, holeSrc, sockSrc } from '../data/products.js';

const L = (id, crop, alt) => ({ src: `/img/lifestyle/life-${id}-${crop}-600.webp`, alt });
const S = (slug, rot = -8) => {
  const p = bySlug[slug];
  return { src: sockSrc(p.n, 400), bg: p.color, sock: true, rot, alt: `${p.name} sock on a ${p.name.toLowerCase()} coloured backdrop.` };
};

const posts = [
  L(2, 'toe', 'A toenail painted pink with the word Holey, peeking through a sock.'),
  S('lost-in-laundry', -10),
  L(1, 'top', 'Two ankles in matching pink and green striped cuffs.'),
  { src: holeSrc(4, 600), alt: 'Macro shot of the hole in a yellow and blue sock.' },
  L(1, 'toe', 'Two big toes poking out of two holey socks.'),
  { src: '/logo/holey_05_bubble-pink.svg', bg: '#F5F56A', sticker: true, alt: 'The Holey bubble logo sticker.' },
  L(2, 'top', 'A pink sock with a green swirl pattern, from above.'),
  S('dryer-lint', 8),
  L(1, 'wide', 'Two feet in pink socks, pattern detail.'),
  S('toe-jam', -6)
];

export default function Social() {
  const cards = posts.map((p, i) => (
    <figure key={i} className={`soc__card ${p.sock || p.sticker ? 'is-graphic' : ''}`} style={p.bg ? { background: p.bg } : undefined}>
      <img
        src={p.src}
        alt={p.alt}
        loading="lazy"
        width="600"
        height="600"
        style={p.rot ? { transform: `rotate(${p.rot}deg)` } : undefined}
      />
    </figure>
  ));
  return (
    <section className="soc" aria-labelledby="soc-title">
      <div className="soc__wrapper">
        <div className="soc__header">
          <Wipe text="Seen in the wild." className="t-h3 soc__heading" id="soc-title" />
          <p className="soc__body">
            Tag @holey.onesock and you’ll probably end up here. We repost the good ones, and our definition of good is generous. Cold feet
            welcome.
          </p>
        </div>
        <div className="soc__marquee">
          <div className="soc__track">
            <div className="soc__strip">{cards}</div>
            <div className="soc__strip" aria-hidden="true">
              {cards}
            </div>
          </div>
        </div>
        <div className="soc__links">
          <a className="circle-btn" href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram (fake account)">
            <Instagram />
          </a>
          <a className="circle-btn" href="https://tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok (fake account)">
            <TikTok />
          </a>
          <a className="circle-btn" href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X (fake account)">
            <XLogo />
          </a>
        </div>
      </div>
    </section>
  );
}
