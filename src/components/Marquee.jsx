import './marquee.css';

// Infinite CSS marquee (Vibe: 35s linear). Content is repeated enough to
// overfill wide screens, then the whole strip is duplicated for a seamless loop.
export default function Marquee({
  items,
  icon = '/logo/holey_03_nail-icon-H.svg',
  bg = 'var(--pink)',
  fg = 'var(--ink)',
  size = '13px',
  iconSize = '15px',
  pad = '10px',
  gap = '60px',
  innerGap = '15px',
  speed = 35,
  reverse = false,
  repeat = 3,
  className = '',
  label
}) {
  const run = Array.from({ length: repeat }, () => items).flat();
  const strip = (hidden) => (
    <div className="mq__strip" aria-hidden={hidden || undefined}>
      {run.map((t, i) => (
        <span className="mq__item" key={i}>
          {icon && <img className="mq__icon" src={icon} alt="" width="15" height="15" loading="lazy" />}
          <span className="mq__label">{t}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div
      className={`mq ${className}`}
      role="marquee"
      aria-label={label || items.join(', ')}
      style={{
        '--mq-bg': bg,
        '--mq-fg': fg,
        '--mq-size': size,
        '--mq-icon': iconSize,
        '--mq-pad': pad,
        '--mq-gap': gap,
        '--mq-inner': innerGap,
        '--mq-speed': `${speed}s`,
        '--mq-dir': reverse ? 'reverse' : 'normal'
      }}
    >
      <div className="mq__track" aria-hidden="true">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
