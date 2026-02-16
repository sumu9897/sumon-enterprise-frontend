import api from './api';

const inquiryService = {
  // Submit contact form inquiry
  createInquiry: async (data) => {
    const response = await api.post('/inquiries', data);
    return response.data;
  },

  // Get all inquiries (Admin)
  getInquiries: async (params = {}) => {
    const response = await api.get('/inquiries', { params });
    return response.data;
  },

  // Get inquiry by ID (Admin)
  getInquiryById: async (id) => {
    const response = await api.get(`/inquiries/${id}`);
    return response.data;
  },

  // Update inquiry status (Admin)
  updateInquiryStatus: async (id, status) => {
    const response = await api.put(`/inquiries/${id}/status`, { status });
    return response.data;
  },

  // Delete inquiry (Admin)
  deleteInquiry: async (id) => {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  },

  // Get inquiry statistics (Admin)
  getInquiryStats: async () => {
    const response = await api.get('/inquiries/stats');
    return response.data;
  },
};

export default inquiryService;