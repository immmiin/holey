import Hero from '../sections/Hero.jsx';
import ProductRow from '../sections/ProductRow.jsx';
import ValueAccordion from '../sections/ValueAccordion.jsx';
import Testimonials from '../sections/Testimonials.jsx';
import SpinSock from '../sections/SpinSock.jsx';
import Banner from '../sections/Banner.jsx';
import Story from '../sections/Story.jsx';
import Rituals from '../sections/Rituals.jsx';
import Marquee from '../components/Marquee.jsx';
import { products } from '../data/products.js';
import useTitle from '../lib/useTitle.js';

export default function Home() {
  useTitle(null);
  return (
    <>
      <Hero />
      <ProductRow heading="Every sock loses something. This one started there." items={products.slice(0, 4)} />
      <ValueAccordion />
      <Testimonials />
      <Marquee
        className="mq-light"
        items={['Worn In, Not Worn Out']}
        repeat={8}
        bg="var(--cream)"
        size="13px"
        iconSize="37px"
        pad="36px"
        gap="60px"
        innerGap="60px"
        icon="/logo/holey_04_nail-icon-holey.svg"
      />
      <SpinSock />
      <Banner />
      <Story />
      <Rituals />
    </>
  );
}
