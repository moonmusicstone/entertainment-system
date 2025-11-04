import { motion } from 'framer-motion'
import { Film, Music, Gamepad2, BookOpen, TrendingUp, Clock, Star } from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import ConnectionTest from '../components/UI/ConnectionTest'

const Home = () => {
  const quickActions = [
    { icon: Film, label: '继续观看', path: '/movies', color: 'bg-red-500' },
    { icon: Music, label: '播放音乐', path: '/music', color: 'bg-green-500' },
    { icon: Gamepad2, label: '开始游戏', path: '/games', color: 'bg-blue-500' },
    { icon: BookOpen, label: '继续阅读', path: '/books', color: 'bg-purple-500' },
  ]

  const recentItems = [
    { id: 1, title: '复仇者联盟：终局之战', type: 'movie', image: '/placeholder-movie.jpg', progress: 75 },
    { id: 2, title: '夜曲', type: 'music', image: '/placeholder-music.jpg', artist: '肖邦' },
    { id: 3, title: '俄罗斯方块', type: 'game', image: '/placeholder-game.jpg', score: 15420 },
    { id: 4, title: '三体', type: 'book', image: '/placeholder-book.jpg', progress: 45 },
  ]

  const recommendations = [
    { id: 1, title: '星际穿越', type: 'movie', rating: 9.3, image: '/placeholder-movie2.jpg' },
    { id: 2, title: '月光奏鸣曲', type: 'music', rating: 9.1, image: '/placeholder-music2.jpg' },
    { id: 3, title: '纪念碑谷', type: 'game', rating: 9.5, image: '/placeholder-game2.jpg' },
    { id: 4, title: '流浪地球', type: 'book', rating: 8.8, image: '/placeholder-book2.jpg' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-8 text-white"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">欢迎回来！</h1>
            <p className="text-primary-100">
              探索精彩的娱乐世界，发现你喜爱的影视、音乐、游戏和小说
            </p>
          </div>
          <ConnectionTest className="bg-white/10 border-white/20 text-white" />
        </div>
        <div className="flex space-x-4">
          <Button variant="secondary" size="lg">
            <TrendingUp className="w-5 h-5 mr-2" />
            发现热门
          </Button>
          <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
            <Star className="w-5 h-5 mr-2" />
            我的收藏
          </Button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">快速访问</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card hover className="text-center p-6">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white">{action.label}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">最近活动</h2>
          <Button variant="ghost" icon={<Clock className="w-4 h-4" />}>
            查看全部
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {item.type === 'movie' && <Film className="w-8 h-8" />}
                    {item.type === 'music' && <Music className="w-8 h-8" />}
                    {item.type === 'game' && <Gamepad2 className="w-8 h-8" />}
                    {item.type === 'book' && <BookOpen className="w-8 h-8" />}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {item.title}
                </h3>
                {item.progress && (
                  <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.progress && `进度: ${item.progress}%`}
                  {item.artist && `艺术家: ${item.artist}`}
                  {item.score && `最高分: ${item.score}`}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recommendations */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">为你推荐</h2>
          <Button variant="ghost" icon={<TrendingUp className="w-4 h-4" />}>
            更多推荐
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {item.type === 'movie' && <Film className="w-8 h-8" />}
                    {item.type === 'music' && <Music className="w-8 h-8" />}
                    {item.type === 'game' && <Gamepad2 className="w-8 h-8" />}
                    {item.type === 'book' && <BookOpen className="w-8 h-8" />}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.rating}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}

export default Home