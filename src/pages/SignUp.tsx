import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SignIn.styles.css'; // Reusing the same styles

const SignUp: React.FC = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  const firstnameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  
  const { register, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);
  
  // Focus on first name field on load
  useEffect(() => {
    setTimeout(() => {
      firstnameRef.current?.focus();
    }, 100);
  }, []);
  
  // Clear error message when inputs change
  useEffect(() => {
    if (formTouched && (error || errorMessage)) {
      setErrorMessage('');
      clearError();
      setDebugInfo(null);
    }
  }, [firstname, lastname, email, password, confirmPassword, formTouched, clearError, error]);

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pass: string, confirm: string): boolean => {
    setValidationErrors({});
    
    if (pass !== confirm) {
      setPasswordError('Passwords do not match');
      return false;
    }
    
    if (pass.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(pass)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    
    // Check for at least one number
    if (!/\d/.test(pass)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    
    setPasswordError('');
    return true;
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;
    
    if (!firstname.trim()) {
      errors.firstname = 'First name is required';
      firstnameRef.current?.focus();
      isValid = false;
    }
    
    if (!lastname.trim()) {
      errors.lastname = 'Last name is required';
      isValid = false;
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
      emailRef.current?.focus();
      isValid = false;
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
      emailRef.current?.focus();
      isValid = false;
    }
    
    if (!password) {
      errors.password = 'Password is required';
      passwordRef.current?.focus();
      isValid = false;
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    }
    
    if (!validatePassword(password, confirmPassword)) {
      isValid = false;
    }
    
    if (!agreeToTerms) {
      errors.terms = 'You must agree to the Terms of Service';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
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
      console.log('Registration attempt with data:', {
        firstname,
        lastname,
        email,
        passwordLength: password.length,
        passwordConfirmationLength: confirmPassword.length
      });
      
      const result = await register(firstname, lastname, email, password, confirmPassword);
      
      console.log('Registration response:', result);
      setIsSubmitting(false);
      
      if (result.error) {
        setErrorMessage(result.message || 'Registration failed. Please try again.');
        setDebugInfo(JSON.stringify(result, null, 2));
        console.error('Registration error details:', result);
        return;
      }
      
      // Registration successful
      setSuccessMessage('Registration successful! Redirecting to your profile...');
      console.log('Registration successful, user data:', result);
      
      // Clear form
      setFirstname('');
      setLastname('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgreeToTerms(false);
      
      // Navigate to home or verification page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      console.error('Registration error:', err);
      
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

  // Handle Google sign up
  const handleGoogleSignUp = () => {
    setErrorMessage('Google sign-up is not implemented yet. Please use email registration.');
    setDebugInfo(null);
  };

  // Handle GitHub sign up
  const handleGithubSignUp = () => {
    setErrorMessage('GitHub sign-up is not implemented yet. Please use email registration.');
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
              <label htmlFor="firstname">First Name</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="firstname"
                  ref={firstnameRef}
                  value={firstname}
                  onChange={handleInputChange(setFirstname)}
                  placeholder="Enter your first name"
                  className={validationErrors.firstname ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.firstname && (
                <div className="field-error">{validationErrors.firstname}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <div className="input-wrapper">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={handleInputChange(setLastname)}
                  placeholder="Enter your last name"
                  className={validationErrors.lastname ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.lastname && (
                <div className="field-error">{validationErrors.lastname}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  ref={emailRef}
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  placeholder="Enter your email"
                  className={validationErrors.email ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.email && (
                <div className="field-error">{validationErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  ref={passwordRef}
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  placeholder="Create a password"
                  className={validationErrors.password || passwordError ? 'input-error' : ''}
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
              {validationErrors.password && (
                <div className="field-error">{validationErrors.password}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                  placeholder="Confirm your password"
                  className={validationErrors.confirmPassword || passwordError ? 'input-error' : ''}
                  disabled={isSubmitting}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  disabled={isSubmitting}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {passwordError && <div className="field-error">{passwordError}</div>}
            </div>

            <div className="form-options">
              <label className={`remember-me ${validationErrors.terms ? 'checkbox-error' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={agreeToTerms}
                  onChange={(e) => {
                    setFormTouched(true);
                    setAgreeToTerms(e.target.checked);
                  }}
                  disabled={isSubmitting}
                />
                <span>I agree to the <Link to="/terms" className="terms-link">Terms</Link></span>
              </label>
            </div>
            {validationErrors.terms && (
              <div className="field-error terms-error">{validationErrors.terms}</div>
            )}

            <button 
              type="submit" 
              className={`auth-button ${loading || isSubmitting ? 'loading' : ''}`}
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="divider">
              <span>or sign up with</span>
            </div>

            <div className="social-auth">
              <button 
                type="button" 
                className="social-button google"
                onClick={handleGoogleSignUp}
                disabled={loading || isSubmitting}
              >
                <i className="fab fa-google"></i>
                Google
              </button>
              <button 
                type="button" 
                className="social-button github"
                onClick={handleGithubSignUp}
                disabled={loading || isSubmitting}
              >
                <i className="fab fa-github"></i>
                GitHub
              </button>
            </div>
          </form>

          <div className="auth-links">
            Already have an account?{' '}
            <Link to="/signin" className="signup-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 