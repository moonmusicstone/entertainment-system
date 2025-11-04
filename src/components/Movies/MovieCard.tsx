import { motion } from 'framer-motion'
import { Play, Star, Calendar, Clock, Heart, MoreHorizontal } from 'lucide-react'
import { Movie } from '../../types'
import Card from '../UI/Card'
import Button from '../UI/Button'
import Badge from '../UI/Badge'
import Dropdown from '../UI/Dropdown'
import { useUserStore } from '../../stores/userStore'

interface MovieCardProps {
  movie: Movie
  variant?: 'grid' | 'list'
  onPlay?: (movie: Movie) => void
  onAddToFavorites?: (movie: Movie) => void
}

const MovieCard = ({ movie, variant = 'grid', onPlay, onAddToFavorites }: MovieCardProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useUserStore()
  const isMovieFavorite = isFavorite(movie.id, 'movie')

  const handleFavoriteToggle = () => {
    if (isMovieFavorite) {
      removeFavorite(movie.id, 'movie')
    } else {
      addFavorite({
        id: movie.id,
        type: 'movie',
        title: movie.title,
        addedAt: new Date().toISOString(),
      })
    }
    onAddToFavorites?.(movie)
  }

  const dropdownItems = [
    {
      id: 'play',
      label: '立即观看',
      icon: <Play className="w-4 h-4" />,
      onClick: () => onPlay?.(movie),
    },
    {
      id: 'favorite',
      label: isMovieFavorite ? '取消收藏' : '添加收藏',
      icon: <Heart className={`w-4 h-4 ${isMovieFavorite ? 'fill-current text-red-500' : ''}`} />,
      onClick: handleFavoriteToggle,
    },
    {
      id: 'info',
      label: '详细信息',
      icon: <MoreHorizontal className="w-4 h-4" />,
      onClick: () => console.log('Show movie details'),
    },
  ]

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 5 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer"
      >
        <div className="flex">
          <div className="relative w-20 sm:w-24 md:w-28 h-28 sm:h-32 md:h-36 flex-shrink-0">
            <div className="w-full h-full bg-gray-200 dark:bg-dark-700 rounded-l-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-l-xl" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <motion.button
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg backdrop-blur-sm"
                onClick={() => onPlay?.(movie)}
              >
                <Play className="w-3 h-3 ml-0.5" />
              </motion.button>
            </div>
            <button
              onClick={handleFavoriteToggle}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 backdrop-blur-sm ${
                isMovieFavorite
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-black/30 text-white hover:bg-black/50'
              }`}
            >
              <Heart className={`w-3 h-3 ${isMovieFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          <div className="flex-1 p-3 sm:p-4 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white truncate pr-2">
                {movie.title}
              </h3>
              <div className="flex items-center space-x-1 flex-shrink-0 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">{movie.rating}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium">{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}分钟</span>
              <span>•</span>
              <span className="truncate">{movie.country}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="primary" size="sm">{movie.genre}</Badge>
              {movie.country && (
                <Badge variant="default" size="sm">{movie.country}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
              {movie.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onPlay?.(movie)}
                  className="text-xs"
                >
                  <Play className="w-3 h-3 mr-1" />
                  播放
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs hidden sm:flex"
                >
                  详情
                </Button>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">
                {movie.views?.toLocaleString()} 次观看
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden group cursor-pointer h-full flex flex-col"
    >
      <div className="relative flex-shrink-0">
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-200 dark:bg-dark-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <Play className="w-12 h-12 text-gray-400 group-hover:text-primary-600 transition-colors" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg backdrop-blur-sm"
            onClick={() => onPlay?.(movie)}
          >
            <Play className="w-5 h-5 ml-0.5" />
          </motion.button>
        </div>
        <button
          onClick={handleFavoriteToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 backdrop-blur-sm ${
            isMovieFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-black/30 text-white hover:bg-black/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isMovieFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-medium">{movie.rating}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base mb-2 line-clamp-2 text-gray-900 dark:text-white leading-tight">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-gray-500 dark:text-gray-400">{movie.year}</span>
          <span className="text-gray-500 dark:text-gray-400">{movie.duration}分钟</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="primary" size="sm">{movie.genre}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
          {movie.description}
        </p>
        <div className="flex space-x-2 mt-auto">
          <Button
            size="sm"
            onClick={() => onPlay?.(movie)}
            className="flex-1 text-xs"
          >
            <Play className="w-3 h-3 mr-1" />
            播放
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            详情
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default MovieCard