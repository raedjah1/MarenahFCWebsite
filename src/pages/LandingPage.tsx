import Hero from '../components/Hero';
import { Pillars } from '../components/Pillars';
import { Gallery } from '../components/Gallery';
import { Dreamers } from '../components/Dreamers';
import { Academies } from '../components/Academies';
import { News } from '../components/News';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <div className="content-section">
        <Pillars />
      </div>
      <div className="content-section">
        <Gallery />
      </div>
      <div className="content-section">
        <Dreamers />
      </div>
      <div className="content-section">
        <Academies />
      </div>
      <div className="content-section">
        <News />
      </div>
    </div>
  );
}; 