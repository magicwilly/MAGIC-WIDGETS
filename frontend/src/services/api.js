import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    return response.data;
  }
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (updateData) => {
    const response = await apiClient.put('/users/profile', updateData);
    return response.data;
  },
  
  getBackedProjects: async () => {
    const response = await apiClient.get('/users/backed');
    return response.data;
  },
  
  getCreatedProjects: async () => {
    const response = await apiClient.get('/users/created');
    return response.data;
  }
};

// Projects API calls
export const projectsAPI = {
  getProjects: async (params = {}) => {
    const response = await apiClient.get('/projects/', { params });
    return response.data;
  },
  
  getProject: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },
  
  createProject: async (projectData) => {
    const response = await apiClient.post('/projects/', projectData);
    return response.data;
  },
  
  updateProject: async (projectId, projectData) => {
    const response = await apiClient.put(`/projects/${projectId}`, projectData);
    return response.data;
  },
  
  updateProjectStory: async (projectId, storyData) => {
    const response = await apiClient.patch(`/projects/${projectId}/story`, storyData);
    return response.data;
  },
  
  addProjectUpdate: async (projectId, updateData) => {
    const response = await apiClient.post(`/projects/${projectId}/updates`, updateData);
    return response.data;
  },
  
  deleteProject: async (projectId) => {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data;
  },
  
  createUpdate: async (projectId, updateData) => {
    const response = await apiClient.post(`/projects/${projectId}/updates`, updateData);
    return response.data;
  },
  
  createComment: async (projectId, commentData) => {
    const response = await apiClient.post(`/projects/${projectId}/comments`, commentData);
    return response.data;
  }
};

// Categories API calls
export const categoriesAPI = {
  getCategories: async () => {
    const response = await apiClient.get('/categories/');
    return response.data;
  }
};

// Backing API calls
export const backingAPI = {
  createBacking: async (backingData, paymentIntentId) => {
    const response = await apiClient.post('/backing/', backingData, {
      params: { payment_intent_id: paymentIntentId }
    });
    return response.data;
  },
  
  createPaymentIntent: async (backingData) => {
    const response = await apiClient.post('/backing/create-payment-intent', backingData);
    return response.data;
  },
  
  getProjectBackings: async (projectId) => {
    const response = await apiClient.get(`/backing/project/${projectId}`);
    return response.data;
  }
};

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;