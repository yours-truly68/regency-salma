import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { authApi, LoginPayload, RegisterPayload, UserProfile } from '../api/auth';
import { storage } from '../api/storage';
import { setAccessToken, setOnAuthFailure } from '../api/client';

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = !!user && !!accessToken;

  const updateTokensAndUser = useCallback((newAccessToken: string, newRefreshToken: string, newUser: UserProfile) => {
    setAccessToken(newAccessToken);
    setAccessTokenState(newAccessToken);
    setUser(newUser);
    storage.saveRefreshToken(newRefreshToken);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const storedRefreshToken = await storage.getRefreshToken();
      if (storedRefreshToken) {
        await authApi.logout(storedRefreshToken).catch(() => {});
      }
    } catch {
      // Ignore logout backend errors on client teardown
    } finally {
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
      await storage.removeRefreshToken();
      router.replace('/(auth)/login');
    }
  }, [router]);

  // Register auth failure handler from axios client
  useEffect(() => {
    setOnAuthFailure(() => {
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
      router.replace('/(auth)/login');
    });
  }, [router]);

  // Initial session hydration on app launch
  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const storedRefreshToken = await storage.getRefreshToken();
        if (!storedRefreshToken) {
          if (isMounted) setIsLoading(false);
          return;
        }

        // Refresh access token
        const tokens = await authApi.refresh(storedRefreshToken);
        setAccessToken(tokens.accessToken);
        if (tokens.refreshToken) {
          await storage.saveRefreshToken(tokens.refreshToken);
        }

        // Fetch current user profile
        const profile = await authApi.getMe();

        if (isMounted) {
          setAccessTokenState(tokens.accessToken);
          setUser(profile);
        }
      } catch (err) {
        console.warn('Session hydration failed:', err);
        await storage.removeRefreshToken();
        setAccessToken(null);
        if (isMounted) {
          setAccessTokenState(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const data = await authApi.login(payload);
    updateTokensAndUser(data.accessToken, data.refreshToken, data.user);
    router.replace('/(app)/home');
  };

  const register = async (payload: RegisterPayload) => {
    const data = await authApi.register(payload);
    updateTokensAndUser(data.accessToken, data.refreshToken, data.user);
    router.replace('/(app)/home');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSession(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return context;
}
