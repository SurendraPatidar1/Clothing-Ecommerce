import axios, { AxiosError } from 'axios';
import type { ApiErrorBody } from '@/types';

const TOKEN_KEY = 'cjmw_token';

export const AUTH_LOGOUT_EVENT = 'cjmw:auth-logout';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(TOKEN_KEY),
  set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

const baseURL = import.meta.env.VITE_API_BASE_URL;
if (!baseURL) {
  console.error('VITE_API_BASE_URL is not set. Copy .env.example to .env and configure it.');
}

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only a 401 on an authenticated request means the session is invalid; login failures are excluded.
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return 'Unable to reach the server. Please check your connection.';
    }
    const body = error.response.data;
    const firstFieldError = body?.fieldErrors && Object.values(body.fieldErrors)[0];
    return firstFieldError || body?.message || fallback;
  }
  // Client-side validation errors (e.g. guest cart stock checks) carry user-facing messages.
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export default api;
