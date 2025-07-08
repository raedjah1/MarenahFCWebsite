import axios from 'axios';

const API_URL = 'https://4314-129-59-122-31.ngrok-free.app';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('profile_picture_url');
      localStorage.removeItem('cover_picture_url');
      localStorage.removeItem('username');
      
      // Redirect to login page
      window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // User profile
  getUserProfile: async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await api.get(`/users/profile/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  updateUserProfile: async (profileData: any) => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await api.put(`/users/profile/${userId}/`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Example method for fetching user-specific data
  getUserData: async () => {
    try {
      const response = await api.get('/users/data/');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  },
  
  // Add more API methods as needed
};

export default api; 