import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import BounceText from '../components/motion/BounceText.jsx';
import { reducedMotion } from '../lib/scroll.js';
import { sockSrc } from '../data/products.js';

const STICKERS = [
  { id: 'bubble', src: '/logo/holey_02_bubble.svg', w: 0.3, x: 0.24, y: 0.3, r: -8, alt: 'Holey bubble logo sticker' },
  { id: 'pink', src: '/logo/holey_05_bubble-pink.svg', w: 0.26, x: 0.72, y: 0.62, r: 7, alt: 'Pink Holey bubble sticker' },
  { id: 'oval', src: '/logo/holey_06_badge-oval.svg', w: 0.18, x: 0.55, y: 0.24, r: -14, alt: 'Holey oval badge sticker' },
  { id: 'h', src: '/logo/holey_03_nail-icon-H.svg', w: 0.1, x: 0.86, y: 0.22, r: 12, alt: 'H nail sticker' },
  { id: 'hx', src: '/logo/holey_07_nail-icon-H-exclaim.svg', w: 0.14, x: 0.12, y: 0.74, r: 5, alt: 'H with exclamation marks sticker' },
  { id: 'nail', src: '/logo/holey_04_nail-icon-holey.svg', w: 0.1, x: 0.42, y: 0.72, r: -6, alt: 'Holey nail sticker' },
  { id: 'sock4', src: sockSrc(4, 400), w: 0.12, x: 0.92, y: 0.78, r: 18, alt: 'Big Toe Energy sock sticker', sock: true },
  { id: 'sock3', src: sockSrc(3, 400), w: 0.11, x: 0.36, y: 0.2, r: -20, alt: 'Purple Reign sock sticker', sock: true }
];
const KEY = 'holey-stickers-v1';

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

