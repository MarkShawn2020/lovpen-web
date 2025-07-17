import { jwtDecode } from 'jwt-decode';

// Types based on FastAPI OpenAPI schema
export type User = {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  credits: number;
  disabled: boolean;
  is_admin: boolean;
  created_at: string;
}

export type AuthTokens = {
  access_token: string;
  token_type: string;
}

export type RegisterRequest = {
  username: string;
  email?: string | null;
  phone?: string | null;
  full_name?: string | null;
  password?: string | null;
  oauth_provider?: string | null;
  oauth_id?: string | null;
}

export type LoginRequest = {
  username_or_email: string;
  password: string;
}

export type UserProfileUpdate = {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export type AuthState = {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}

export type JWTPayload = {
  sub: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

export class FastAPIAuthService {
  private baseUrl: string;
  private tokens: AuthTokens | null = null;
  private user: User | null = null;
  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';
    this.loadFromStorage();
  }

  /**
   * 用户注册
   */
  async register(request: RegisterRequest): Promise<User> {
    const response = await fetch(`${this.baseUrl}/account/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Registration failed: ${response.status}`);
    }

    const user = await response.json();
    return user;
  }

  /**
   * 用户登录
   */
  async login(request: LoginRequest): Promise<AuthTokens> {
    const response = await fetch(`${this.baseUrl}/account/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Login failed: ${response.status}`);
    }

    const tokens = await response.json();
    this.tokens = tokens;
    
    // 获取用户信息
    await this.fetchCurrentUser();
    
    // 保存到本地存储
    this.saveToStorage();
    
    // 通知监听器
    this.notifyListeners();
    
    return tokens;
  }

  /**
   * 获取当前用户信息
   */
  async fetchCurrentUser(): Promise<User> {
    if (!this.tokens) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${this.baseUrl}/user/profile`, {
      headers: {
        Authorization: `Bearer ${this.tokens.access_token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        this.logout();
        throw new Error('Authentication expired');
      }
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const user = await response.json();
    this.user = user;
    return user;
  }

  /**
   * 登出
   */
  async logout(): Promise<void> {
    this.tokens = null;
    this.user = null;
    this.clearStorage();
    this.notifyListeners();
  }

  /**
   * 检查token是否有效
   */
  isTokenValid(): boolean {
    if (!this.tokens) {
 return false; 
}

    try {
      const decoded = jwtDecode<JWTPayload>(this.tokens.access_token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * 获取认证头部
   */
  getAuthHeaders(): Record<string, string> | null {
    if (!this.tokens || !this.isTokenValid()) {
      return null;
    }

    return {
      'Authorization': `Bearer ${this.tokens.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * 获取认证状态
   */
  getAuthState(): AuthState {
    return {
      user: this.user,
      tokens: this.tokens,
      loading: false,
      error: null,
    };
  }

  /**
   * 检查是否已认证
   */
  isAuthenticated(): boolean {
    return this.tokens !== null && this.user !== null && this.isTokenValid();
  }

  /**
   * 订阅认证状态变化
   */
  subscribe(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    
    // 立即调用一次
    callback(this.getAuthState());
    
    // 返回取消订阅函数
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * 更新用户profile
   */
  async updateProfile(update: UserProfileUpdate): Promise<User> {
    if (!this.tokens) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${this.baseUrl}/user/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        this.logout();
        throw new Error('Authentication expired');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Update profile failed: ${response.status}`);
    }

    const user = await response.json();
    this.user = user;
    
    // 保存到本地存储
    this.saveToStorage();
    
    // 通知监听器
    this.notifyListeners();
    
    return user;
  }

  /**
   * 创建认证请求
   */
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, logout and throw error
      this.logout();
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Request failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 初始化认证状态
   */
  async initialize(): Promise<void> {
    if (this.tokens && this.isTokenValid()) {
      try {
        await this.fetchCurrentUser();
        this.notifyListeners();
      } catch (error) {
        console.error('Failed to initialize user:', error);
        this.logout();
      }
    }
  }

  /**
   * 保存到本地存储和cookie
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fastapi_auth_token', JSON.stringify(this.tokens));
        localStorage.setItem('fastapi_auth_user', JSON.stringify(this.user));
        
        // 同时保存到cookie供middleware使用
        if (this.tokens) {
          document.cookie = `fastapi_auth_token=${this.tokens.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        }
      } catch (error) {
        console.error('Failed to save to storage:', error);
      }
    }
  }

  /**
   * 从本地存储加载
   */
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const tokensStr = localStorage.getItem('fastapi_auth_token');
        const userStr = localStorage.getItem('fastapi_auth_user');
        
        if (tokensStr) {
          this.tokens = JSON.parse(tokensStr);
        }
        
        if (userStr) {
          this.user = JSON.parse(userStr);
        }
      } catch (error) {
        console.error('Failed to load from storage:', error);
        this.clearStorage();
      }
    }
  }

  /**
   * 清除本地存储和cookie
   */
  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fastapi_auth_token');
      localStorage.removeItem('fastapi_auth_user');
      
      // 清除cookie
      document.cookie = 'fastapi_auth_token=; path=/; max-age=0; SameSite=Strict';
    }
  }

  /**
   * 通知监听器
   */
  private notifyListeners(): void {
    const state = this.getAuthState();
    this.listeners.forEach(listener => listener(state));
  }
}

// 全局实例
export const fastAPIAuthService = new FastAPIAuthService();
