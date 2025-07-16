import api from '../utils/api';

// Services pour les utilisateurs (étudiants)
export const userService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/login-student', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/api/register-student', userData);
    return response.data;
  }
};

// Services pour les entreprises
export const companyService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/login-company', { email, password });
    return response.data;
  },
  
  register: async (companyData: any) => {
    const response = await api.post('/api/register-company', companyData);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/api/companies');
    return response.data;
  },
  
  getConnected: async () => {
    const response = await api.get('/api/companies/connected');
    return response.data;
  },
  
  uploadLogo: async (formData: FormData) => {
    const response = await api.post('/api/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Services pour les emplois
export const jobService = {
  getAll: async () => {
    const response = await api.get('/api/jobs');
    return response.data;
  },
  
  create: async (jobData: any) => {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  },
  
  update: async (id: string, jobData: any) => {
    const response = await api.put(`/api/jobs/${id}`, jobData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/api/jobs/${id}`);
    return response.data;
  }
};

// Services pour les avis
export const reviewService = {
  getAll: async () => {
    const response = await api.get('/api/reviews');
    return response.data;
  },
  
  create: async (reviewData: any) => {
    const response = await api.post('/api/reviews', reviewData);
    return response.data;
  },
  
  update: async (id: string, reviewData: any) => {
    const response = await api.put(`/api/reviews/${id}`, reviewData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  }
};

// Services pour les contacts
export const contactService = {
  send: async (contactData: any) => {
    const response = await api.post('/api/contact', contactData);
    return response.data;
  }
};

// Services pour l'administration
export const adminService = {
  login: async (credentials: any) => {
    const response = await api.post('/api/login-admin', credentials);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  }
};
