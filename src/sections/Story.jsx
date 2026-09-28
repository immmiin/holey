import Oval from '../components/Oval.jsx';

export default function Story() {
  return (
    <section className="story">
      <div className="story__inner">
        <div className="story__art">
          <img src="/logo/holey_05_bubble-pink.svg" alt="Holey, written in puffy pink bubble letters" width="1620" height="930" loading="lazy" />
        </div>
        <div className="story__content">
          <p className="story__body">
            Every sock starts as a pair. Somewhere between the wash and the drawer, one of them leaves to find itself. We sell the one that
            stayed.
          </p>
          <Oval to="/about">Our story</Oval>
        </div>
      </div>
    </section>
  );
}
