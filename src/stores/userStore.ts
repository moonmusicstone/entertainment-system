import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Favorite, HistoryRecord } from '../types'

interface UserState {
  user: User | null
  favorites: Favorite[]
  history: HistoryRecord[]
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  addFavorite: (favorite: Favorite) => void
  removeFavorite: (itemId: string, itemType: string) => void
  addToHistory: (record: HistoryRecord) => void
  clearHistory: () => void
  isFavorite: (itemId: string, itemType: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      favorites: [],
      history: [],
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      addFavorite: (favorite) => set((state) => ({
        favorites: [...state.favorites, favorite]
      })),
      
      removeFavorite: (itemId, itemType) => set((state) => ({
        favorites: state.favorites.filter(
          fav => !(fav.itemId === itemId && fav.itemType === itemType)
        )
      })),
      
      addToHistory: (record) => set((state) => {
        const existingIndex = state.history.findIndex(
          h => h.itemId === record.itemId && h.itemType === record.itemType
        )
        
        if (existingIndex >= 0) {
          const newHistory = [...state.history]
          newHistory[existingIndex] = record
          return { history: newHistory }
        }
        
        return { history: [record, ...state.history.slice(0, 99)] }
      }),
      
      clearHistory: () => set({ history: [] }),
      
      isFavorite: (itemId, itemType) => {
        const { favorites } = get()
        return favorites.some(fav => fav.itemId === itemId && fav.itemType === itemType)
      },
    }),
    {
      name: 'user-storage',
    }
  )
)