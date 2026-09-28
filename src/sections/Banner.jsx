import Parallax from '../components/motion/Parallax.jsx';

export default function Banner({ src = 1, alt, position = 'center 88%' }) {
  return (
    <section className="banner">
      <div className="banner__inner">
        <Parallax className="banner__media">
          <img
            src={`/img/lifestyle/life-${src}-1400.webp`}
            srcSet={`/img/lifestyle/life-${src}-600.webp 600w, /img/lifestyle/life-${src}-1000.webp 1000w, /img/lifestyle/life-${src}-1400.webp 1400w`}
            sizes="100vw"
            alt={alt || 'Two feet side by side in pink and green Holey socks, both big toes poking out of matching holes. One nail reads Holey, the other has an exclamation mark.'}
            width="1400"
            height="1563"
            loading="lazy"
            style={{ objectPosition: position }}
          />
        </Parallax>
      </div>
    </section>
  );
}
