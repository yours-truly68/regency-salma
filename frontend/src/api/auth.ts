import { api } from './client';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  unitNumber: string;
  role: 'OWNER' | 'TENANT' | 'RESIDENT' | string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName?: string;
  floor?: string;
  room?: string;
  role?: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const res = await api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken });
    return res.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout', { refreshToken });
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await api.get<UserProfile>('/auth/me');
    return res.data;
  },
};
