import api from './api';

const projectService = {
  // Get all projects with filters
  getProjects: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Get single project by ID
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Get project by slug
  getProjectBySlug: async (slug) => {
    const response = await api.get(`/projects/slug/${slug}`);
    return response.data;
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    const response = await api.get('/projects/featured');
    return response.data;
  },

  // Create new project (Admin)
  createProject: async (formData) => {
    const response = await api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update project (Admin)
  updateProject: async (id, formData) => {
    const response = await api.put(`/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete project (Admin)
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

export default projectService;