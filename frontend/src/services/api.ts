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

// Interceptor para manejar errores.
// Solo cerramos sesión ante un 401 REAL del servidor (token inválido/expirado).
// Los fallos de red (sin `response`) NO deben expulsar al usuario: puede estar offline.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('cached_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const CACHED_USER_KEY = 'cached_user';

export function getCachedUser(): User | null {
  const raw = localStorage.getItem(CACHED_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

// API de Autenticación
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    if (response.data.user) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem(CACHED_USER_KEY);
  },

  // Intenta traer el usuario del servidor; si no hay red, usa el usuario cacheado
  // en el último login para permitir uso offline.
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/auth/me');
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(response.data));
      return response.data;
    } catch (error: any) {
      const cached = getCachedUser();
      if (!error.response && cached) {
        // Sin respuesta del servidor => offline: devolvemos el usuario cacheado.
        return cached;
      }
      throw error;
    }
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

  save: async (formNumberOrId: number, formData: Record<string, any>, status: 'draft' | 'submitted' | 'completed' = 'draft'): Promise<UserResponse> => {
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
