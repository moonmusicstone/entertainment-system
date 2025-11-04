import { useState } from 'react'
import { motion } from 'framer-motion'
import { Grid, List, Filter, Search } from 'lucide-react'
import Button from '../components/UI/Button'
import HeroCarousel from '../components/Movies/HeroCarousel'
import MovieCard from '../components/Movies/MovieCard'
import MovieFilter from '../components/Movies/MovieFilter'
import { Movie } from '../types'

const Movies = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({})

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'action', label: '动作' },
    { id: 'comedy', label: '喜剧' },
    { id: 'drama', label: '剧情' },
    { id: 'horror', label: '恐怖' },
    { id: 'romance', label: '爱情' },
    { id: 'scifi', label: '科幻' },
  ]

  const movieTypes = [
    { id: 'movie', label: '电影' },
    { id: 'tv', label: '电视剧' },
    { id: 'anime', label: '动漫' },
    { id: 'documentary', label: '纪录片' },
  ]

  const movies: Movie[] = [
    {
      id: 1,
      title: '阿凡达：水之道',
      genre: ['科幻', '动作'],
      year: 2022,
      rating: 8.1,
      duration: 192,
      country: '美国',
      director: '詹姆斯·卡梅隆',
      description: '杰克·萨利与妻子奈蒂莉组建了家庭，他们的孩子也逐渐成长，为这个家庭带来了许多欢乐。然而危机未曾消散，杰克一家再度踏上冒险征程，跋山涉水，来到潘多拉星球临海的岛礁族人中间寻求庇护。',
      poster: '/placeholder-movie.jpg',
      views: 2340000,
      type: 'movie',
      status: 'released',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: '流浪地球2',
      genre: ['科幻', '灾难'],
      year: 2023,
      rating: 8.3,
      duration: 173,
      country: '中国',
      director: '郭帆',
      description: '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，为了人类能在漫长的2500年后抵达新的家园，流浪地球时代的年轻人挺身而出，展开争分夺秒的生死之战。',
      poster: '/placeholder-movie2.jpg',
      views: 1890000,
      type: 'movie',
      status: 'released',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: '满江红',
      genre: ['剧情', '悬疑'],
      year: 2023,
      rating: 8.0,
      duration: 159,
      country: '中国',
      director: '张艺谋',
      description: '南宋绍兴年间，岳飞死后四年，秦桧率兵与金国会谈。会谈前夜，金国使者死在宰相驻地，所携密信也不翼而飞。小兵张大与亲兵营副统领孙均受命调查此事，发现死者居然另有其人，而案件的背后似乎隐藏着一个巨大的秘密。',
      poster: '/placeholder-movie3.jpg',
      views: 1560000,
      type: 'movie',
      status: 'released',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: '黑豹2：瓦坎达万岁',
      genre: ['动作', '科幻'],
      year: 2022,
      rating: 7.8,
      duration: 161,
      country: '美国',
      director: '瑞恩·库格勒',
      description: '瓦坎达国王特查拉去世后，苏睿、奥克耶、拉玛达女王和朵拉卫队努力保护他们的国家免受世界强国的干预。',
      poster: '/placeholder-movie4.jpg',
      views: 1200000,
      type: 'movie',
      status: 'released',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: '壮志凌云：独行侠',
      genre: ['动作', '剧情'],
      year: 2022,
      rating: 8.5,
      duration: 130,
      country: '美国',
      director: '约瑟夫·科辛斯基',
      description: '经过三十多年的服役，皮特·"独行侠"·米切尔仍是一名顶级海军飞行员，他躲避着本应属于他的晋升，仍然推动着可能的极限。',
      poster: '/placeholder-movie5.jpg',
      views: 980000,
      type: 'movie',
      status: 'released',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      title: '奇异博士2：疯狂多元宇宙',
      genre: ['动作', '奇幻'],
      year: 2022,
      rating: 7.6,
      duration: 126,
      country: '美国',
      director: '山姆·雷米',
      description: '奇异博士在多元宇宙的疯狂中穿行，面对一个神秘的新对手。',
      poster: '/placeholder-movie6.jpg',
      views: 1450000,
      type: 'movie',
      status: 'released',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  const featuredMovies = movies.slice(0, 3)

  const filterOptions = {
    genres: ['动作', '喜剧', '剧情', '科幻', '爱情', '恐怖', '悬疑', '战争'],
    years: ['2024', '2023', '2022', '2021', '2020', '2019', '2018'],
    countries: ['中国', '美国', '日本', '韩国', '英国', '法国'],
    ratings: ['9.0+', '8.0+', '7.0+', '6.0+'],
  }

  const handlePlayMovie = (movie: Movie) => {
    console.log('Playing movie:', movie.title)
    // 这里可以集成视频播放器
  }

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters)
    setIsFilterOpen(false)
    console.log('Applied filters:', filters)
    // 这里可以根据筛选条件过滤电影列表
  }

  return (
    <div className="space-y-6">
      {/* Hero Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <HeroCarousel movies={featuredMovies} />
      </motion.section>

      {/* Search and Filter */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索影视作品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              icon={<Filter className="w-4 h-4" />}
              onClick={() => setIsFilterOpen(true)}
            >
              筛选
            </Button>
            <div className="flex border border-gray-300 dark:border-dark-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.section>

      {/* Movie Types */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex flex-wrap gap-2">
          {movieTypes.map((type) => (
            <Button
              key={type.id}
              variant="ghost"
              size="sm"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </motion.section>

      {/* Featured Movies */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">精选推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <MovieCard
                movie={movie}
                variant="grid"
                onPlay={handlePlayMovie}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* All Movies */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">全部影视</h2>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              最新
            </Button>
            <Button variant="ghost" size="sm">
              热门
            </Button>
            <Button variant="ghost" size="sm">
              评分
            </Button>
          </div>
        </div>
        
        <div className={`grid gap-4 sm:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr' 
            : 'grid-cols-1'
        }`}>
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <MovieCard
                movie={movie}
                variant={viewMode}
                onPlay={handlePlayMovie}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Movie Filter Modal */}
      <MovieFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        options={filterOptions}
      />
    </div>
  )
}

export default Movies