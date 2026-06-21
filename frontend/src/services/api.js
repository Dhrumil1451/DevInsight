import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: unwrap data or throw normalized errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Custom error handling based on status codes
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        message = 'Developer not found';
      } else if (status === 401) {
        message = 'GitHub authentication failed';
      } else if (status >= 500) {
        message = 'Server error. Try again later';
      } else {
        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Something went wrong';
      }
    } else if (error.request) {
      message = 'Network error. Please check your connection.';
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

// ─── User / Profile ───────────────────────────────────────────────────────────
export const fetchProfile   = (username) => api.get(`/users/${username}`);
export const getDeveloper   = (username) => api.get(`/users/${username}`);  // alias for Home page
export const refreshProfile = (username) => api.post(`/users/${username}/refresh`);

// ─── Repositories ─────────────────────────────────────────────────────────────
export const fetchRepositories = (username) => api.get(`/repositories/${username}`);
export const getRepositories   = (username) => api.get(`/repositories/${username}`); // alias for DeveloperProfile

// ─── Analytics ────────────────────────────────────────────────────────────────
export const fetchAnalytics = (username) => api.get(`/analytics/${username}`);
export const getAnalytics   = (username) => api.get(`/analytics/${username}`); // alias for DeveloperProfile

// ─── Compare ──────────────────────────────────────────────────────────────────
export const compareDevelopers = (user1, user2) =>
  api.get('/compare', { params: { user1, user2 } });

// ─── Trending ─────────────────────────────────────────────────────────────────
export const fetchTrending = (limit = 10) =>
  api.get('/trending', { params: { limit } });
export const getTrending = fetchTrending; // alias

// ─── Saved ────────────────────────────────────────────────────────────────────
export const fetchSaved     = () => api.get('/saved');
export const getSavedDevelopers = fetchSaved; // alias
export const saveDeveloper  = (username) => api.post('/saved', { username });
export const removeSaved    = (id) => api.delete(`/saved/${id}`);

// ─── Reports ──────────────────────────────────────────────────────────────────
export const generateReport = (username) => api.post(`/reports/${username}`);
export const getReportUrl   = (reportId) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
  return `${baseUrl}/reports/${reportId}`;
};

export default api;
