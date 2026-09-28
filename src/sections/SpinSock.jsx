import { useRef } from 'react';
import SockStage from '../components/sock3d/SockStage.jsx';
import Wipe from '../components/motion/Wipe.jsx';
import { products } from '../data/products.js';

// Vibe's spinning can: a giant wiped word behind a product that turns with the scroll.
export default function SpinSock({ product = products[2] }) {
  const section = useRef(null);
  return (
    <section className="spin" ref={section}>
      <div className="spin__inner">
        <Wipe as="p" text="Holey Holey" className="spin__text" start="top 85%" end="center 45%" aria-hidden="true" />
        <div className="spin__sock">
          <SockStage product={product} mode="scroll" trigger={section} turns={1.5} base={0.4} float={0.6} shadow={false} zoom={1.25} sizes="(min-width: 750px) 40vw, 70vw" />
        </div>
      </div>
    </section>
  );
}
