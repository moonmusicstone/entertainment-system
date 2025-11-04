import { useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, X, Search } from 'lucide-react'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Badge from '../UI/Badge'

interface FilterOptions {
  genres: string[]
  years: string[]
  countries: string[]
  ratings: string[]
}

interface MovieFilterProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
  options: FilterOptions
}

const MovieFilter = ({ isOpen, onClose, onApplyFilters, options }: MovieFilterProps) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleYearToggle = (year: string) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    )
  }

  const handleRatingToggle = (rating: string) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    )
  }

  const handleApplyFilters = () => {
    onApplyFilters({
      genres: selectedGenres,
      years: selectedYears,
      countries: selectedCountries,
      ratings: selectedRatings,
      search: searchQuery,
    })
    onClose()
  }

  const handleClearFilters = () => {
    setSelectedGenres([])
    setSelectedYears([])
    setSelectedCountries([])
    setSelectedRatings([])
    setSearchQuery('')
  }

  const hasActiveFilters = selectedGenres.length > 0 || selectedYears.length > 0 || 
                          selectedCountries.length > 0 || selectedRatings.length > 0 || 
                          searchQuery.length > 0

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-dark-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">筛选条件</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            搜索
          </label>
          <Input
            placeholder="搜索影视名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Genres */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            类型
          </label>
          <div className="flex flex-wrap gap-2">
            {options.genres.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Years */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            年份
          </label>
          <div className="flex flex-wrap gap-2">
            {options.years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearToggle(year)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedYears.includes(year)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            地区
          </label>
          <div className="flex flex-wrap gap-2">
            {options.countries.map((country) => (
              <button
                key={country}
                onClick={() => handleCountryToggle(country)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCountries.includes(country)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            评分
          </label>
          <div className="flex flex-wrap gap-2">
            {options.ratings.map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingToggle(rating)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedRatings.includes(rating)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-600">
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            清除筛选
          </Button>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleApplyFilters}>
              应用筛选
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">当前筛选条件：</p>
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <Badge key={`genre-${genre}`} variant="primary" size="sm">
                  {genre}
                </Badge>
              ))}
              {selectedYears.map((year) => (
                <Badge key={`year-${year}`} variant="info" size="sm">
                  {year}
                </Badge>
              ))}
              {selectedCountries.map((country) => (
                <Badge key={`country-${country}`} variant="success" size="sm">
                  {country}
                </Badge>
              ))}
              {selectedRatings.map((rating) => (
                <Badge key={`rating-${rating}`} variant="warning" size="sm">
                  {rating}
                </Badge>
              ))}
              {searchQuery && (
                <Badge variant="default" size="sm">
                  搜索: {searchQuery}
                </Badge>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default MovieFilter