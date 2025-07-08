import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { Pillars } from '../components/Pillars';
import { Gallery } from '../components/Gallery';
import { Dreamers } from '../components/Dreamers';
import { Academies } from '../components/Academies';
import { News } from '../components/News';
import './LandingPage.css';

// Small transitional mission section with scroll overlay effect
const Mission = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show mission when user scrolls past 60% of viewport height
      const triggerPoint = window.innerHeight * 0.6;
      setIsVisible(currentScrollY > triggerPoint);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate transform based on scroll position
  const heroHeight = window.innerHeight * 0.8; // 80vh from hero section
  const transformY = Math.max(0, heroHeight - scrollY);

  return (
    <section 
      className={`mission-section ${isVisible ? 'visible' : ''}`}
      style={{
        transform: `translateY(${transformY}px)`
      }}
    >
      <div className="mission-container">
        <div className="mission-content">
          <h2>OUR MISSION</h2>
          <p>Empowering young athletes through football excellence, education, and community development in Senegal.</p>
        </div>
      </div>
    </section>
  );
};

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Mission />
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