import { useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { products } from '../data/products.js';
import { ArrowLong, Instagram, TikTok, XLogo } from './Icons.jsx';
import Pop from './motion/Pop.jsx';
import './footer.css';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | error | done

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState('error');
      return;
    }
    setState('done');
  };

  return (
    <div className="ft__news">
      <h2 className="ft__news-heading">Get notified when we lose more socks.</h2>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.p
            key="done"
            className="ft__done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
          >
            <img src="/logo/holey_07_nail-icon-H-exclaim.svg" alt="" width="46" height="36" />
            <span>
              You're on the list. We'll email you the moment something goes missing.
              <button type="button" className="ft__again" onClick={() => (setEmail(''), setState('idle'))}>
                Add another inbox
              </button>
            </span>
          </motion.p>
        ) : (
          <motion.form key="form" className="ft__form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
            <label className="ft__field">
              <span className="visually-hidden">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(e) => (setEmail(e.target.value), state === 'error' && setState('idle'))}
                aria-invalid={state === 'error' || undefined}
                aria-describedby="ft-msg"
              />
              <button type="submit" className="ft__submit" aria-label="Subscribe">
                <ArrowLong />
              </button>
            </label>
            <p id="ft-msg" className="ft__msg" aria-live="polite">
              {state === 'error' ? "That email has a hole in it. Try again." : ' '}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="ft">
      <div className="rule ft__divider" aria-hidden="true" />
      <div className="ft__row">
        <div className="ft__left">
          <Newsletter />
          <Pop className="ft__stamp" rotate={-8}>
            <img src="/logo/holey_06_badge-oval.svg" alt="Holey oval badge" width="1350" height="930" loading="lazy" />
          </Pop>
        </div>
        <nav className="ft__cols" aria-label="Footer">
          <ul className="ft__list">
            {products.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link to={`/socks/${p.slug}`} viewTransition>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="ft__list">
            {products.slice(3).map((p) => (
              <li key={p.slug}>
                <Link to={`/socks/${p.slug}`} viewTransition>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="ft__list">
            <li>
              <Link to="/shop" viewTransition>All Socks</Link>
            </li>
            <li>
              <Link to="/about" viewTransition>About</Link>
            </li>
            <li>
              <Link to="/faq" viewTransition>FAQ</Link>
            </li>
            <li>
              <Link to="/contact" viewTransition>Contact</Link>
            </li>
          </ul>
          <ul className="ft__list">
            <li>
              <Link to="/legal/terms" viewTransition>Terms of Wear</Link>
            </li>
            <li>
              <Link to="/legal/privacy" viewTransition>Privacy (Toes Excluded)</Link>
            </li>
            <li>
              <Link to="/legal/returns" viewTransition>Returns &amp; Feelings</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="rule ft__divider" aria-hidden="true" />
      <div className="ft__lockup-zone">
        <p className="ft__lockup" aria-label="Wear it holey.">
          Wear it holey.
        </p>
        <img className="ft__ornament" src="/logo/holey_04_nail-icon-holey.svg" alt="" loading="lazy" width="1110" height="1290" />
      </div>
      <div className="ft__social">
        <a className="circle-btn" href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Holey on Instagram (fake)">
          <Instagram />
        </a>
        <a className="circle-btn" href="https://tiktok.com/" target="_blank" rel="noreferrer" aria-label="Holey on TikTok (fake)">
          <TikTok />
        </a>
        <a className="circle-btn" href="https://x.com/" target="_blank" rel="noreferrer" aria-label="Holey on X (fake)">
          <XLogo />
        </a>
      </div>
      <p className="ft__legal">Please wear responsibly. One foot at a time.</p>
      <p className="ft__copy">
        Copyright ©{new Date().getFullYear()}. Holey. All rights reserved. The other sock reserves none.
      </p>
    </footer>
  );
}
