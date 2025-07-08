import React, { useEffect, useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/apiService';
import './ProfilePage.css';

interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  profile_picture_url: string;
  cover_picture_url: string;
  bio?: string;
  created_at?: string;
}

export const ProfilePage: React.FC = () => {
  // const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiService.getUserProfile();
        setProfile(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    // logout();
  };

  if (loading) {
    return (
      <div className="profile-page loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page error">
        <div className="error-message">{error}</div>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div 
          className="cover-photo" 
          style={{ backgroundImage: `url(${profile?.cover_picture_url || '/images/default-cover.jpg'})` }}
        >
          <div className="profile-picture-container">
            <img 
              src={profile?.profile_picture_url || '/images/default-avatar.jpg'} 
              alt="Profile" 
              className="profile-picture"
            />
          </div>
        </div>
        
        <div className="profile-info">
          <h1>{profile?.firstname} {profile?.lastname}</h1>
          <p className="email">{profile?.email}</p>
          <p className="bio">{profile?.bio || 'No bio available'}</p>
        </div>
        
        <div className="profile-actions">
          <button className="edit-profile-button">Edit Profile</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h2>Your Activity</h2>
          <div className="activity-placeholder">
            <p>No recent activity to display</p>
          </div>
        </div>
        
        <div className="profile-section">
          <h2>Your VR Spaces</h2>
          <div className="spaces-placeholder">
            <p>You haven't created any VR spaces yet</p>
            <button className="create-space-button">Create a Space</button>
          </div>
        </div>
      </div>
    </div>
  );
}; 