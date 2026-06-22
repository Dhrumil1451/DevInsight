import axios from 'axios';


// ─── Axios Instance ───────────────────────────────────────────────────────────

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api';


console.log("DevInsight API URL:", API_URL);


const api = axios.create({

  baseURL: API_URL,

  timeout: 15000,

  headers: {
    'Content-Type': 'application/json',
  },

});


// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(

  (response) => response.data,


  (error) => {

    let message = 'An unexpected error occurred';


    if (error.response) {

      const status = error.response.status;


      if (status === 404) {

        message = 'Developer not found';

      } 
      else if (status === 401) {

        message = 'GitHub authentication failed';

      } 
      else if (status >= 500) {

        message = 'Server error. Try again later';

      } 
      else {

        message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Something went wrong';

      }

    } 
    else if (error.request) {

      message = 'Network error. Please check your connection.';

    } 
    else {

      message = error.message;

    }


    return Promise.reject(
      new Error(message)
    );

  }

);



// ─── User / Profile ───────────────────────────────────────────────────────────

export const fetchProfile =
(username) =>
api.get(`/users/${username}`);


export const getDeveloper =
(username) =>
api.get(`/users/${username}`);


export const refreshProfile =
(username) =>
api.post(`/users/${username}/refresh`);




// ─── Repositories ─────────────────────────────────────────────────────────────

export const fetchRepositories =
(username) =>
api.get(`/repositories/${username}`);


export const getRepositories =
(username) =>
api.get(`/repositories/${username}`);




// ─── Analytics ────────────────────────────────────────────────────────────────

export const fetchAnalytics =
(username) =>
api.get(`/analytics/${username}`);


export const getAnalytics =
(username) =>
api.get(`/analytics/${username}`);




// ─── Compare ──────────────────────────────────────────────────────────────────

export const compareDevelopers =
(user1, user2) =>

api.get('/compare', {

  params:{
    user1,
    user2
  }

});




// ─── Trending ─────────────────────────────────────────────────────────────────

// backend route is /api/trending/

export const fetchTrending =
(limit = 10) =>

api.get('/trending', {

  params:{
    limit
  }

});


export const getTrending = fetchTrending;




// ─── Saved ────────────────────────────────────────────────────────────────────

// backend route is /api/saved/

export const fetchSaved =
() => api.get('/saved');


export const getSavedDevelopers =
fetchSaved;


export const saveDeveloper =
(username) =>

api.post('/saved', {

  username

});


export const removeSaved =
(id) =>

api.delete(`/saved/${id}`);




// ─── Reports ──────────────────────────────────────────────────────────────────

export const generateReport =
(username) =>

api.post(`/reports/${username}`);




export const getReportUrl =
(reportId) =>

`${API_URL}/reports/${reportId}`;



export default api;