import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token attached to request');
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) => {
    console.log('Login request:', email);
    return apiClient.post('/auth/login', { email, password });
  },
  
  signup: (email: string, password: string, name: string) => {
    console.log('Signup request:', email, name);
    return apiClient.post('/auth/signup', { email, password, name });
  },
  
  verifyToken: () => {
    console.log('Verify token request');
    return apiClient.get('/auth/verify');
  },
};

// Event APIs
export const eventAPI = {
  getAll: () => {
    console.log('Get all events request');
    return apiClient.get('/events');
  },
  
  create: (title: string, dateTime: string, image?: string) => {
    console.log('Create event request:', title, dateTime, image);
    return apiClient.post('/events', { title, dateTime, image });
  },
  
  update: (id: string, updates: any) => {
    console.log('Update event request:', id, updates);
    return apiClient.put(`/events/${id}`, updates);
  },
  
  delete: (id: string) => {
    console.log('Delete event request:', id);
    return apiClient.delete(`/events/${id}`);
  },
};

export default apiClient;