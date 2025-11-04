import { api, endpoints } from '../config/api';
import { User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  username?: string;
  avatar?: string;
  preferences?: Record<string, any>;
}

class AuthService {
  // 登录
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post(endpoints.auth.login, credentials);
    
    // 保存token到localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data;
  }

  // 注册
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post(endpoints.auth.register, userData);
    
    // 保存token到localStorage
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data;
  }

  // 登出
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await api.post(endpoints.auth.logout);
      return response.data;
    } finally {
      // 无论API调用是否成功，都清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('user-storage');
    }
  }

  // 获取用户信息
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get(endpoints.auth.profile);
    return response.data;
  }

  // 更新用户信息
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<{ user: User }>> {
    const response = await api.put(endpoints.auth.profile, data);
    return response.data;
  }

  // 修改密码
  async changePassword(data: ChangePasswordData): Promise<ApiResponse<null>> {
    const response = await api.put(endpoints.auth.changePassword, data);
    return response.data;
  }

  // 刷新token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post(endpoints.auth.refresh);
    
    // 更新localStorage中的token
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    return response.data;
  }

  // 删除账户
  async deleteAccount(password: string): Promise<ApiResponse<null>> {
    const response = await api.delete(endpoints.auth.deleteAccount, {
      data: { password }
    });
    
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user-storage');
    
    return response.data;
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // 获取当前token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService();
export default authService;