import { Link } from 'react-router';
import { ArrowRight } from './Icons.jsx';
import './oval.css';

// Vibe's CTA: a highlighter-yellow ellipse with a thin ink outline,
// uppercase underlined serif label and an arrow.
function Shape() {
  return (
    <svg className="oval__bg" viewBox="0 0 190 48" preserveAspectRatio="none" aria-hidden="true">
      <ellipse cx="95" cy="24" rx="94.25" ry="23.25" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function Oval({ to, children, arrow = true, className = '', ...rest }) {
  const inner = (
    <>
      <Shape />
      <span className="oval__label">{children}</span>
      {arrow && <ArrowRight className="oval__arrow" />}
    </>
  );
  if (to) {
    return (
      <Link to={to} viewTransition className={`oval ${className}`} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={`oval ${className}`} {...rest}>
      {inner}
    </button>
  );
}
