import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const accommodationAPI = {
  getAll: () => API.get('/accommodations'),
  getById: (id) => API.get(`/accommodations/${id}`),
  create: (data) => API.post('/accommodations', data),
  update: (id, data) => API.put(`/accommodations/${id}`, data),
  delete: (id) => API.delete(`/accommodations/${id}`)
};

export const reservationAPI = {
  create: (data) => API.post('/reservations', data),
  getAll: () => API.get('/reservations'),
  getById: (id) => API.get(`/reservations/${id}`)
};

export const userAPI = {
  login: (data) => API.post('/users/login', data),
  register: (data) => API.post('/users/register', data),
  profile: () => API.get('/users/profile')
};

export default API;