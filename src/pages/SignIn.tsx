import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import logoImage from '../assets/images/Logo.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    if (email && password) {
      navigate('/admin');
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="admin-signin">
      {/* Glassmorphism Overlay */}
      <div className="signin-overlay"></div>

      <div className="signin-container">
        <div className="signin-logo">
          <img src={logoImage} alt="Marenah FC" />
          <h1>ADMIN ACCESS</h1>
        </div>

        <form className="signin-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button type="submit" className="signin-btn">
            Sign In
            <i className="fas fa-arrow-right"></i>
          </button>
        </form>

        <div className="signin-footer">
          <p>Authorized Personnel Only</p>
          <a href="mailto:support@marenahfc.com">Need Help?</a>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 