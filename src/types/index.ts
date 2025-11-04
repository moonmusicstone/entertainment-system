// 通用类型
export interface BaseItem {
  id: string
  title: string
  description?: string
  image?: string
  rating?: number
  createdAt: string
  updatedAt: string
}

// 影视相关类型
export interface Movie extends BaseItem {
  type: 'movie' | 'tv' | 'documentary'
  genre: string[]
  year: number
  duration?: number
  director?: string
  cast?: string[]
  country?: string
  language?: string
  tmdbId?: number
  imdbId?: string
  trailer?: string
  poster?: string
  backdrop?: string
}

export interface MovieFilter {
  type?: string
  genre?: string
  year?: number
  rating?: number
  country?: string
  sortBy?: 'rating' | 'year' | 'title' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

// 音乐相关类型
export interface Song extends BaseItem {
  artist: string
  album: string
  genre: string[]
  duration: number
  year: number
  audioUrl?: string
  lyrics?: string
  albumCover?: string
}

export interface Album extends BaseItem {
  artist: string
  genre: string[]
  year: number
  songs: Song[]
  cover?: string
}

export interface Artist extends BaseItem {
  genre: string[]
  albums: Album[]
  avatar?: string
  bio?: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  songs: Song[]
  cover?: string
  isPublic: boolean
  createdBy: string
  createdAt: string
}

// 游戏相关类型
export interface Game extends BaseItem {
  category: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  playCount: number
  gameUrl?: string
  thumbnail?: string
  instructions?: string
  controls?: string
  developer?: string
}

export interface GameProgress {
  gameId: string
  userId: string
  level: number
  score: number
  progress: number
  lastPlayed: string
  saveData?: any
}

// 小说相关类型
export interface Book extends BaseItem {
  author: string
  genre: string[]
  status: 'completed' | 'ongoing' | 'hiatus'
  chapters: Chapter[]
  wordCount: number
  cover?: string
  tags?: string[]
}

export interface Chapter {
  id: string
  bookId: string
  title: string
  content: string
  chapterNumber: number
  wordCount: number
  publishedAt: string
}

export interface ReadingProgress {
  bookId: string
  userId: string
  currentChapter: number
  progress: number
  lastRead: string
  bookmarks: Bookmark[]
}

export interface Bookmark {
  id: string
  chapterId: string
  position: number
  note?: string
  createdAt: string
}

// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  preferences: UserPreferences
  createdAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  notifications: boolean
  autoplay: boolean
  readingSettings: ReadingSettings
}

export interface ReadingSettings {
  fontSize: number
  fontFamily: string
  lineHeight: number
  backgroundColor: string
  textColor: string
  nightMode: boolean
}

// 收藏和历史记录类型
export interface Favorite {
  id: string
  userId: string
  itemId: string
  itemType: 'movie' | 'song' | 'game' | 'book'
  createdAt: string
}

export interface HistoryRecord {
  id: string
  userId: string
  itemId: string
  itemType: 'movie' | 'song' | 'game' | 'book'
  action: 'view' | 'play' | 'read'
  duration?: number
  progress?: number
  timestamp: string
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 搜索相关类型
export interface SearchResult {
  movies: Movie[]
  songs: Song[]
  games: Game[]
  books: Book[]
  total: number
}

export interface SearchFilters {
  query: string
  type?: 'all' | 'movie' | 'song' | 'game' | 'book'
  category?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}