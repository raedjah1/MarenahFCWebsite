import React, { useState } from 'react';
import './TeamPage.css';
import actionImage1 from '../assets/images/action_image_4.JPG';
import actionImage2 from '../assets/images/action_image_2.JPG';
import actionImage3 from '../assets/images/action_image3.JPG';
import actionImage4 from '../assets/images/action_image_3.JPG';

interface Staff {
  id: number;
  name: string;
  role: string;
  experience: string;
  image?: string;
  achievements: string[];
}

export const TeamPage = () => {
  const [activeTab, setActiveTab] = useState<'management' | 'coaching'>('management');

  const coachingStaff: Staff[] = [
    {
      id: 1,
      name: "John Smith",
      role: "Head Coach",
      experience: "15 years",
      achievements: [
        "UEFA Pro License",
        "Former Premier League Assistant",
        "Youth Development Specialist"
      ]
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      role: "Assistant Coach",
      experience: "8 years",
      achievements: [
        "UEFA A License",
        "Sports Science Degree",
        "Tactical Analysis Expert"
      ]
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      role: "Goalkeeping Coach",
      experience: "12 years",
      achievements: [
        "Former Professional Goalkeeper",
        "Goalkeeping Specialist Certification",
        "Youth Academy Graduate"
      ]
    }
  ];

  const managementTeam: Staff[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "General Manager",
      experience: "20 years",
      achievements: [
        "MBA in Sports Management",
        "Former Club Executive",
        "Community Development Leader"
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Technical Director",
      experience: "18 years",
      achievements: [
        "Former Professional Player",
        "Youth Development Expert",
        "Strategic Planning Specialist"
      ]
    },
    {
      id: 3,
      name: "Fatou Diallo",
      role: "Community Relations Manager",
      experience: "10 years",
      achievements: [
        "Local Community Leader",
        "Education Partnership Coordinator",
        "Youth Mentorship Program Director"
      ]
    }
  ];

  return (
    <div className="team-page">
      {/* Navigation Tabs */}
      <div className="team-navigation">
        <div className="team-nav-container">
          <button 
            className={`team-nav-tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            <i className="fas fa-building"></i>
            MANAGEMENT
          </button>
          <button 
            className={`team-nav-tab ${activeTab === 'coaching' ? 'active' : ''}`}
            onClick={() => setActiveTab('coaching')}
          >
            <i className="fas fa-clipboard-list"></i>
            COACHING STAFF
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="team-content">
        {activeTab === 'management' && (
          <div className="management-section">
            <div className="section-header">
              <h2>MANAGEMENT TEAM</h2>
              <p>Leadership driving our vision forward</p>
            </div>
            <div className="staff-grid">
              {managementTeam.map((staff) => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-image">
                    {staff.image ? (
                      <img src={staff.image} alt={staff.name} />
                    ) : (
                      <div className="staff-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="staff-info">
                    <h3>{staff.name}</h3>
                    <h4>{staff.role}</h4>
                    <p className="experience">{staff.experience} Experience</p>
                    <div className="achievements">
                      <h5>Key Achievements:</h5>
                      <ul>
                        {staff.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coaching' && (
          <div className="coaching-section">
            <div className="section-header">
              <h2>COACHING STAFF</h2>
              <p>Expert guidance for player development</p>
            </div>
            <div className="staff-grid">
              {coachingStaff.map((staff) => (
                <div key={staff.id} className="staff-card">
                  <div className="staff-image">
                    {staff.image ? (
                      <img src={staff.image} alt={staff.name} />
                    ) : (
                      <div className="staff-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                  </div>
                  <div className="staff-info">
                    <h3>{staff.name}</h3>
                    <h4>{staff.role}</h4>
                    <p className="experience">{staff.experience} Experience</p>
                    <div className="achievements">
                      <h5>Key Achievements:</h5>
                      <ul>
                        {staff.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 