export default function StickerBoard() {
  const board = useRef(null);
  const els = useRef({});
  const [size, setSize] = useState(null);
  const state = useRef(null);

  useLayoutEffect(() => {
    const el = board.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!size) return undefined;
    const { w: W, h: H } = size;
    const saved = loadSaved() || {};
    const still = reducedMotion();
    const mobile = W < 600;
    let z = 10;
    // positions are stored normalised so the board can resize
    const S = STICKERS.map((d) => {
      const s = saved[d.id] || d;
      const width = Math.max(64, d.w * W * (mobile ? 1.5 : 1));
      return { ...d, width, x: s.x * W, y: s.y * H, r: s.r, vx: 0, vy: 0, vr: 0, mode: 'idle', z: z++ };
    });
    state.current = S;

    const render = (s) => {
      const el = els.current[s.id];
      if (!el) return;
      const lift = s.mode === 'drag' ? 1.1 : 1;
      el.style.width = `${s.width}px`;
      el.style.transform = `translate3d(${(s.x - s.width / 2).toFixed(1)}px, ${(s.y - s.width / 2).toFixed(1)}px, 0) rotate(${s.r.toFixed(2)}deg) scale(${lift})`;
      el.style.zIndex = String(s.z);
      el.dataset.mode = s.mode;
    };
    S.forEach(render);

    const save = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(S.map((s) => [s.id, { x: s.x / W, y: s.y / H, r: s.r }]))));
      } catch {
        /* fine */
      }
    };
    const slap = (s) => {
      // landing: a quick squash so it reads as "stuck"
      els.current[s.id]?.firstElementChild?.animate(
        [{ transform: 'scale(1.12, 0.9)' }, { transform: 'scale(0.95, 1.06)' }, { transform: 'scale(1)' }],
        { duration: still ? 1 : 320, easing: 'cubic-bezier(.34,1.56,.64,1)' }
      );
      s.mode = 'idle';
      render(s);
      save();
    };

    let raf = 0;
    let last = 0;
    const loop = (now) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      let flying = false;
      S.forEach((s) => {
        if (s.mode !== 'fly') return;
        flying = true;
        const f = Math.pow(0.04, dt); // friction
        s.vx *= f;
        s.vy *= f;
        s.vr *= f;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.r += s.vr * dt;
        const m = s.width * 0.42;
        if (s.x < m) ((s.x = m), (s.vx = Math.abs(s.vx) * 0.55), (s.vr *= -0.6));
        if (s.x > W - m) ((s.x = W - m), (s.vx = -Math.abs(s.vx) * 0.55), (s.vr *= -0.6));
        if (s.y < m) ((s.y = m), (s.vy = Math.abs(s.vy) * 0.55));
        if (s.y > H - m) ((s.y = H - m), (s.vy = -Math.abs(s.vy) * 0.55));
        render(s);
        if (Math.hypot(s.vx, s.vy) < 18) slap(s);
      });
      raf = flying ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const cleanups = S.map((s) => {
      const el = els.current[s.id];
      if (!el) return () => {};
      let off = { x: 0, y: 0 };
      let lastP = { x: 0, y: 0, t: 0 };
      const local = (e) => {
        const r = board.current.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };
      const down = (e) => {
        if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        const p = local(e);
        off = { x: p.x - s.x, y: p.y - s.y };
        lastP = { ...p, t: performance.now() };
        s.mode = 'drag';
        s.vx = s.vy = s.vr = 0;
        s.z = ++z;
        render(s);
      };
      const move = (e) => {
        if (s.mode !== 'drag') return;
        const p = local(e);
        const now = performance.now();
        const dt = Math.max(0.008, (now - lastP.t) / 1000);
        // smoothed velocity for the fling
        s.vx = s.vx * 0.5 + ((p.x - lastP.x) / dt) * 0.5;
        s.vy = s.vy * 0.5 + ((p.y - lastP.y) / dt) * 0.5;
        lastP = { ...p, t: now };
        const m = s.width * 0.42;
        s.x = Math.max(m, Math.min(W - m, p.x - off.x));
        s.y = Math.max(m, Math.min(H - m, p.y - off.y));
        // tilt into the direction of travel
        s.r += Math.max(-3, Math.min(3, s.vx * 0.002));
        render(s);
      };
      const up = (e) => {
        if (s.mode !== 'drag') return;
        el.releasePointerCapture?.(e.pointerId);
        if (still || performance.now() - lastP.t > 80) {
          slap(s);
          return;
        }
        s.vr = s.vx * 0.06;
        s.mode = 'fly';
        render(s);
        kick();
      };
      const key = (e) => {
        const step = e.shiftKey ? 40 : 12;
        const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
        if (!map[e.key]) return;
        e.preventDefault();
        const m = s.width * 0.42;
        s.x = Math.max(m, Math.min(W - m, s.x + map[e.key][0]));
        s.y = Math.max(m, Math.min(H - m, s.y + map[e.key][1]));
        s.z = ++z;
        slap(s);
      };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('keydown', key);
      return () => {
        el.removeEventListener('pointerdown', down);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.removeEventListener('keydown', key);
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
    };
  }, [size]);

  const reset = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* fine */
    }
    setSize((s) => (s ? { ...s } : s));
  };

  return (
    <section className="board-sec" aria-labelledby="board-title">
      <div className="board-sec__head wrap">
        <div>
          <p className="kicker">Free stickers (digital, sadly)</p>
          <BounceText id="board-title" text="Sticker board." className="h2" />
        </div>
        <p className="lead">Drag them. Fling them. They stay exactly where you leave them — unlike socks.</p>
      </div>
      <div className="wrap">
        <div ref={board} className="board" aria-label="Sticker board. Drag stickers, or focus one and use the arrow keys.">
          {STICKERS.map((s) => (
            <div
              key={s.id}
              ref={(el) => (els.current[s.id] = el)}
              className={`sticker ${s.sock ? 'sticker--sock' : ''}`}
              tabIndex={0}
              role="button"
              aria-roledescription="draggable sticker"
              aria-label={`${s.alt}. Use arrow keys to move.`}
              data-cursor="grow"
            >
              <img src={s.src} alt="" draggable="false" />
            </div>
          ))}
          <button type="button" className="board__reset" onClick={reset}>
            Peel everything off
          </button>
        </div>
      </div>
    </section>
  );
}
