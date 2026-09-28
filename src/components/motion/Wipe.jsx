import { useLayoutEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../../lib/scroll.js';

// Vibe's heading "wipe": letters start faded and fill in with ink as the
// heading scrolls through the viewport (scrubbed, not timed).
export default function Wipe({ as: Tag = 'h2', text, className = '', start = 'top 88%', end = 'top 45%', ...rest }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const chars = el.querySelectorAll('.wipe__c');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: el, start, end, scrub: 0.6 }
        }
      );
    }, el);
    return () => ctx.revert();
  }, [text, start, end]);

  const words = text.split(' ');
  return (
    <Tag ref={ref} className={`wipe ${className}`} aria-label={text} {...rest}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden="true" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {[...w].map((c, ci) => (
            <span key={ci} className="wipe__c" style={{ display: 'inline-block' }}>
              {c}
            </span>
          ))}
          {wi < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
