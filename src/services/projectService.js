import api from './api';

const FEATURED_CACHE_KEY = 'sumon-enterprise:featured-projects';
const FEATURED_CACHE_TTL = 5 * 60 * 1000;

const readFeaturedCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(FEATURED_CACHE_KEY));
    if (!cached || Date.now() - cached.savedAt > FEATURED_CACHE_TTL) return [];
    return Array.isArray(cached.projects) ? cached.projects : [];
  } catch {
    return [];
  }
};

const writeFeaturedCache = (projects) => {
  try {
    localStorage.setItem(FEATURED_CACHE_KEY, JSON.stringify({
      savedAt: Date.now(),
      projects,
    }));
  } catch {
    // Storage can be unavailable in private browsing; the API result still works.
  }
};

const clearFeaturedCache = () => {
  try {
    localStorage.removeItem(FEATURED_CACHE_KEY);
  } catch {
    // Ignore unavailable storage.
  }
};

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
    writeFeaturedCache(response.data?.data || []);
    return response.data;
  },

  getCachedFeaturedProjects: readFeaturedCache,

  // Create new project (Admin)
  createProject: async (formData) => {
    const response = await api.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    clearFeaturedCache();
    return response.data;
  },

  // Update project (Admin)
  updateProject: async (id, formData) => {
    const response = await api.put(`/projects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    clearFeaturedCache();
    return response.data;
  },

  // Delete project (Admin)
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    clearFeaturedCache();
    return response.data;
  },
};

export default projectService;
