import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import { Pillars } from '../components/Pillars';
import { Dreamers } from '../components/Dreamers';
import { Gallery } from '../components/Gallery';
import { Academies } from '../components/Academies';
import { News } from '../components/News';
import './LandingPage.css';

// Hero wrapper with pinning effect
const PinnedHero = () => {
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (heroRef.current) {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top', // pin until mission section covers it
        pin: true,
        pinSpacing: false, // mission section overlays it
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trig => trig.kill());
    };
  }, []);

  return (
    <div ref={heroRef}>
      <Hero />
    </div>
  );
};

// Simple mission section that slides over hero
const Mission = () => {
  const { t } = useTranslation();
  
  return (
    <section className="mission-section">
      <div className="mission-container">
        <div className="mission-content">
          <div className="mission-statement">
            <p className="mission-text">
              {t('mission.text')}
            </p>
          </div>
          <Link to="/who-we-are" className="uncover-story-btn" onClick={() => window.scrollTo(0, 0)}>
            {t('mission.uncover_story')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <PinnedHero />
      <Mission />
      <div className="content-section">
        <Pillars />
      </div>
      <div className="content-section">
        <Dreamers />
      </div>
      <div className="content-section">
        <Gallery />
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