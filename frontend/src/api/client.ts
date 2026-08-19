import axios, { AxiosInstance } from 'axios';
import { storage } from './storage';

// Base API URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

let inMemoryAccessToken: string | null = null;
let onAuthFailureCallback: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => {
  return inMemoryAccessToken;
};

export const setOnAuthFailure = (callback: () => void) => {
  onAuthFailureCallback = callback;
};

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach in-memory access token
api.interceptors.request.use(
  (config) => {
    if (inMemoryAccessToken && config.headers) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 with strict retry guard
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and if we haven't already retried this request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = await storage.getRefreshToken();
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint directly using raw axios to avoid interceptor recursion
        const res = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: storedRefreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data;

        // Update in-memory access token & secure storage refresh token
        setAccessToken(newAccessToken);
        if (newRefreshToken) {
          await storage.saveRefreshToken(newRefreshToken);
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed: wipe tokens and trigger logout
        setAccessToken(null);
        await storage.removeRefreshToken();
        if (onAuthFailureCallback) {
          onAuthFailureCallback();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
