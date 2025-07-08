import React, { useState } from 'react';
import './FacilityPage.css';

interface FacilityFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  area: string;
  capacity?: string;
  features: string[];
}

interface TimelineEvent {
  id: number;
  phase: string;
  date: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  completion: number;
}

export const FacilityPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'academy' | 'timeline' | 'sustainability'>('overview');
  const [selectedFeature, setSelectedFeature] = useState<FacilityFeature | null>(null);

  const facilityFeatures: FacilityFeature[] = [
    {
      id: 1,
      title: "Main Stadium",
      description: "State-of-the-art football stadium with modern amenities and FIFA-standard facilities",
      icon: "fas fa-futbol",
      area: "15,000 m²",
      capacity: "25,000 spectators",
      features: [
        "FIFA-approved natural grass pitch",
        "Advanced floodlighting system",
        "VIP boxes and premium seating",
        "Modern changing facilities",
        "Medical center and recovery rooms"
      ]
    },
    {
      id: 2,
      title: "Training Complex",
      description: "Professional training facilities with multiple pitches and specialized equipment",
      icon: "fas fa-running",
      area: "8,000 m²",
      features: [
        "4 full-size training pitches",
        "Indoor training facility",
        "Fitness and conditioning center",
        "Video analysis rooms",
        "Recovery and physiotherapy center"
      ]
    },
    {
      id: 3,
      title: "Academy Center",
      description: "Comprehensive youth development facility fostering the next generation of talent",
      icon: "fas fa-graduation-cap",
      area: "5,000 m²",
      features: [
        "Youth training pitches",
        "Residential accommodation",
        "Educational facilities",
        "Dining and recreation areas",
        "Player development programs"
      ]
    },
    {
      id: 4,
      title: "Sports Science Hub",
      description: "Advanced sports science and medical facilities for player optimization",
      icon: "fas fa-microscope",
      area: "2,000 m²",
      features: [
        "Performance analysis laboratory",
        "Biomechanics and movement analysis",
        "Nutrition and dietary center",
        "Psychology and mental wellness",
        "Research and development facility"
      ]
    },
    {
      id: 5,
      title: "Community Center",
      description: "Multipurpose facility serving the local Marenah community",
      icon: "fas fa-users",
      area: "3,000 m²",
      features: [
        "Multi-sport courts",
        "Community meeting halls",
        "Local business spaces",
        "Cultural event venues",
        "Educational workshops"
      ]
    },
    {
      id: 6,
      title: "Hospitality Village",
      description: "Premium entertainment and dining facilities for matchdays and events",
      icon: "fas fa-utensils",
      area: "4,000 m²",
      features: [
        "Restaurant and bars",
        "Conference facilities",
        "Event hosting spaces",
        "Merchandise and retail",
        "Parking and transport hub"
      ]
    }
  ];

  const timeline: TimelineEvent[] = [
    {
      id: 1,
      phase: "Land Acquisition & Planning",
      date: "2024 Q1",
      status: "completed",
      description: "Secured 50-hectare site in Marenah and completed initial planning approvals",
      completion: 100
    },
    {
      id: 2,
      phase: "Infrastructure Development",
      date: "2024 Q2-Q3",
      status: "in-progress",
      description: "Site preparation, utilities installation, and foundation work for main facilities",
      completion: 65
    },
    {
      id: 3,
      phase: "Main Stadium Construction",
      date: "2024 Q4 - 2025 Q3",
      status: "upcoming",
      description: "Construction of the main stadium with seating, pitch, and supporting facilities",
      completion: 0
    },
    {
      id: 4,
      phase: "Training Complex Build",
      date: "2025 Q1 - Q4",
      status: "upcoming",
      description: "Development of training pitches, academy facilities, and sports science center",
      completion: 0
    },
    {
      id: 5,
      phase: "Final Phase & Opening",
      date: "2026 Q1-Q2",
      status: "upcoming",
      description: "Completion of community center, hospitality areas, and grand opening celebration",
      completion: 0
    }
  ];

  const sustainabilityFeatures = [
    {
      title: "Solar Power System",
      description: "100% renewable energy through comprehensive solar panel installation",
      icon: "fas fa-sun",
      impact: "Carbon Neutral Operations"
    },
    {
      title: "Rainwater Harvesting",
      description: "Advanced water collection and recycling system for pitch irrigation",
      icon: "fas fa-tint",
      impact: "50% Water Conservation"
    },
    {
      title: "Sustainable Materials",
      description: "Locally sourced and eco-friendly construction materials throughout",
      icon: "fas fa-leaf",
      impact: "Reduced Carbon Footprint"
    },
    {
      title: "Green Transportation",
      description: "Electric vehicle charging stations and public transport integration",
      icon: "fas fa-charging-station",
      impact: "Clean Mobility Hub"
    },
    {
      title: "Waste Management",
      description: "Zero-waste facility with comprehensive recycling and composting",
      icon: "fas fa-recycle",
      impact: "100% Waste Diversion"
    },
    {
      title: "Native Landscaping",
      description: "Indigenous plants and trees to support local ecosystem",
      icon: "fas fa-tree",
      impact: "Biodiversity Enhancement"
    }
  ];

  const renderFeatureCard = (feature: FacilityFeature) => (
    <div 
      key={feature.id} 
      className="feature-card"
      onClick={() => setSelectedFeature(feature)}
    >
      <div className="feature-icon">
        <i className={feature.icon}></i>
      </div>
      <div className="feature-info">
        <h3>{feature.title}</h3>
        <p className="feature-description">{feature.description}</p>
        <div className="feature-specs">
          <span className="spec">
            <i className="fas fa-expand-arrows-alt"></i>
            {feature.area}
          </span>
          {feature.capacity && (
            <span className="spec">
              <i className="fas fa-users"></i>
              {feature.capacity}
            </span>
          )}
        </div>
      </div>
      <div className="feature-arrow">
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
  );

  return (
    <div className="facility-page">
      {/* Navigation Tabs */}
      <div className="facility-navigation">
        <div className="facility-nav-container">
          <button 
            className={`facility-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-building"></i>
            OVERVIEW
          </button>
          <button 
            className={`facility-nav-tab ${activeTab === 'academy' ? 'active' : ''}`}
            onClick={() => setActiveTab('academy')}
          >
            <i className="fas fa-graduation-cap"></i>
            ACADEMY
          </button>
          <button 
            className={`facility-nav-tab ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <i className="fas fa-calendar-alt"></i>
            TIMELINE
          </button>
          <button 
            className={`facility-nav-tab ${activeTab === 'sustainability' ? 'active' : ''}`}
            onClick={() => setActiveTab('sustainability')}
          >
            <i className="fas fa-leaf"></i>
            SUSTAINABILITY
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="facility-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="section-header">
              <h2>FACILITY OVERVIEW</h2>
              <p>A world-class football complex designed to elevate Marenah FC to international standards</p>
            </div>

            {/* Virtual Tour Section */}
            <div className="virtual-tour">
              <div className="tour-preview">
                <div className="tour-placeholder">
                  <i className="fas fa-vr-cardboard"></i>
                  <h3>3D Virtual Tour</h3>
                  <p>Experience our future facility in immersive 3D</p>
                  <button className="tour-btn">
                    <i className="fas fa-play"></i>
                    Launch Virtual Tour
                  </button>
                </div>
              </div>
              <div className="tour-features">
                <h3>Tour Highlights</h3>
                <ul>
                  <li><i className="fas fa-check"></i> 360° Stadium Views</li>
                  <li><i className="fas fa-check"></i> Interactive Facility Map</li>
                  <li><i className="fas fa-check"></i> Architectural Details</li>
                  <li><i className="fas fa-check"></i> Future Technology Preview</li>
                </ul>
              </div>
            </div>

            {/* Facility Features Grid */}
            <div className="features-grid">
              {facilityFeatures.map(renderFeatureCard)}
            </div>
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="academy-section">
            <div className="section-header">
              <h2>MARENAH FC ACADEMY</h2>
              <p>Developing the next generation of Senegalese football talent</p>
            </div>

            <div className="academy-content">
              <div className="academy-overview">
                <div className="academy-vision">
                  <h3>Our Vision</h3>
                  <p>To create a world-class youth development program that combines football excellence with education, producing well-rounded individuals who can compete at the highest levels of international football while representing Senegalese values and culture.</p>
                </div>

                <div className="academy-programs">
                  <h3>Development Programs</h3>
                  <div className="programs-grid">
                    <div className="program-card">
                      <div className="program-icon">
                        <i className="fas fa-child"></i>
                      </div>
                      <h4>Youth Development (12-16)</h4>
                      <p>Foundational skills development with emphasis on technical ability and game intelligence</p>
                    </div>
                    
                    <div className="program-card">
                      <div className="program-icon">
                        <i className="fas fa-user-graduate"></i>
                      </div>
                      <h4>Pre-Professional (17-19)</h4>
                      <p>Advanced training preparing players for professional football and higher education pathways</p>
                    </div>
                    
                    <div className="program-card">
                      <div className="program-icon">
                        <i className="fas fa-trophy"></i>
                      </div>
                      <h4>Elite Pathway</h4>
                      <p>Direct route to Marenah FC first team and international opportunities</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="academy-facilities">
                <h3>Academy Facilities</h3>
                <div className="academy-features">
                  <div className="academy-feature">
                    <i className="fas fa-futbol"></i>
                    <div>
                      <h4>6 Training Pitches</h4>
                      <p>Age-appropriate sized pitches with modern drainage and lighting</p>
                    </div>
                  </div>
                  
                  <div className="academy-feature">
                    <i className="fas fa-home"></i>
                    <div>
                      <h4>Residential Accommodation</h4>
                      <p>Modern dormitories for 200 academy players with study areas</p>
                    </div>
                  </div>
                  
                  <div className="academy-feature">
                    <i className="fas fa-book"></i>
                    <div>
                      <h4>Educational Center</h4>
                      <p>Classrooms and learning facilities ensuring academic excellence</p>
                    </div>
                  </div>
                  
                  <div className="academy-feature">
                    <i className="fas fa-heartbeat"></i>
                    <div>
                      <h4>Medical Center</h4>
                      <p>Dedicated healthcare facility with sports medicine specialists</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-section">
            <div className="section-header">
              <h2>CONSTRUCTION TIMELINE</h2>
              <p>Track our progress as we build the future of Senegalese football</p>
            </div>

            <div className="timeline-container">
              {timeline.map((event, index) => (
                <div key={event.id} className={`timeline-item ${event.status}`}>
                  <div className="timeline-marker">
                    <div className="marker-inner">
                      {event.status === 'completed' && <i className="fas fa-check"></i>}
                      {event.status === 'in-progress' && <i className="fas fa-cog fa-spin"></i>}
                      {event.status === 'upcoming' && <i className="fas fa-clock"></i>}
                    </div>
                  </div>
                  
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h3>{event.phase}</h3>
                      <span className="timeline-date">{event.date}</span>
                    </div>
                    <p>{event.description}</p>
                    
                    {event.status === 'in-progress' && (
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${event.completion}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{event.completion}% Complete</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="construction-stats">
              <div className="construction-stat">
                <i className="fas fa-hard-hat"></i>
                <div>
                  <span className="stat-number">350+</span>
                  <span className="stat-label">Local Jobs Created</span>
                </div>
              </div>
              
              <div className="construction-stat">
                <i className="fas fa-truck"></i>
                <div>
                  <span className="stat-number">85%</span>
                  <span className="stat-label">Local Materials Used</span>
                </div>
              </div>
              
              <div className="construction-stat">
                <i className="fas fa-calendar"></i>
                <div>
                  <span className="stat-number">24</span>
                  <span className="stat-label">Months to Completion</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sustainability' && (
          <div className="sustainability-section">
            <div className="section-header">
              <h2>SUSTAINABLE DEVELOPMENT</h2>
              <p>Building responsibly for our community and environment</p>
            </div>

            <div className="sustainability-grid">
              {sustainabilityFeatures.map((feature, index) => (
                <div key={index} className="sustainability-card">
                  <div className="sustainability-icon">
                    <i className={feature.icon}></i>
                  </div>
                  <div className="sustainability-content">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <div className="sustainability-impact">
                      <i className="fas fa-seedling"></i>
                      <span>{feature.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sustainability-commitment">
              <h3>Our Commitment</h3>
              <div className="commitment-content">
                <div className="commitment-text">
                  <p>Marenah FC is committed to environmental stewardship and community development. Our facility will be a model of sustainable construction and operation, demonstrating that world-class sports infrastructure can coexist harmoniously with environmental responsibility.</p>
                  
                  <div className="certifications">
                    <h4>Target Certifications:</h4>
                    <ul>
                      <li>LEED Gold Standard</li>
                      <li>FIFA Environmental Certification</li>
                      <li>Senegal Green Building Council Recognition</li>
                    </ul>
                  </div>
                </div>
                
                <div className="commitment-stats">
                  <div className="commitment-stat">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Renewable Energy</span>
                  </div>
                  <div className="commitment-stat">
                    <span className="stat-number">50%</span>
                    <span className="stat-label">Water Conservation</span>
                  </div>
                  <div className="commitment-stat">
                    <span className="stat-number">0</span>
                    <span className="stat-label">Waste to Landfill</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="feature-modal-overlay" onClick={() => setSelectedFeature(null)}>
          <div className="feature-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <i className={selectedFeature.icon}></i>
                <h3>{selectedFeature.title}</h3>
              </div>
              <button 
                className="close-btn"
                onClick={() => setSelectedFeature(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p className="modal-description">{selectedFeature.description}</p>
              
              <div className="modal-specs">
                <div className="spec-item">
                  <i className="fas fa-expand-arrows-alt"></i>
                  <span>Area: {selectedFeature.area}</span>
                </div>
                {selectedFeature.capacity && (
                  <div className="spec-item">
                    <i className="fas fa-users"></i>
                    <span>Capacity: {selectedFeature.capacity}</span>
                  </div>
                )}
              </div>
              
              <div className="modal-features">
                <h4>Key Features:</h4>
                <ul>
                  {selectedFeature.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 