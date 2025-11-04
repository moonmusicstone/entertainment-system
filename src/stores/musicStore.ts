import { create } from 'zustand'
import { Song, Playlist } from '../types'

interface MusicState {
  currentSong: Song | null
  playlist: Song[]
  currentIndex: number
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  repeatMode: 'none' | 'one' | 'all'
  shuffleMode: boolean
  
  // Actions
  playSong: (song: Song, playlist?: Song[]) => void
  pauseSong: () => void
  resumeSong: () => void
  nextSong: () => void
  previousSong: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void
  toggleShuffle: () => void
  setPlaylist: (playlist: Song[]) => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
}

export const useMusicStore = create<MusicState>((set, get) => ({
  currentSong: null,
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  repeatMode: 'none',
  shuffleMode: false,

  playSong: (song, playlist) => {
    const newPlaylist = playlist || get().playlist
    const index = newPlaylist.findIndex(s => s.id === song.id)
    
    set({
      currentSong: song,
      playlist: newPlaylist,
      currentIndex: index >= 0 ? index : 0,
      isPlaying: true,
      currentTime: 0,
    })
  },

  pauseSong: () => set({ isPlaying: false }),
  
  resumeSong: () => set({ isPlaying: true }),

  nextSong: () => {
    const { playlist, currentIndex, repeatMode, shuffleMode } = get()
    if (playlist.length === 0) return

    let nextIndex = currentIndex
    
    if (shuffleMode) {
      nextIndex = Math.floor(Math.random() * playlist.length)
    } else if (repeatMode === 'one') {
      nextIndex = currentIndex
    } else {
      nextIndex = (currentIndex + 1) % playlist.length
    }

    const nextSong = playlist[nextIndex]
    if (nextSong) {
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        currentTime: 0,
      })
    }
  },

  previousSong: () => {
    const { playlist, currentIndex } = get()
    if (playlist.length === 0) return

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1
    const prevSong = playlist[prevIndex]
    
    if (prevSong) {
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        currentTime: 0,
      })
    }
  },

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  setDuration: (duration) => set({ duration }),
  
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  
  toggleShuffle: () => set((state) => ({ shuffleMode: !state.shuffleMode })),
  
  setPlaylist: (playlist) => set({ playlist }),
  
  addToQueue: (song) => set((state) => ({
    playlist: [...state.playlist, song]
  })),
  
  removeFromQueue: (index) => set((state) => ({
    playlist: state.playlist.filter((_, i) => i !== index)
  })),
}))