import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SignIn.styles.css';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const { signIn, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';
  
  // Check for remembered username
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
      // Focus on password field if username is remembered
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 100);
    } else {
      // Focus on username field if no remembered username
      setTimeout(() => {
        usernameRef.current?.focus();
      }, 100);
    }
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Clear error message when inputs change
  useEffect(() => {
    if (formTouched && (error || errorMessage)) {
      setErrorMessage('');
      clearError();
      setDebugInfo(null);
    }
  }, [username, password, formTouched, clearError, error]);

  const validateForm = (): boolean => {
    if (!username.trim()) {
      setErrorMessage('Username or email is required');
      usernameRef.current?.focus();
      return false;
    }
    
    if (!password) {
      setErrorMessage('Password is required');
      passwordRef.current?.focus();
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    setErrorMessage('');
    setSuccessMessage('');
    setDebugInfo(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`Attempting to sign in with username: ${username}`);
      
      const result = await signIn(username, password);
      
      console.log('Sign-in response:', result);
      setIsSubmitting(false);
      
      if (result.error) {
        setErrorMessage(result.message || 'Invalid username or password');
        setDebugInfo(JSON.stringify(result, null, 2));
        console.error('Sign-in error details:', result);
        return;
      }
      
      // If remember me is checked, store in localStorage
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      
      setSuccessMessage('Sign in successful! Redirecting...');
      console.log('Sign-in successful, redirecting to:', from);
      
      // Navigate to the page the user was trying to access or home
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Sign in error:', err);
      
      // Extract and log detailed error information
      let errorDetails = '';
      if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', err.response.data);
        errorDetails = `Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)}`;
      } else if (err.request) {
        console.error('Error request:', err.request);
        errorDetails = 'No response received from server. Network issue or server down.';
      } else {
        console.error('Error message:', err.message);
        errorDetails = err.message;
      }
      
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
      setDebugInfo(errorDetails);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setDebugInfo(null);
      // This would be replaced with actual Google OAuth implementation
      // For now, we'll just show a message
      setErrorMessage('Google sign-in is not implemented yet. Please use email/password.');
      setIsSubmitting(false);
      
      // When implemented, it would look something like:
      // const googleToken = await getGoogleToken();
      // const result = await signInGoogle(googleToken);
      // if (result.error) {
      //   setErrorMessage(result.message);
      //   setDebugInfo(JSON.stringify(result, null, 2));
      // }
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Google sign in error:', err);
      setErrorMessage('Failed to sign in with Google. Please try again.');
      
      // Extract and log detailed error information
      let errorDetails = '';
      if (err.response) {
        console.error('Error response status:', err.response.status);
        console.error('Error response data:', err.response.data);
        errorDetails = `Status: ${err.response.status}, Data: ${JSON.stringify(err.response.data)}`;
      } else if (err.request) {
        console.error('Error request:', err.request);
        errorDetails = 'No response received from server. Network issue or server down.';
      } else {
        console.error('Error message:', err.message);
        errorDetails = err.message;
      }
      
      setDebugInfo(errorDetails);
    }
  };

  // Handle GitHub sign in
  const handleGithubSignIn = () => {
    setErrorMessage('GitHub sign-in is not implemented yet. Please use email/password.');
    setDebugInfo(null);
  };

  // Handle input change and mark form as touched
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormTouched(true);
      setter(e.target.value);
    };

  return (
    <div className="auth-page">
      {/* VR-themed floating orbs */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      <div className="auth-container glass-panel">
        <div className="auth-content">
          <div className="auth-header">
            <div className="header-top">
              <Link to="/" className="home-button" aria-label="Go to home page">
                <div className="home-icon-container">
                  <i className="fas fa-home"></i>
                </div>
              </Link>
              <Link to="/" className="logo-link">
                <h1>POV-Reality</h1>
              </Link>
            </div>
            <p>Create or Spectate</p>
          </div>

          {(error || errorMessage) && (
            <div className="error-message animate-fade-in">
              <i className="fas fa-exclamation-circle"></i>
              <span>{errorMessage || error}</span>
            </div>
          )}
          
          {debugInfo && (
            <div className="debug-info">
              <details>
                <summary>Debug Information</summary>
                <pre>{debugInfo}</pre>
              </details>
            </div>
          )}
          
          {successMessage && (
            <div className="success-message animate-fade-in">
              <i className="fas fa-check-circle"></i>
              <span>{successMessage}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username or Email</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="username"
                  ref={usernameRef}
                  value={username}
                  onChange={handleInputChange(setUsername)}
                  placeholder="Enter your username or email"
                  autoComplete="username"
                  className={!username && formTouched ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  ref={passwordRef}
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={!password && formTouched ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              className={`auth-button ${loading || isSubmitting ? 'loading' : ''}`}
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-auth">
              <button 
                type="button" 
                className="social-button google"
                onClick={handleGoogleSignIn}
                disabled={loading || isSubmitting}
              >
                <i className="fab fa-google"></i>
                Google
              </button>
              <button 
                type="button" 
                className="social-button github"
                onClick={handleGithubSignIn}
                disabled={loading || isSubmitting}
              >
                <i className="fab fa-github"></i>
                GitHub
              </button>
            </div>
          </form>

          <div className="auth-links">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 