import axios from 'axios';

// API基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 创建axios实例
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误和token刷新
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果是401错误且不是登录请求，尝试刷新token
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post('/auth/refresh');
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem('token', newToken);
        
        // 重新发送原始请求
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 刷新失败，清除token并跳转到登录页
        localStorage.removeItem('token');
        localStorage.removeItem('user-storage');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API端点配置
export const endpoints = {
  // 认证相关
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
    changePassword: '/auth/password',
    deleteAccount: '/auth/account',
  },
  
  // 用户相关
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    search: '/users/search',
    advancedSearch: '/users/search/advanced',
  },
  
  // 电影相关
  movies: {
    list: '/movies',
    detail: (id: string) => `/movies/${id}`,
    create: '/movies',
    update: (id: string) => `/movies/${id}`,
    delete: (id: string) => `/movies/${id}`,
    search: '/movies/search',
    trending: '/movies/trending',
    featured: '/movies/featured',
  },
  
  // 音乐相关
  music: {
    list: '/music',
    detail: (id: string) => `/music/${id}`,
    create: '/music',
    update: (id: string) => `/music/${id}`,
    delete: (id: string) => `/music/${id}`,
    search: '/music/search',
    trending: '/music/trending',
    featured: '/music/featured',
  },
  
  // 游戏相关
  games: {
    list: '/games',
    detail: (id: string) => `/games/${id}`,
    create: '/games',
    update: (id: string) => `/games/${id}`,
    delete: (id: string) => `/games/${id}`,
    search: '/games/search',
    trending: '/games/trending',
    featured: '/games/featured',
  },
  
  // 书籍相关
  books: {
    list: '/books',
    detail: (id: string) => `/books/${id}`,
    create: '/books',
    update: (id: string) => `/books/${id}`,
    delete: (id: string) => `/books/${id}`,
    search: '/books/search',
    trending: '/books/trending',
    featured: '/books/featured',
  },
  
  // 分类相关
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
    create: '/categories',
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
    byType: (type: string) => `/categories/type/${type}`,
  },
  
  // 管理员相关
  admin: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    content: '/admin/content',
    analytics: '/admin/analytics',
    system: '/admin/system',
    health: '/admin/health',
    bulkContentStatus: '/admin/bulk/content-status',
  },
};

export default api;