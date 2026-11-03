import api from './api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },
};
