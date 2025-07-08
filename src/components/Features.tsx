import { useEffect, useRef, useState } from 'react';
import './Features.css';
import visionIcon from '../assets/images/visionpro.png';
import povGym from '../assets/videos/pov_gym.mp4';

// Individual feature section components
const VirtualMeetups = () => {
  const [currentEvent, setCurrentEvent] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const animationRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Animation observer
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view', 'visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -15% 0px' }
    );

    if (animationRef.current) {
      animationRef.current.classList.add('scroll-reveal');
      animationObserver.observe(animationRef.current);
    }

    // Event rotation interval
    const interval = setInterval(() => {
      setCurrentEvent(prev => (prev + 1) % meetupEvents.length);
    }, 3000);

    return () => {
      animationObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleJoinClick = () => {
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 2000);
  };

  const meetupEvents = [
    {
      title: "VR Concert Experience",
      time: "7:00 PM",
      date: "May 15",
      attendees: 1250,
      type: "Live Stream"
    },
    {
      title: "Interactive Art Gallery",
      time: "2:30 PM",
      date: "May 16",
      attendees: 840,
      type: "Interactive Vision"
    },
    {
      title: "Tech Talk: Future of VR",
      time: "6:00 PM",
      date: "May 18",
      attendees: 620,
      type: "Virtual Meetup"
    }
  ];

  const activeEvent = meetupEvents[currentEvent];
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  // Generate calendar dates
  const calendarDates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDates.push(i);
  }

  return (
    <div className="feature-section virtual-meetups-section">
      <div className="feature-content-wrapper">
        <div className="feature-image-side" ref={animationRef}>
          <div className="calendar-container">
            <div className="calendar-header">
              <div className="calendar-month">
                <span>{currentMonth}</span>
                <div>
                  <i className="fas fa-chevron-left"></i>
                  <i className="fas fa-chevron-right" style={{ marginLeft: '10px' }}></i>
                </div>
              </div>
              <div className="calendar-weekdays">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>
            </div>
            <div className="calendar-body">
              <div className="calendar-dates">
                {calendarDates.map((date) => {
                  const isActive = date === 15 && currentEvent === 0 || 
                                  date === 16 && currentEvent === 1 || 
                                  date === 18 && currentEvent === 2;
                  const hasEvent = date === 15 || date === 16 || date === 18;
                  
                  return (
                    <div 
                      key={date} 
                      className={`calendar-date ${isActive ? 'active' : ''} ${hasEvent ? 'has-event' : ''}`}
                      onClick={() => {
                        if (date === 15) setCurrentEvent(0);
                        else if (date === 16) setCurrentEvent(1);
                        else if (date === 18) setCurrentEvent(2);
                      }}
                    >
                      {date}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="event-details">
              <div className="event-type">
                <span className={`event-badge ${activeEvent.type === 'Live Stream' ? 'live' : 
                                              activeEvent.type === 'Interactive Vision' ? 'interactive' : 
                                              'meetup'}`}>
                  {activeEvent.type}
                </span>
              </div>
              <div className="event-title">{activeEvent.title}</div>
              <div className="event-time">
                <i className="fas fa-clock"></i> {activeEvent.time}, {activeEvent.date}
              </div>
              <div className="event-attendees">
                <i className="fas fa-user-friends"></i> {activeEvent.attendees} attending
              </div>
              <button 
                className={`join-button ${buttonClicked ? 'clicked' : ''}`}
                onClick={handleJoinClick}
              >
                Join Event
              </button>
            </div>
          </div>
        </div>
        
        <div className="feature-text-side">
          <h2 className="feature-title" style={{ paddingBottom: '1rem' }}>Virtual Meetups</h2>
          <div className="feature-divider" style={{ margin: '1.5rem 0' }} />
          <p className="feature-description" style={{ paddingBottom: '2rem' }}>
            Experience events like never before in immersive virtual environments. Connect with others, 
            attend live performances, and participate in interactive experiences from anywhere in the world.
          </p>
          
          <div className="feature-highlights">
            <div className="highlight" style={{ marginBottom: '1.5rem' }}>
              <div className="highlight-icon">
                <i className="fas fa-video"></i>
              </div>
              <div className="highlight-text">
                <h4>Live Streaming</h4>
                <p>Attend concerts, conferences, and performances in real-time with high-quality streaming.</p>
              </div>
            </div>
            
            <div className="highlight" style={{ marginBottom: '1.5rem' }}>
              <div className="highlight-icon">
                <i className="fas fa-vr-cardboard"></i>
              </div>
              <div className="highlight-text">
                <h4>Interactive Visions</h4>
                <p>Engage with content that responds to your actions and choices in real-time.</p>
              </div>
            </div>
            
            <div className="highlight">
              <div className="highlight-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="highlight-text">
                <h4>Scheduled Events</h4>
                <p>Browse upcoming events and add them to your calendar with automatic reminders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VRExperience = ({ showVRDemo, toggleVRDemo }: { showVRDemo: boolean; toggleVRDemo: () => void }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const animationRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Animation observer
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view', 'visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -15% 0px' }
    );

    if (animationRef.current) {
      animationRef.current.classList.add('scroll-reveal');
      animationObserver.observe(animationRef.current);
    }

    // Text rotation interval
    const interval = setInterval(() => {
      setCurrentTextIndex(prev => (prev + 1) % 3);
    }, 2000);

    return () => {
      animationObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleAppButtonClick = () => {
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 2000);
  };

  const handleExploreVRClick = () => {
    toggleVRDemo();
    
    // If opening the demo, scroll to it
    if (!showVRDemo) {
      setTimeout(() => {
        const demoSection = document.getElementById('vr-demo-section');
        if (demoSection) {
          demoSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const screenTexts = ["Immerse", "Explore", "Experience"];
  
  return (
    <section className="feature-section vr-experience-section">
      <div className="feature-container">
        <div className="feature-content-wrapper reverse">
          <div className="feature-text-side">
            <h2 className="feature-title text-reveal" style={{ color: 'white' }}>IMMERSIVE VR EXPERIENCE</h2>
            <div className="feature-divider"></div>
            <p className="feature-description">
              Step into immersive virtual worlds and experience content in a new way - through your eyes. Our VR platform transports you to new realities where you can explore, create, and connect with others.
            </p>
            <div className="feature-tags">
              <span className="tag">360° Perspective</span>
              <span className="tag">Education</span>
              <span className="tag">Entertainment</span>
            </div>
            <div className="feature-cta">
              <button 
                className="secondary-button"
                onClick={handleExploreVRClick}
              >
                {showVRDemo ? 'Hide VR Demo' : 'Explore VR Worlds'}
              </button>
            </div>
          </div>
          <div className="feature-image-side">
            <div 
              className="vr-headset-container animation-element slide-in-right" 
              ref={animationRef}
            >
              <div className="vision-image-container">
                <img 
                  src={visionIcon} 
                  alt="Vision Pro" 
                  className="vision-image" 
                />
                <div className="vr-screen-overlay">
                  <div className="vr-screen-content">
                    <div className="vr-app-logo">
                      <span>VR World</span>
                    </div>
                    <div className="vr-screen-text">
                      {screenTexts.map((text, idx) => (
                        <span key={idx} className={currentTextIndex === idx ? 'active' : ''}>
                          {text}
                        </span>
                      ))}
                    </div>
                    <button 
                      className={`vr-app-button ${buttonClicked ? 'clicked' : ''}`}
                      onClick={handleAppButtonClick}
                    >
                      {buttonClicked ? 'Launching...' : 'Enter VR'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// New VR Demo component
const VRDemo = ({ isVisible }: { isVisible: boolean }) => {
  const demoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVisible && demoRef.current) {
      demoRef.current.classList.add('visible');
    } else if (demoRef.current) {
      demoRef.current.classList.remove('visible');
    }
    
    // Auto-play video when section becomes visible
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(e => console.log('Auto-play prevented:', e));
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section id="vr-demo-section" className="feature-section vr-demo-section" ref={demoRef}>
      <div className="feature-container">
        <h2 className="demo-title">Experience Virtual Reality</h2>
        <div className="feature-divider"></div>
        <p className="demo-description">
          Watch how our VR technology transforms the way you interact with digital content.
          Immerse yourself in stunning virtual environments and experience the future of entertainment.
        </p>
        <div className="video-container">
          <div className="video-wrapper">
            <video 
              ref={videoRef}
              src={povGym}
              autoPlay
              preload="metadata"
              className="demo-video"
              muted
              loop
              playsInline
            ></video>
          </div>
        </div>
        <div className="demo-features">
          <div className="demo-feature">
            <div className="demo-feature-icon">
              <i className="fas fa-vr-cardboard"></i>
            </div>
            <div className="demo-feature-text">
              <h4>Immersive Experiences</h4>
              <p>Fully immersive experiences that transport you to new worlds</p>
            </div>
          </div>
          <div className="demo-feature">
            <div className="demo-feature-icon">
              <i className="fas fa-gamepad"></i>
            </div>
            <div className="demo-feature-text">
              <h4>Interactive Content</h4>
              <p>Interact naturally with digital objects and environments</p>
            </div>
          </div>
          <div className="demo-feature">
            <div className="demo-feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="demo-feature-text">
              <h4>Social Presence</h4>
              <p>Connect with friends in shared virtual spaces</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialSpaces = () => {
  const [activeSpace, setActiveSpace] = useState(0);
  const [buttonClicked, setButtonClicked] = useState(false);
  const animationRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Animation observer
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view', 'visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -15% 0px' }
    );

    if (animationRef.current) {
      animationRef.current.classList.add('scroll-reveal');
      animationObserver.observe(animationRef.current);
    }

    // Space rotation interval
    const interval = setInterval(() => {
      setActiveSpace(prev => (prev + 1) % communitySpaces.length);
    }, 4000);

    // Create particles
    if (animationRef.current) {
      const particlesContainer = animationRef.current.querySelector('.space-particles');
      if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.width = `${Math.random() * 3 + 1}px`;
          particle.style.height = particle.style.width;
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDelay = `${Math.random() * 15}s`;
          particlesContainer.appendChild(particle);
        }
      }

      // Create connection lines
      const linesContainer = animationRef.current.querySelector('.connection-lines');
      if (linesContainer) {
        for (let i = 0; i < 15; i++) {
          const line = document.createElement('div');
          line.className = 'connection-line';
          line.style.top = `${Math.random() * 100}%`;
          line.style.left = `${Math.random() * 50}%`;
          line.style.width = `${Math.random() * 150 + 50}px`;
          line.style.transform = `rotate(${Math.random() * 360}deg)`;
          line.style.animationDelay = `${Math.random() * 4}s`;
          linesContainer.appendChild(line);
        }
      }
    }

    return () => {
      animationObserver.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleEnterClick = () => {
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 2000);
  };

  const communitySpaces = [
    {
      name: "AI Creative Studio",
      theme: "AI-Generated Worlds",
      users: 142,
      features: ["Voice Chat", "Tipping & Rewards", "AI Prompting"]
    },
    {
      name: "Creator Commons",
      theme: "Community Showcase",
      users: 118,
      features: ["Tipping & Rewards", "Generated Experiences", "Collaboration Tools"]
    },
    {
      name: "Innovation Hub",
      theme: "Futuristic Setting",
      users: 156,
      features: ["AI Prompting", "Tipping & Rewards", "Developer Tools"]
    }
  ];

  const activeSpaceData = communitySpaces[activeSpace];
  const cubeIcons = [
    "🤖", // front - AI
    "🎨", // back - creative
    "💡", // right - innovation
    "🏆", // left - rewards
    "🎵", // top - music
    "✨"  // bottom - magic
  ];

  return (
    <section className="feature-section social-spaces-section">
      <div className="feature-container">
        <div className="feature-content-wrapper">
          <div className="feature-image-side" ref={animationRef}>
            <div className="space-visualization-container">
              <div className="space-visualization">
                <div className="space-particles"></div>
                <div className="connection-lines"></div>
                
                <div className="space-cube">
                  <div className="cube-face front">
                    <div className="cube-content">{cubeIcons[0]}</div>
                  </div>
                  <div className="cube-face back">
                    <div className="cube-content">{cubeIcons[1]}</div>
                  </div>
                  <div className="cube-face right">
                    <div className="cube-content">{cubeIcons[2]}</div>
                  </div>
                  <div className="cube-face left">
                    <div className="cube-content">{cubeIcons[3]}</div>
                  </div>
                  <div className="cube-face top">
                    <div className="cube-content">{cubeIcons[4]}</div>
                  </div>
                  <div className="cube-face bottom">
                    <div className="cube-content">{cubeIcons[5]}</div>
                  </div>
                </div>
                
                <div className="space-info-panel">
                  <div className="space-name">{activeSpaceData.name}</div>
                  <div className="space-theme">{activeSpaceData.theme}</div>
                  <div className="space-users">
                    <i className="fas fa-users"></i> {activeSpaceData.users} users online
                  </div>
                  <div className="space-features">
                    {activeSpaceData.features.map((feature, index) => (
                      <div key={index} className="feature-tag">
                        {feature === "Tipping & Rewards" && <i className="fas fa-coins"></i>}
                        {feature === "AI Prompting" && <i className="fas fa-robot"></i>}
                        {feature === "Generated Experiences" && <i className="fas fa-magic"></i>}
                        {feature}
                      </div>
                    ))}
                  </div>
                  <button 
                    className={`enter-button ${buttonClicked ? 'clicked' : ''}`}
                    onClick={handleEnterClick}
                  >
                    Enter Space
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-text-side">
            <h2 className="feature-title">Community Experiences</h2>
            <div className="feature-divider"></div>
            <p className="feature-description">
              Explore AI-powered community spaces where creativity meets technology. Our virtual environments offer 
              innovative ways to collaborate, create, and reward contributions in the digital realm.
            </p>
            
            <div className="feature-highlights">
              <div className="highlight">
                <div className="highlight-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="highlight-text">
                  <h4>Community Driven</h4>
                  <p>Join existing communities or create your own space with custom rules and themes.</p>
                </div>
              </div>
              
              <div className="highlight">
                <div className="highlight-icon">
                  <i className="fas fa-coins"></i>
                </div>
                <div className="highlight-text">
                  <h4>Tipping & Rewards</h4>
                  <p>Support creators and earn rewards for your contributions to the community.</p>
                </div>
              </div>
              
              <div className="highlight">
                <div className="highlight-icon">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="highlight-text">
                  <h4>AI Prompting</h4>
                  <p>Generate unique experiences and content using our advanced AI prompting tools.</p>
                </div>
              </div>
              
              <div className="highlight">
                <div className="highlight-icon">
                  <i className="fas fa-magic"></i>
                </div>
                <div className="highlight-text">
                  <h4>Generated Experiences</h4>
                  <p>Create and share AI-generated environments that evolve with your community.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Features = () => {
  const [showVRDemo, setShowVRDemo] = useState(true);

  const toggleVRDemo = () => {
    setShowVRDemo(!showVRDemo);
  };

  return (
    <div id="features">
      <VirtualMeetups />
      <VRExperience showVRDemo={showVRDemo} toggleVRDemo={toggleVRDemo} />
      <VRDemo isVisible={showVRDemo} />
      <SocialSpaces />
    </div>
  );
}; 