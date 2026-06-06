// Tipos principales del sistema

export interface User {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface Form {
  id: number;
  formNumber: number; // camelCase para coincidir con el backend
  title: string;
  description?: string;
  isActive: boolean;
  orderIndex: number;
  htmlFilePath?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  id: string;
  user_id: string;
  form_id: number;
  formData: Record<string, any>; // JSON flexible (camelCase desde la API)
  status: 'draft' | 'submitted' | 'completed';
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  version: number;
}

export interface UserProgress {
  user_id: string;
  total_forms: number;
  completed_forms: number;
  current_form?: number;
  last_activity?: string;
  started_at?: string;
  completed_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
