'use client';

import { createContext, ReactNode, use, useEffect, useState } from 'react';
import { 
   
  fastAPIAuthService 
   
} from '@/services/fastapi-auth-v2';
import type {AuthState, AuthTokens, LoginRequest, RegisterRequest, User, UserProfileUpdate} from '@/services/fastapi-auth-v2';

type AuthContextType = {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
  login: (request: LoginRequest) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (update: UserProfileUpdate) => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // 初始化认证状态
    const initializeAuth = async () => {
      try {
        await fastAPIAuthService.initialize();
      } catch (error) {
        console.error('Auth initialization error:', error);
      }
    };

    initializeAuth();

    // 订阅认证状态变化
    const unsubscribe = fastAPIAuthService.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, []);

  const login = async (request: LoginRequest): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await fastAPIAuthService.login(request);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  };

  const register = async (request: RegisterRequest): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await fastAPIAuthService.register(request);
      // 注册成功后自动登录
      if (request.password) {
        await fastAPIAuthService.login({
          username_or_email: request.username,
          password: request.password,
        });
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Registration failed'
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await fastAPIAuthService.logout();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Logout failed'
      }));
      throw error;
    }
  };

  const updateProfile = async (update: UserProfileUpdate): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await fastAPIAuthService.updateProfile(update);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Update profile failed'
      }));
      throw error;
    }
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    user: state.user,
    tokens: state.tokens,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: fastAPIAuthService.isAuthenticated(),
    clearError,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextType {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
