import { api, endpoints } from '../config/api';
import { Movie, Music, Game, Book, Category, ApiResponse } from '../types';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  q?: string;
  genre?: string;
  year?: number;
  rating?: number;
  language?: string;
  country?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ContentService {
  // 电影相关
  async getMovies(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const response = await api.get(endpoints.movies.list, { params });
    return response.data;
  }

  async getMovie(id: string): Promise<ApiResponse<{ movie: Movie }>> {
    const response = await api.get(endpoints.movies.detail(id));
    return response.data;
  }

  async searchMovies(params: SearchParams): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const response = await api.get(endpoints.movies.search, { params });
    return response.data;
  }

  async getTrendingMovies(): Promise<ApiResponse<{ movies: Movie[] }>> {
    const response = await api.get(endpoints.movies.trending);
    return response.data;
  }

  async getFeaturedMovies(): Promise<ApiResponse<{ movies: Movie[] }>> {
    const response = await api.get(endpoints.movies.featured);
    return response.data;
  }

  // 音乐相关
  async getMusic(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Music>>> {
    const response = await api.get(endpoints.music.list, { params });
    return response.data;
  }

  async getMusicTrack(id: string): Promise<ApiResponse<{ music: Music }>> {
    const response = await api.get(endpoints.music.detail(id));
    return response.data;
  }

  async searchMusic(params: SearchParams): Promise<ApiResponse<PaginatedResponse<Music>>> {
    const response = await api.get(endpoints.music.search, { params });
    return response.data;
  }

  async getTrendingMusic(): Promise<ApiResponse<{ music: Music[] }>> {
    const response = await api.get(endpoints.music.trending);
    return response.data;
  }

  async getFeaturedMusic(): Promise<ApiResponse<{ music: Music[] }>> {
    const response = await api.get(endpoints.music.featured);
    return response.data;
  }

  // 游戏相关
  async getGames(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Game>>> {
    const response = await api.get(endpoints.games.list, { params });
    return response.data;
  }

  async getGame(id: string): Promise<ApiResponse<{ game: Game }>> {
    const response = await api.get(endpoints.games.detail(id));
    return response.data;
  }

  async searchGames(params: SearchParams): Promise<ApiResponse<PaginatedResponse<Game>>> {
    const response = await api.get(endpoints.games.search, { params });
    return response.data;
  }

  async getTrendingGames(): Promise<ApiResponse<{ games: Game[] }>> {
    const response = await api.get(endpoints.games.trending);
    return response.data;
  }

  async getFeaturedGames(): Promise<ApiResponse<{ games: Game[] }>> {
    const response = await api.get(endpoints.games.featured);
    return response.data;
  }

  // 书籍相关
  async getBooks(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Book>>> {
    const response = await api.get(endpoints.books.list, { params });
    return response.data;
  }

  async getBook(id: string): Promise<ApiResponse<{ book: Book }>> {
    const response = await api.get(endpoints.books.detail(id));
    return response.data;
  }

  async searchBooks(params: SearchParams): Promise<ApiResponse<PaginatedResponse<Book>>> {
    const response = await api.get(endpoints.books.search, { params });
    return response.data;
  }

  async getTrendingBooks(): Promise<ApiResponse<{ books: Book[] }>> {
    const response = await api.get(endpoints.books.trending);
    return response.data;
  }

  async getFeaturedBooks(): Promise<ApiResponse<{ books: Book[] }>> {
    const response = await api.get(endpoints.books.featured);
    return response.data;
  }

  // 分类相关
  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await api.get(endpoints.categories.list);
    return response.data;
  }

  async getCategory(id: string): Promise<ApiResponse<{ category: Category }>> {
    const response = await api.get(endpoints.categories.detail(id));
    return response.data;
  }

  async getCategoriesByType(type: string): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await api.get(endpoints.categories.byType(type));
    return response.data;
  }

  // 通用搜索
  async globalSearch(query: string, type?: string): Promise<ApiResponse<{
    movies: Movie[];
    music: Music[];
    games: Game[];
    books: Book[];
  }>> {
    const params = { q: query, type };
    const response = await api.get('/search', { params });
    return response.data;
  }
}

export const contentService = new ContentService();
export default contentService;