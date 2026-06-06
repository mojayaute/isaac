import axios from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  User, 
  Form, 
  UserResponse, 
  UserProgress 
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API de Autenticación
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },
};

// API de Formularios
export const formsApi = {
  getAll: async (): Promise<Form[]> => {
    const response = await api.get<Form[]>('/forms');
    return response.data;
  },

  getById: async (id: number): Promise<Form> => {
    const response = await api.get<Form>(`/forms/${id}`);
    return response.data;
  },

  getByFormNumber: async (formNumber: number): Promise<Form> => {
    const response = await api.get<Form>(`/forms/number/${formNumber}`);
    return response.data;
  },
};

// API de Respuestas
export const responsesApi = {
  getByUser: async (userId: string): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>(`/responses/user/${userId}`);
    return response.data;
  },

  getByForm: async (userId: string, formNumber: number): Promise<UserResponse | null> => {
    try {
      const response = await api.get<UserResponse>(`/responses/user/${userId}/form/${formNumber}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  save: async (formNumberOrId: number, formData: Record<string, any>, status: 'draft' | 'submitted' = 'draft'): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/responses', {
      form_number: formNumberOrId, // Usar form_number para mayor claridad
      form_data: formData,
      status,
    });
    return response.data;
  },

  update: async (responseId: string, formData: Record<string, any>, status?: 'draft' | 'submitted' | 'completed'): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/responses/${responseId}`, {
      form_data: formData,
      status,
    });
    return response.data;
  },
};

// API de Progreso
export const progressApi = {
  getByUser: async (userId: string): Promise<UserProgress> => {
    const response = await api.get<UserProgress>(`/progress/${userId}`);
    return response.data;
  },
};

// API de Admin
export const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },

  getUserResponses: async (userId: string): Promise<UserResponse[]> => {
    const response = await api.get<UserResponse[]>(`/admin/users/${userId}/responses`);
    return response.data;
  },
};

export default api;
