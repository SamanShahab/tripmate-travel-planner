import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('tripmate_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tripmate_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const destinationsAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getOne: (id) => api.get(`/destinations/${id}`),
  save: (id) => api.post(`/destinations/${id}/save`),
};

export const tripsAPI = {
  getAll: () => api.get('/trips'),
  getOne: (id) => api.get(`/trips/${id}`),
  create: (data) => api.post('/trips', data),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
};

export const itineraryAPI = {
  get: (tripId) => api.get(`/itinerary/${tripId}`),
  addActivity: (dayId, data) => api.post(`/itinerary/${dayId}/activities`, data),
  updateActivity: (dayId, actId, data) => api.put(`/itinerary/${dayId}/activities/${actId}`, data),
  deleteActivity: (dayId, actId) => api.delete(`/itinerary/${dayId}/activities/${actId}`),
  updateTitle: (dayId, title) => api.put(`/itinerary/${dayId}/title`, { title }),
};

export const budgetAPI = {
  get: (tripId) => api.get(`/budget/${tripId}`),
  update: (tripId, data) => api.put(`/budget/${tripId}`, data),
};

export const weatherAPI = {
  get: (city) => api.get(`/weather/${city}`),
};

export default api;
