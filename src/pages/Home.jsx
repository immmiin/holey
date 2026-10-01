import Hero from '../sections/Hero.jsx';
import LineUp from '../sections/LineUp.jsx';
import LaundryDay from '../sections/LaundryDay.jsx';
import CareLabel from '../sections/CareLabel.jsx';
import Missing from '../sections/Missing.jsx';
import LostFound from '../sections/LostFound.jsx';
import Receipts from '../sections/Receipts.jsx';
import StickerBoard from '../sections/StickerBoard.jsx';
import Tape from '../components/Tape.jsx';
import { products } from '../data/products.js';
import useTitle from '../lib/useTitle.js';
import '../sections/home.css';

export default function Home() {
  useTitle(null);
  return (
    <>
      <Hero />
      <LaundryDay />
      <LineUp items={products} />
      <div className="tape-cross" aria-hidden="false">
        <Tape items={['One sock only', 'Hole included', 'No pairs', 'No refunds on feelings']} tilt={-3} />
        <Tape items={['Do not pair', 'Wash with feelings', 'Left or right, who’s counting']} tone="pink" tilt={2.5} reverse speed={38} />
      </div>
      <CareLabel />
      <Missing />
      <LostFound />
      <Receipts />
      <StickerBoard />
    </>
  );
}
