import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Oval from '../components/Oval.jsx';
import useTitle from '../lib/useTitle.js';
import './info.css';

export default function Contact() {
  useTitle('Contact');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!/^\S+@\S+\.\S+$/.test(String(data.get('email') || ''))) {
      setErr('We need an email that works. Unlike the other sock, we will write back.');
      return;
    }
    setErr('');
    setSent(true);
  };

  return (
    <section className="contact">
      <h1 className="contact__title">Contact</h1>
      <p className="t-mono contact__lede">For press, wholesale, lost-sock sightings and emotional support. We reply within 3–5 business days, or once, depending.</p>
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="ok" className="contact__done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} role="status">
            <img src="/logo/holey_04_nail-icon-holey.svg" alt="" width="1110" height="1290" />
            <p className="t-h3">Message received.</p>
            <p className="t-mono">We’ll get back to you. Like the other sock: eventually, maybe.</p>
            <Oval to="/shop">Back to the sock</Oval>
          </motion.div>
        ) : (
          <motion.form key="form" className="contact__form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -12 }}>
            <div className="contact__row">
              <label className="field">
                <span className="t-mono">Name</span>
                <input name="name" autoComplete="name" />
              </label>
              <label className="field">
                <span className="t-mono">Email *</span>
                <input name="email" type="email" autoComplete="email" required aria-invalid={!!err || undefined} aria-describedby="contact-err" />
              </label>
            </div>
            <label className="field">
              <span className="t-mono">Phone</span>
              <input name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="field">
              <span className="t-mono">Comment</span>
              <textarea name="comment" rows="5" placeholder="Describe the missing sock in as much detail as you can bear." />
            </label>
            <p id="contact-err" className="t-mono contact__err" aria-live="polite">
              {err}
            </p>
            <Oval type="submit">Send</Oval>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
