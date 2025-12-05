import axios, { AxiosError } from 'axios';

// Use environment variable with fallback (only for development)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Validate API URL in production
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn('⚠️ VITE_API_URL not set in production. Requests may fail.');
}

console.log('API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token attached to request');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data;
    
    console.error('API Error:', status, data);
    
    // Handle unauthorized access
    if (status === 401) {
      console.log('Unauthorized - clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Temporarily disabled for debugging
      // window.location.href = '/login';
    }
    
    // Handle server errors
    if (status === 500) {
      console.error('Server error - please try again later');
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },
  
  signup: (email: string, password: string, name: string) => {
    return apiClient.post('/auth/signup', { email, password, name });
  },
  
  verifyToken: () => {
    return apiClient.get('/auth/verify');
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
};

// Event APIs
export const eventAPI = {
  getAll: () => {
    return apiClient.get('/events');
  },
  
  getById: (id: string) => {
    return apiClient.get(`/events/${id}`);
  },
  
  create: (title: string, dateTime: string, image?: string) => {
    return apiClient.post('/events', { title, dateTime, image });
  },
  
  update: (id: string, updates: Record<string, any>) => {
    return apiClient.put(`/events/${id}`, updates);
  },
  
  delete: (id: string) => {
    return apiClient.delete(`/events/${id}`);
  },
};

export default apiClient;