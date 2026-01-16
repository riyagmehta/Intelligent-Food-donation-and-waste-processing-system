import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
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

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
};

// Donor API
export const donorAPI = {
  getAll: () => api.get('/donors'),
  getById: (id) => api.get(`/donors/${id}`),
  create: (donor) => api.post('/donors', donor),
  update: (id, donor) => api.put(`/donors/${id}`, donor),
  delete: (id) => api.delete(`/donors/${id}`),
};

// Donation API
export const donationAPI = {
  getAll: () => api.get('/donations'),
  getById: (id) => api.get(`/donations/${id}`),
  getByDonor: (donorId) => api.get(`/donations/donor/${donorId}`),
  getByStatus: (status) => api.get(`/donations/status/${status}`),
  create: (donorId, donation) => api.post(`/donations/donor/${donorId}`, donation),
  updateStatus: (id, status) => api.put(`/donations/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  delete: (id) => api.delete(`/donations/${id}`),
};

// Collection Center API
export const centerAPI = {
  getAll: () => api.get('/centers'),
  getById: (id) => api.get(`/centers/${id}`),
  create: (center) => api.post('/centers', center),
  update: (id, center) => api.put(`/centers/${id}`, center),
  delete: (id) => api.delete(`/centers/${id}`),
  assignDonation: (centerId, donationId) => 
    api.put(`/centers/${centerId}/assign/${donationId}`),
};

// Donation Item API
export const donationItemAPI = {
  getAll: () => api.get('/donations/item'),
  getByStatus: (status) => api.get(`/donations/item/status/${status}`),
  create: (item) => api.post('/donations/item', item),
  updateStatus: (id, status) => api.put(`/donations/item/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
};

// Delivery API
export const deliveryAPI = {
  getAll: () => api.get('/deliveries'),
  getById: (id) => api.get(`/deliveries/${id}`),
  create: (delivery) => api.post('/deliveries', delivery),
  update: (id, delivery) => api.put(`/deliveries/${id}`, delivery),
  delete: (id) => api.delete(`/deliveries/${id}`),
};

export default api;