import { useRef } from 'react';
import { Link } from 'react-router';
import { holeSrc, holeSrcSet, logoColor, money, sockSrc, sockSrcSet } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import { pushAccent } from '../lib/accent.js';
import { Plus } from './Icons.jsx';
import './card.css';

export default function ProductCard({ p, onHover, wide = false, className = '', sizes = '(min-width: 750px) 25vw, 50vw' }) {
  const cart = useCart();
  const img = useRef(null);
  const release = useRef(null);

  const enter = () => {
    release.current?.();
    release.current = pushAccent(logoColor(p));
    onHover?.(p);
  };
  const leave = () => {
    release.current?.();
    release.current = null;
    onHover?.(null);
  };

  return (
    <article
      className={`card ${wide ? 'card--wide' : ''} ${className}`}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={enter}
      onBlur={leave}
      style={{ '--sock': p.color }}
    >
      <Link to={`/socks/${p.slug}`} viewTransition className="card__link" aria-label={`${p.name}, ${p.subtitle}, ${money(p.price)}`} />
      <div className="card__media">
        <img
          ref={img}
          className="card__img"
          src={sockSrc(p.n, 800)}
          srcSet={sockSrcSet(p.n)}
          sizes={sizes}
          alt={`${p.name} — a single ${p.subtitle.toLowerCase()} sock with a hole in the toe`}
          width="800"
          height="1000"
          loading="lazy"
        />
        <img
          className="card__img card__img--hover"
          src={holeSrc(p.n, 600)}
          srcSet={holeSrcSet(p.n)}
          sizes={sizes}
          alt=""
          width="600"
          height="720"
          loading="lazy"
        />
        <div className="card__quick">
          <button
            type="button"
            className="circle-btn circle-btn--white"
            aria-label={cart.has(p.slug) ? `${p.name} is already in your cart` : `Add ${p.name} to cart`}
            onClick={() => cart.add(p.slug, img.current)}
          >
            <Plus />
          </button>
        </div>
      </div>
      <div className="card__meta">
        <div className="card__title-row">
          <h3 className="card__title">{p.name}</h3>
          <p className="card__price">{money(p.price)}</p>
        </div>
        <p className="card__desc">{p.subtitle}</p>
      </div>
    </article>
  );
}
