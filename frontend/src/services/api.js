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
  getMyProfile: () => api.get('/donors/me'),
  create: (donor) => api.post('/donors', donor),
  update: (id, donor) => api.put(`/donors/${id}`, donor),
  delete: (id) => api.delete(`/donors/${id}`),
};

// Donation API
export const donationAPI = {
  // General endpoints
  getAll: () => api.get('/donations'),
  getById: (id) => api.get(`/donations/${id}`),
  getByDonor: (donorId) => api.get(`/donations/donor/${donorId}`),
  getByStatus: (status) => api.get(`/donations/status/${status}`),
  create: (donorId, donation) => api.post(`/donations/donor/${donorId}`, donation),
  updateStatus: (id, status) => api.put(`/donations/${id}/status`, status, {
    headers: { 'Content-Type': 'application/json' }
  }),
  delete: (id) => api.delete(`/donations/${id}`),

  // Donor-specific endpoints (uses logged-in user's profile)
  getMyDonations: () => api.get('/donations/my'),
  createMyDonation: (donation) => api.post('/donations/my', donation),

  // Staff/Center-specific endpoints
  getCenterPending: () => api.get('/donations/center/pending'),
  getCenterAll: () => api.get('/donations/center/all'),
  accept: (id) => api.put(`/donations/${id}/accept`),
  reject: (id) => api.put(`/donations/${id}/reject`),
};

// Collection Center API
export const centerAPI = {
  getAll: () => api.get('/centers'),
  getById: (id) => api.get(`/centers/${id}`),
  getMyCenter: () => api.get('/centers/me'),
  create: (center) => api.post('/centers', center),
  update: (id, center) => api.put(`/centers/${id}`, center),
  delete: (id) => api.delete(`/centers/${id}`),
  assignDonation: (centerId, donationId) =>
    api.put(`/centers/${centerId}/assign/${donationId}`),
};

// Donation Item API
export const donationItemAPI = {
  getAll: () => api.get('/donations/item'),
  getByDonation: (donationId) => api.get(`/donations/item/donation/${donationId}`),
  create: (item) => api.post('/donations/item', item),
  delete: (id) => api.delete(`/donations/item/${id}`),
};

// Delivery API
export const deliveryAPI = {
  getAll: () => api.get('/deliveries'),
  getById: (id) => api.get(`/deliveries/${id}`),
  getByCenter: (centerId) => api.get(`/deliveries/center/${centerId}`),
  create: (delivery) => api.post('/deliveries', delivery),
  delete: (id) => api.delete(`/deliveries/${id}`),

  // Driver-specific endpoints
  getMyDeliveries: () => api.get('/deliveries/my'),
  getMyPending: () => api.get('/deliveries/my/pending'),
  pickup: (id) => api.put(`/deliveries/${id}/pickup`),
  markInTransit: (id) => api.put(`/deliveries/${id}/in-transit`),
  complete: (id) => api.put(`/deliveries/${id}/complete`),
  cancel: (id) => api.put(`/deliveries/${id}/cancel`),
};

// Driver API
export const driverAPI = {
  getAll: () => api.get('/drivers'),
  getById: (id) => api.get(`/drivers/${id}`),
  getMyProfile: () => api.get('/drivers/me'),
  getByCenter: (centerId) => api.get(`/drivers/center/${centerId}`),
  getAvailableForCenter: (centerId) => api.get(`/drivers/center/${centerId}/available`),
  updateAvailability: (id, isAvailable) => api.put(`/drivers/${id}/availability`, isAvailable),
  updateMyAvailability: (isAvailable) => api.put('/drivers/me/availability', isAvailable),
  assignToCenter: (driverId, centerId) => api.put(`/drivers/${driverId}/assign-center/${centerId}`),
  update: (id, driver) => api.put(`/drivers/${id}`, driver),
};

// Recipient API
export const recipientAPI = {
  getAll: () => api.get('/recipients'),
  getById: (id) => api.get(`/recipients/${id}`),
  getActive: () => api.get('/recipients/active'),
  getByType: (type) => api.get(`/recipients/type/${type}`),
  create: (recipient) => api.post('/recipients', recipient),
  update: (id, recipient) => api.put(`/recipients/${id}`, recipient),
  delete: (id) => api.delete(`/recipients/${id}`),
};

// AI API - Gemini powered features
export const aiAPI = {
  // Generate smart donation description based on items (not saved)
  generateDescription: (items) => api.post('/ai/generate-description', { items }),

  // Get food handling and storage tips (legacy - not saved)
  getFoodTips: (items) => api.post('/ai/food-tips', { items }),

  // Generate and save food tips for a donation
  generateAndSaveFoodTips: (donationId, items) =>
    api.post('/ai/food-tips/save', { donationId, items }),

  // Get saved food tips for a donation
  getSavedFoodTips: (donationId) => api.get(`/ai/food-tips/${donationId}`),

  // Generate personalized thank you message (legacy - not saved)
  generateThankYou: (donorName, items, date) =>
    api.post('/ai/thank-you', { donorName, items, date }),

  // Generate and save thank you message (Staff/Admin only)
  generateAndSaveThankYou: (donationId, donorName, items, date) =>
    api.post('/ai/thank-you/save', { donationId, donorName, items, date }),

  // Get saved thank you message for a donation
  getSavedThankYou: (donationId) => api.get(`/ai/thank-you/${donationId}`),

  // Get recent thank you messages for current donor
  getMyThankYouMessages: () => api.get('/ai/thank-you/my'),

  // Check if content exists for a donation
  checkContentExists: (donationId, contentType) =>
    api.get(`/ai/exists/${donationId}/${contentType}`),
};

export default api;