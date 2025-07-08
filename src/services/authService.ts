import axios from 'axios';

const API_URL = 'https://4314-129-59-122-31.ngrok-free.app/';

// Helper function to sanitize inputs
const sanitizeInput = {
  text: (text: string): string => {
    // Basic sanitization - remove HTML tags and trim
    return text.replace(/<[^>]*>?/gm, '').trim();
  },
  email: (email: string): string => {
    // Basic email sanitization
    return email.toLowerCase().trim();
  },
  username: (username: string): string => {
    // Basic username sanitization
    return username.trim();
  }
};

export const authService = {
  // Register a new user
  async register(firstname: string, lastname: string, email: string, password: string, passwordConfirmation: string) {
    try {
      if (password !== passwordConfirmation) {
        return { error: true, message: 'Passwords do not match' };
      }

      const sanitizedFirstname = sanitizeInput.text(firstname);
      const sanitizedLastname = sanitizeInput.text(lastname);
      const sanitizedEmail = sanitizeInput.email(email);

      const payload = {
        firstname: sanitizedFirstname,
        lastname: sanitizedLastname,
        email: sanitizedEmail,
        password: password.trim(),
        password_confirmation: passwordConfirmation.trim(),
      };

      console.log("Request payload:", payload);

      const response = await axios.post(
        `${API_URL}/users/register/`,
        payload,
        {
          headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200 || response.status === 201) {
        // Store token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user_id', response.data.user_id.toString());
          localStorage.setItem('profile_picture_url', response.data.profile_picture_url || '');
          localStorage.setItem('cover_picture_url', response.data.cover_picture_url || '');
        }
        return response.data;
      } else {
        return { error: true, message: response.data.error || 'Registration failed' };
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.status === 400) {
          return { 
            error: true, 
            message: error.response.data.error || 'Invalid registration data' 
          };
        }
      }
      
      return { 
        error: true, 
        message: 'There was a problem registering you. Please try again later.' 
      };
    }
  },

  // Sign in a user
  async signIn(username: string, password: string) {
    try {
      const sanitizedUsername = sanitizeInput.username(username);

      const payload = {
        username: sanitizedUsername,
        password: password.trim(),
      };

      console.log("Request payload:", payload);

      const response = await axios.post(
        `${API_URL}/users/sign-in/`,
        payload,
        {
          headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 200 || response.status === 201) {
        // Store auth data in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user_id', response.data.user_id.toString());
          localStorage.setItem('profile_picture_url', response.data.profile_picture_url || '');
          localStorage.setItem('cover_picture_url', response.data.cover_picture_url || '');
          localStorage.setItem('username', username);
        }
        return response.data;
      } else {
        return { error: true, message: 'Authentication failed' };
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.status === 400) {
          return { 
            error: true, 
            message: 'Invalid credentials. Please try again.' 
          };
        } else if (error.response.status === 404) {
          return { 
            error: true, 
            message: 'Endpoint not found. Please check the URL.' 
          };
        }
      }
      
      return { 
        error: true, 
        message: 'There was a problem signing you in. Please try again later.' 
      };
    }
  },

  // Sign in with Google
  async signInGoogle(credential: string) {
    try {
      const payload = { credential };
      const response = await axios.post(
        `${API_URL}/users/sign-in-google/`,
        payload,
        {
          headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Store auth data in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user_id', response.data.user_id.toString());
          localStorage.setItem('profile_picture_url', response.data.profile_picture_url || '');
          localStorage.setItem('cover_picture_url', response.data.cover_picture_url || '');
        }
        return response.data;
      } else {
        return { error: true, message: response.data.error || 'Google authentication failed' };
      }
    } catch (error: any) {
      console.error("Google sign in error:", error);
      return { 
        error: true, 
        message: 'There was a problem signing in with Google. Please try again later.' 
      };
    }
  },

  // Sign in with Facebook
  async signInFacebook(userData: any) {
    try {
      const sanitizedEmail = sanitizeInput.email(userData.email);
      const sanitizedFirstName = sanitizeInput.text(userData.first_name);
      const sanitizedLastName = sanitizeInput.text(userData.last_name);

      const payload = {
        email: sanitizedEmail,
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        profile_picture: userData.picture?.data?.url,
      };

      const response = await axios.post(
        `${API_URL}/users/sign-in-facebook/`,
        payload,
        {
          headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Store auth data in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user_id', response.data.user_id.toString());
          localStorage.setItem('profile_picture_url', response.data.profile_picture_url || '');
          localStorage.setItem('cover_picture_url', response.data.cover_picture_url || '');
        }
        return response.data;
      } else {
        return { error: true, message: response.data.error || 'Facebook authentication failed' };
      }
    } catch (error: any) {
      console.error("Facebook sign in error:", error);
      return { 
        error: true, 
        message: 'There was a problem signing in with Facebook. Please try again later.' 
      };
    }
  },

  // Sign in with Apple
  async signInApple(accessToken: string, refreshToken?: string) {
    try {
      const payload: any = { access_token: accessToken };
      if (refreshToken) {
        payload.refresh_token = refreshToken;
      }

      const response = await axios.post(
        `${API_URL}/users/sign-in-apple/`,
        payload,
        {
          headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Store auth data in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user_id', response.data.user_id.toString());
          localStorage.setItem('profile_picture_url', response.data.profile_picture_url || '');
          localStorage.setItem('cover_picture_url', response.data.cover_picture_url || '');
        }
        return response.data;
      } else {
        return { error: true, message: response.data.error || 'Apple authentication failed' };
      }
    } catch (error: any) {
      console.error("Apple sign in error:", error);
      return { 
        error: true, 
        message: 'There was a problem signing in with Apple. Please try again later.' 
      };
    }
  },

  // Check sign-in status
  async checkSignInStatus(code: string) {
    try {
      const response = await axios.get(
        `${API_URL}/users/auth/check-signin-status/?code=${code}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Check sign-in status error:", error);
      return { 
        error: true, 
        message: 'There was a problem checking the sign-in status.' 
      };
    }
  },

  // Initiate email verification
  async initiateEmailVerification(email: string) {
    try {
      const sanitizedEmail = sanitizeInput.email(email);
      const response = await axios.post(
        `${API_URL}/users/initiate-email-verification/`,
        { email: sanitizedEmail },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.status === 200) {
        return { success: true, ...response.data };
      } else {
        return { 
          success: false, 
          message: response.data.error || 'Failed to initiate email verification' 
        };
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      return { 
        success: false, 
        message: error.message || 'There was a problem initiating email verification.' 
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('profile_picture_url');
    localStorage.removeItem('cover_picture_url');
    localStorage.removeItem('username');
    // Don't remove remembered username if that option was selected
  },

  // Get current user
  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    return {
      token,
      user_id: localStorage.getItem('user_id'),
      profile_picture_url: localStorage.getItem('profile_picture_url'),
      cover_picture_url: localStorage.getItem('cover_picture_url'),
      username: localStorage.getItem('username'),
    };
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}; 