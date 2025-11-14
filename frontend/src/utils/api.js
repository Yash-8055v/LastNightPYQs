import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // Use proxy in dev, or set VITE_API_BASE_URL for production
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/auth tokens
});

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle connection errors (backend not running)
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || !error.response) {
      const connectionError = new Error('Backend server is not running. Please start the backend server.');
      connectionError.isConnectionError = true;
      return Promise.reject(connectionError);
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      // You can add redirect logic here if needed
    }
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  // Add other auth endpoints as needed
};

export const papersAPI = {
  getAll: () => api.get('/papers'),
  getById: (id) => api.get(`/papers/${id}`),
  getStats: () => api.get('/papers/stats'),
  upload: (formData) => {
    // For file uploads, we need to use multipart/form-data
    return api.post('/papers/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  delete: (id) => api.delete(`/papers/${id}`),
};

export default api;
