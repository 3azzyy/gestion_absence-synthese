import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://absence.compusmanager.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// attach auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('ista_auth_session');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        if (parsedSession.token) {
          config.headers.Authorization = `Bearer ${parsedSession.token}`;
        }
      } catch (error) {
        console.error('Error parsing session:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// global response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ista_auth_session');
      // let the app handle redirect to login
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
