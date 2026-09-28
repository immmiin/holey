import Wipe from '../components/motion/Wipe.jsx';
import Parallax from '../components/motion/Parallax.jsx';
import Pop from '../components/motion/Pop.jsx';
import Oval from '../components/Oval.jsx';
import Marquee from '../components/Marquee.jsx';
import SpinSock from '../sections/SpinSock.jsx';
import { products } from '../data/products.js';
import useTitle from '../lib/useTitle.js';
import './info.css';

const tenets = [
  ['We lost the other one.', 'Everybody has. Somewhere, a dryer is full of them. We just stopped pretending it was coming back and built a company around the one that stayed.'],
  ['The hole is the point.', 'Not a defect, a feature. Every hole is made by hand, on purpose, at the toe, where it gets the most attention. It lets your big toe say what it came to say.'],
  ['Pairs are a construct.', 'Two feet, sure. But nobody said they had to agree. Wear it on the left. Wear it on the right. Wear it on your hand during a hard phone call. We are not your mother.'],
  ['Premium is a feeling.', 'One sock, $9, heavyweight cotton, a knit pattern we spent too long on, and packaging that treats it like jewellery. It is very serious about being ridiculous.']
];

export default function About() {
  useTitle('About');
  return (
    <>
      <section className="info-hero">
        <p className="t-mono info-hero__kicker">Manifesto</p>
        <Wipe as="h1" text="One sock. On purpose." className="info-hero__title" start="top 95%" end="top 30%" />
        <p className="info-hero__lede">
          Holey started the way most sock drawers end: with one sock and no explanation. We decided that was enough. More than enough, actually.
        </p>
        <Pop className="info-hero__sticker" rotate={12}>
          <img src="/logo/holey_07_nail-icon-H-exclaim.svg" alt="" width="1200" height="930" />
        </Pop>
      </section>

      <section className="split">
        <Parallax className="split__media">
          <img
            src="/img/lifestyle/life-1-1000.webp"
            srcSet="/img/lifestyle/life-1-600.webp 600w, /img/lifestyle/life-1-1000.webp 1000w, /img/lifestyle/life-1-1400.webp 1400w"
            sizes="(min-width: 750px) 48vw, 100vw"
            alt="Two feet in matching pink and green Holey socks — technically two separate orders."
            width="1000"
            height="1116"
            loading="lazy"
          />
        </Parallax>
        <ol className="tenets">
          {tenets.map(([h, b], i) => (
            <li key={h} className="tenet">
              <span className="tenet__n t-mono">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="t-h3 tenet__h">{h}</h2>
                <p className="t-mono tenet__b">{b}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Marquee
        className="mq-light"
        items={['Worn in, not worn out', 'Left foot energy', 'The other one is fine, probably']}
        repeat={4}
        bg="var(--hi)"
        size="15px"
        iconSize="30px"
        pad="22px"
        innerGap="30px"
        icon="/logo/holey_03_nail-icon-H.svg"
        speed={40}
      />

      <section className="numbers">
        {[
          ['1', 'Sock per order'],
          ['0', 'Pairs, ever'],
          ['1', 'Hole, hand-finished'],
          [String(products.length), 'Ways to be incomplete']
        ].map(([n, l]) => (
          <div key={l} className="numbers__cell">
            <span className="numbers__n">{n}</span>
            <span className="t-mono">{l}</span>
          </div>
        ))}
      </section>

      <SpinSock product={products[3]} />

      <section className="info-cta">
        <p className="info-cta__line">Ready to commit to one?</p>
        <Oval to="/shop">Shop the sock</Oval>
      </section>
    </>
  );
}
