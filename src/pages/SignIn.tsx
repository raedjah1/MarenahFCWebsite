import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "../contexts/FirebaseAuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import "./SignIn.css";
import logoImage from "../assets/images/Logo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    signIn,
    loading,
    error: authError,
    isAuthenticated,
    isAdmin,
    clearError,
  } = useFirebaseAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    // Basic validation
    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }

    if (!password) {
      setLocalError("Password is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn(email.trim(), password);

      if (result.success) {
        // Navigation will be handled by the useEffect above
        console.log("Sign in successful");
      } else {
        setLocalError(result.error || "Sign in failed");
      }
    } catch (error) {
      setLocalError("An unexpected error occurred. Please try again.");
      console.error("Sign in error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = () => {
    // Clear errors when user starts typing
    if (localError) setLocalError("");
    if (authError) clearError();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="admin-signin">
        <div className="signin-overlay"></div>
        <div className="signin-container">
          <LoadingSpinner size="large" text="Checking authentication..." />
        </div>
      </div>
    );
  }

  const displayError = localError || authError;

  return (
    <div className="admin-signin">
      {/* Glassmorphism Overlay */}
      <div className="signin-overlay"></div>

      <div className="signin-container">
        <div className="signin-logo">
          <img src={logoImage} alt="Marenah FC" />
          <h1>ADMIN ACCESS</h1>
          <p>Sign in to manage your club</p>
        </div>

        <form className="signin-form" onSubmit={handleSubmit}>
          {displayError && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {displayError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                placeholder="Enter your admin email"
                required
                disabled={isSubmitting}
                autoComplete="email"
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange();
                }}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
                autoComplete="current-password"
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
          <p className="signin-help">
            Contact the system administrator if you need access or are
            experiencing issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
