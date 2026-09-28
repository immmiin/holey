import { motion } from 'motion/react';
import Oval from '../components/Oval.jsx';
import ProductRow from '../sections/ProductRow.jsx';
import { products } from '../data/products.js';
import { reducedMotion } from '../lib/scroll.js';
import useTitle from '../lib/useTitle.js';
import './info.css';

export default function NotFound() {
  useTitle('Page not found');
  const still = reducedMotion();
  return (
    <>
      <section className="nf">
        <p className="t-mono">Error 404</p>
        <div className="nf__code" aria-hidden="true">
          <span>4</span>
          <span className="nf__hole">
            <svg viewBox="0 0 200 200" className="nf__stitch">
              <circle cx="100" cy="100" r="92" />
            </svg>
            <motion.img
              src="/logo/holey_03_nail-icon-H.svg"
              alt=""
              className="nf__toe"
              animate={still ? undefined : { y: ['30%', '4%', '4%', '30%'], rotate: [-6, 4, -2, -6] }}
              transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
            />
          </span>
          <span>4</span>
        </div>
        <h1 className="nf__title">This page has a hole in it.</h1>
        <p className="t-mono nf__sub">The link may be wrong, or the page wandered off like the other sock. It happens to the best of us.</p>
        <Oval to="/shop">Continue shopping</Oval>
      </section>
      <ProductRow heading="Try one of these instead." items={products.slice(2, 6)} cta={null} padTop={false} />
    </>
  );
}
