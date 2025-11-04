import React, { useState } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const MusicFilter: React.FC<MusicFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedGenre,
  onGenreChange,
  selectedYear,
  onYearChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const musicTypes = [
    { value: 'all', label: '全部' },
    { value: 'album', label: '专辑' },
    { value: 'song', label: '单曲' },
    { value: 'playlist', label: '播放列表' }
  ];

  const genres = [
    { value: 'all', label: '全部流派' },
    { value: 'pop', label: '流行' },
    { value: 'rock', label: '摇滚' },
    { value: 'jazz', label: '爵士' },
    { value: 'classical', label: '古典' },
    { value: 'electronic', label: '电子' },
    { value: 'hiphop', label: '嘻哈' },
    { value: 'country', label: '乡村' },
    { value: 'folk', label: '民谣' },
    { value: 'blues', label: '蓝调' },
    { value: 'reggae', label: '雷鬼' }
  ];

  const years = [
    { value: 'all', label: '全部年代' },
    { value: '2020s', label: '2020年代' },
    { value: '2010s', label: '2010年代' },
    { value: '2000s', label: '2000年代' },
    { value: '1990s', label: '1990年代' },
    { value: '1980s', label: '1980年代' },
    { value: '1970s', label: '1970年代' },
    { value: 'older', label: '更早' }
  ];

  const sortOptions = [
    { value: 'newest', label: '最新发布' },
    { value: 'oldest', label: '最早发布' },
    { value: 'popular', label: '最受欢迎' },
    { value: 'name', label: '按名称' },
    { value: 'artist', label: '按艺术家' }
  ];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
      {/* 主要筛选区域 */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* 搜索框 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索音乐、艺术家、专辑..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* 快速筛选 */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* 类型筛选 */}
          <div className="flex items-center gap-2">
            {musicTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => onTypeChange(type.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* 高级筛选按钮 */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showAdvancedFilters
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
            }`}
          >
            <SlidersHorizontal size={16} />
            高级筛选
          </button>

          {/* 视图切换 */}
          <div className="flex items-center bg-gray-100 dark:bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-dark-600 text-primary-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-dark-600 text-primary-500 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 高级筛选面板 */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 流派筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  流派
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => onGenreChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                >
                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 年代筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  年代
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => onYearChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                >
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 排序方式 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  排序方式
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 重置按钮 */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    onSearchChange('');
                    onTypeChange('all');
                    onGenreChange('all');
                    onYearChange('all');
                    onSortChange('newest');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                >
                  重置筛选
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};