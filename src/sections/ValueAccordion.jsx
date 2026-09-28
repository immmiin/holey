import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Parallax from '../components/motion/Parallax.jsx';
import Wipe from '../components/motion/Wipe.jsx';
import { Minus, Plus } from '../components/Icons.jsx';

const rows = [
  {
    title: 'Breathable, aggressively',
    body: 'A hole at the toe means airflow exactly where it counts. Your big toe has been asking for this for years. We listened.'
  },
  {
    title: 'For whichever foot you’re into',
    body: 'Left, right, the one that’s always cold. It doesn’t play favourites. It just picks one and commits.'
  },
  {
    title: 'Pre-distressed, by hand',
    body: 'Every hole is made on purpose, by someone who takes it seriously. No two are alike. Neither are your feet.'
  },
  {
    title: 'Half the pair, all the sock',
    body: 'Fifty percent less sock than a regular pair, and it didn’t give anything up getting there. Well. One thing.'
  }
];

export function Accordion({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="acc">
      {items.map((r, i) => {
        const isOpen = open === i;
        return (
          <div className="acc__row" key={r.title}>
            <h3 className="acc__h">
              <button
                type="button"
                className="acc__title"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                id={`${id}-t-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{r.title}</span>
                <span className="acc__icon">{isOpen ? <Minus /> : <Plus />}</span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`${id}-${i}`}
                  role="region"
                  aria-labelledby={`${id}-t-${i}`}
                  className="acc__panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div className="acc__body t-mono">{r.body}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function ValueAccordion() {
  return (
    <section className="val">
      <div className="val__inner">
        <Parallax className="val__media">
          <img
            src="/img/lifestyle/life-2-1000.webp"
            srcSet="/img/lifestyle/life-2-600.webp 600w, /img/lifestyle/life-2-1000.webp 1000w, /img/lifestyle/life-2-1400.webp 1400w"
            sizes="(min-width: 750px) 48vw, 100vw"
            alt="Close-up of a pink and green Holey sock with a big toe poking through the hole; the toenail is painted pink with the word Holey."
            width="1000"
            height="1116"
            loading="lazy"
          />
        </Parallax>
        <div className="val__content">
          <Wipe text="Everything a sock should be. Minus a bit." className="t-h3 val__heading" />
          <Accordion items={rows} />
        </div>
      </div>
    </section>
  );
}
