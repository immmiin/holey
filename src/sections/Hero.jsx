import { useLayoutEffect, useRef } from 'react';
import Oval from '../components/Oval.jsx';
import SockStage from '../components/sock3d/SockStage.jsx';
import { products } from '../data/products.js';
import { gsap, reducedMotion } from '../lib/scroll.js';

const featured = products[0];

export default function Hero() {
  const section = useRef(null);

  useLayoutEffect(() => {
    const el = section.current;
    if (!el || reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      // Vibe: the hero's bottom corners "peel" round and the content drifts as you leave it
      gsap.to(el, {
        borderBottomLeftRadius: 'clamp(24px, 2.8vw, 56px)',
        borderBottomRightRadius: 'clamp(24px, 2.8vw, 56px)',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '35% top', scrub: true }
      });
      gsap.to('.hero__sock', {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.4 }
      });
      gsap.to('.hero__text', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.4 }
      });
      // intro
      gsap.from('.hero__headline .hero__word', { yPercent: 110, rotate: 4, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.15 });
      gsap.from('.hero__subhead, .hero__mascot', { opacity: 0, y: 20, duration: 0.8, delay: 0.55, ease: 'power3.out' });
      gsap.from('.hero__cta-row', { opacity: 0, y: 24, duration: 0.8, delay: 0.75, ease: 'power3.out' });
      gsap.from('.hero__sock-in', { opacity: 0, scale: 0.85, rotate: -8, duration: 1.3, delay: 0.1, ease: 'expo.out' });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} className="hero" aria-labelledby="hero-title">
      <div className="hero__sock">
        <div className="hero__sock-in">
        <SockStage product={featured} mode="scroll" trigger={section} scrollStart="top top" scrollEnd="bottom top" turns={1} base={-0.45} eager zoom={1.05} sizes="(min-width: 750px) 42vw, 80vw" />
        </div>
      </div>
      <div className="hero__inner">
        <div className="hero__text">
          <img className="hero__mascot" src="/logo/holey_07_nail-icon-H-exclaim.svg" alt="" width="1200" height="930" />
          <h1 id="hero-title" className="hero__headline">
            <span className="hero__line">
              <span className="hero__word">Wear</span> <span className="hero__word">it</span> <span className="hero__word">holey.</span>
            </span>
          </h1>
          <p className="hero__subhead">One sock. One hole. No notes.</p>
        </div>
        <div className="hero__cta-row">
          <Oval to="/shop">Shop the sock</Oval>
        </div>
      </div>
    </section>
  );
}
