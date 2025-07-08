import { useEffect, useRef, useState } from 'react';
import './Pillars.css';

export const Pillars = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before the section is fully visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="pillars-section" ref={sectionRef}>
      <div className="pillars-overlay">
        <div className="container">
          <h2 className="pillars-title">OUR PILLARS</h2>
          <div className="pillars-grid">
            <div className="pillar">
              <h3>EDUCATION</h3>
              <div className={`pillar-underline ${isVisible ? 'animate' : ''}`}></div>
            </div>
            <div className="pillar">
              <h3>FOOTBALL</h3>
              <div className={`pillar-underline ${isVisible ? 'animate' : ''}`}></div>
            </div>
            <div className="pillar">
              <h3>CHARACTER</h3>
              <div className={`pillar-underline ${isVisible ? 'animate' : ''}`}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 