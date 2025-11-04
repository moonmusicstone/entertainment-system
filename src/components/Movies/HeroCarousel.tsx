import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Star, Calendar } from 'lucide-react'
import Button from '../UI/Button'
import { Movie } from '../../types'

interface HeroCarouselProps {
  movies: Movie[]
  autoPlay?: boolean
  interval?: number
}

const HeroCarousel = ({ movies, autoPlay = true, interval = 5000 }: HeroCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || movies.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, movies.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (movies.length === 0) {
    return (
      <div className="relative h-96 bg-gray-200 dark:bg-dark-700 rounded-xl flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">暂无影视内容</p>
      </div>
    )
  }

  const currentMovie = movies[currentIndex]

  return (
    <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
            {/* Placeholder for movie backdrop */}
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl text-white">
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-5xl font-bold mb-4"
                >
                  {currentMovie.title}
                </motion.h1>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-4 mb-4"
                >
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{currentMovie.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-5 h-5" />
                    <span>{currentMovie.year}</span>
                  </div>
                  <span className="px-2 py-1 bg-white/20 rounded text-sm">
                    {currentMovie.genre}
                  </span>
                </motion.div>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-200 mb-6 line-clamp-3"
                >
                  {currentMovie.description}
                </motion.p>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex space-x-4"
                >
                  <Button
                    size="lg"
                    icon={<Play className="w-5 h-5" />}
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    立即观看
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="border-white text-white hover:bg-white/10"
                  >
                    了解更多
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {movies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroCarousel