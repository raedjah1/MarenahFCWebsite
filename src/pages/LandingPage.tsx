import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
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
  return (
    <section className="mission-section">
      <div className="mission-container">
        <div className="mission-content">
          <div className="mission-statement">
            <p className="mission-text">
              At Marenah FC, our mission is to identify, develop, and empower young football talent while investing in the long-term success of our players and community. We combine elite football training with access to formal education, trade schools, and life skills development to ensure our players thrive both on and off the field. Our goal is not only to produce top-level athletes, but also to create pathways for academic achievement, vocational training, and meaningful employment. By fostering discipline, leadership, and opportunity, we aim to uplift communities, provide sustainable futures, and inspire the next generation in The Gambia and beyond.
            </p>
          </div>
          <Link to="/team" className="uncover-story-btn">
            UNCOVER THE STORY
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