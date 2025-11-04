import { motion } from 'framer-motion'
import { Book, BookOpen, Clock, Star, Search, Filter } from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'

const Books = () => {
  const categories = [
    { id: 'all', label: '全部小说' },
    { id: 'fantasy', label: '玄幻' },
    { id: 'romance', label: '言情' },
    { id: 'scifi', label: '科幻' },
    { id: 'mystery', label: '悬疑' },
    { id: 'history', label: '历史' },
  ]

  const books = [
    {
      id: 1,
      title: '斗破苍穹',
      author: '天蚕土豆',
      category: 'fantasy',
      status: 'completed',
      rating: 4.7,
      chapters: 1648,
      readCount: 2340000,
      cover: '/placeholder-book.jpg',
      description: '这里是斗气大陆，没有花俏的魔法，有的，仅仅是繁衍到巅峰的斗气！',
      lastRead: 156,
    },
    {
      id: 2,
      title: '三体',
      author: '刘慈欣',
      category: 'scifi',
      status: 'completed',
      rating: 4.9,
      chapters: 89,
      readCount: 1890000,
      cover: '/placeholder-book2.jpg',
      description: '文明的冲突与融合，宇宙社会学的终极思考',
      lastRead: 23,
    },
    {
      id: 3,
      title: '庆余年',
      author: '猫腻',
      category: 'history',
      status: 'completed',
      rating: 4.8,
      chapters: 756,
      readCount: 1560000,
      cover: '/placeholder-book3.jpg',
      description: '一个年轻人的成长史，一段波澜壮阔的历史',
      lastRead: 0,
    },
  ]

  const recentBooks = books.filter(book => book.lastRead > 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'ongoing': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完结'
      case 'ongoing': return '连载中'
      case 'paused': return '暂停'
      default: return '未知'
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-4">小说阅读</h1>
        <p className="text-purple-100 mb-6">
          沉浸在文字的世界里，享受阅读的乐趣
        </p>
        <Button size="lg" variant="secondary" icon={<BookOpen className="w-5 h-5" />}>
          开始阅读
        </Button>
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
              placeholder="搜索书名、作者..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <Button variant="ghost" icon={<Filter className="w-4 h-4" />}>
            筛选
          </Button>
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
            <Button key={category.id} variant="ghost" size="sm">
              {category.label}
            </Button>
          ))}
        </div>
      </motion.section>

      {/* Continue Reading */}
      {recentBooks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">继续阅读</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card hover className="overflow-hidden">
                  <div className="flex space-x-4">
                    <div className="w-16 h-20 bg-gray-200 dark:bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Book className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {book.author}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(book.status)}`}>
                          {getStatusText(book.status)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{book.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        已读至第 {book.lastRead} 章 / 共 {book.chapters} 章
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-3">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(book.lastRead / book.chapters) * 100}%` }}
                        />
                      </div>
                      <Button size="sm" icon={<BookOpen className="w-4 h-4" />}>
                        继续阅读
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Popular Books */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">热门推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="flex space-x-4">
                  <div className="w-20 h-28 bg-gray-200 dark:bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Book className="w-10 h-10 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(book.status)}`}>
                        {getStatusText(book.status)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <span>{book.chapters} 章</span>
                      <span>{(book.readCount / 10000).toFixed(1)}万人阅读</span>
                    </div>
                    <Button size="sm" icon={<BookOpen className="w-4 h-4" />}>
                      开始阅读
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Reading Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">阅读统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">阅读时长</h3>
            <p className="text-2xl font-bold text-blue-600">48小时</p>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Book className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">已读书籍</h3>
            <p className="text-2xl font-bold text-green-600">23本</p>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">在读书籍</h3>
            <p className="text-2xl font-bold text-purple-600">5本</p>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">收藏书籍</h3>
            <p className="text-2xl font-bold text-orange-600">156本</p>
          </Card>
        </div>
      </motion.section>
    </div>
  )
}

export default Books