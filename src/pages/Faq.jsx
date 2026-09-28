import { Accordion } from '../sections/ValueAccordion.jsx';
import Wipe from '../components/motion/Wipe.jsx';
import Oval from '../components/Oval.jsx';
import { StarBadge } from '../sections/Rituals.jsx';
import useTitle from '../lib/useTitle.js';
import './info.css';

const faqs = [
  { title: 'Where’s the other one?', body: 'We don’t know. Nobody knows. That’s sort of the whole thing.' },
  { title: 'Is the hole extra?', body: 'No. The hole is included in the price. Removing it would cost extra, and we won’t do it.' },
  { title: 'Can I buy two?', body: 'You can. They won’t match.' },
  { title: 'Which foot is it for?', body: 'Yes.' },
  { title: 'Do you sell pairs?', body: 'We sell one sock, twice, if you insist. See above re: matching.' },
  { title: 'What size is it?', body: 'One size fits one foot. Most feet qualify.' },
  { title: 'Will the hole get bigger?', body: 'Only if you believe in yourself.' },
  { title: 'Is it machine washable?', body: 'Yes. Cold, gentle, with a little faith. We can’t promise it comes back. Historically, one of them doesn’t.' },
  { title: 'Can I return it?', body: 'You can return the sock within 30 days. You can’t return the feeling of having owned one sock. Nobody can.' },
  { title: 'How does shipping work?', body: 'Free, worldwide, alone. It travels in a padded envelope sized for exactly one sock, with a note that says “sorry.”' },
  { title: 'Why is the quantity locked at one?', body: 'It’s one sock.' }
];

export default function Faq() {
  useTitle('FAQ');
  return (
    <section className="faq">
      <div className="faq__side">
        <p className="t-mono">Frequently asked, rarely answered</p>
        <Wipe as="h1" text="Questions, with holes in them." className="faq__title" start="top 95%" end="top 30%" />
        <div className="faq__badge-zone">
          <StarBadge className="faq__badge" rotate={-12}>
            No pairs were harmed
          </StarBadge>
        </div>
        <p className="t-mono faq__more">Still confused? That’s fair.</p>
        <Oval to="/contact">Ask us anyway</Oval>
      </div>
      <div className="faq__list">
        <Accordion items={faqs} defaultOpen={0} />
      </div>
    </section>
  );
}
