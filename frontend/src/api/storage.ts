import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const REFRESH_TOKEN_KEY = 'regency_salma_refresh_token';

// In-memory fallback for web environments where SecureStore is not natively supported
let webMemoryToken: string | null = null;

export const storage = {
  async saveRefreshToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webMemoryToken = token;
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      }
    } catch (e) {
      console.warn('Failed to save refresh token to secure storage', e);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(REFRESH_TOKEN_KEY) || webMemoryToken;
        }
        return webMemoryToken;
      }
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.warn('Failed to get refresh token from secure storage', e);
      return null;
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webMemoryToken = null;
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Failed to remove refresh token from secure storage', e);
    }
  },
};
