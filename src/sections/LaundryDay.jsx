import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '../lib/scroll.js';

const SRC = '/video/holey-laundry-day-1920x1080';
const POSTER = '/video/holey-laundry-day-poster';
const posterSet = `${POSTER}-960.webp 960w, ${POSTER}-1920.webp 1920w`;

// Full-width brand intro. Sources attach only when the section nears the viewport;
// plays only while visible; reduced motion gets the poster alone.
export default function LaundryDay() {
  const box = useRef(null);
  const video = useRef(null);
  const [still] = useState(reducedMotion);
  const [load, setLoad] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);
  const visible = useRef(false);

  // sources were just attached: make the element pick them up
  useEffect(() => {
    const v = video.current;
    if (!load || !v) return;
    v.load();
    if (visible.current) v.play().catch(() => {});
  }, [load]);

  useEffect(() => {
    if (still) return undefined;
    const el = box.current;
    // load once a sliver is actually on screen (edge-touching alone counts as "intersecting")
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { threshold: 0.01 });
    const vis = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      const v = video.current;
      if (!v) return;
      if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    near.observe(el);
    vis.observe(el);
    return () => {
      near.disconnect();
      vis.disconnect();
    };
  }, [still]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <section ref={box} className="laundry" aria-label="Laundry Day — the Holey brand intro">
      {still ? (
        <img className="laundry__media" src={`${POSTER}-1920.webp`} srcSet={posterSet} sizes="100vw" alt="Holey wordmark in cream on Holey green." width="1920" height="1080" loading="lazy" />
      ) : (
        <>
          <video
            ref={video}
            className="laundry__media"
            poster={`${POSTER}-1920.webp`}
            autoPlay
            muted
            onCanPlay={(e) => !visible.current && e.currentTarget.pause()}
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            aria-label="Laundry Day: a short animated Holey brand intro. No sound."
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
          >
            {load && (
              <>
                <source src={`${SRC}.webm`} type="video/webm" />
                <source src={`${SRC}.mp4`} type="video/mp4" />
              </>
            )}
          </video>
          {/* not native controls — just a way to stop moving content (WCAG 2.2.2) */}
          <button type="button" className="laundry__pause" onClick={toggle} aria-label={paused ? 'Play the intro video' : 'Pause the intro video'}>
            {paused ? (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>
            )}
          </button>
        </>
      )}
    </section>
  );
}
