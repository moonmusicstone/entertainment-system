import { motion } from 'framer-motion'
import { Play, Trophy, Clock, Star, Gamepad2 } from 'lucide-react'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'

const Games = () => {
  const categories = [
    { id: 'all', label: '全部游戏' },
    { id: 'puzzle', label: '益智' },
    { id: 'action', label: '动作' },
    { id: 'strategy', label: '策略' },
    { id: 'casual', label: '休闲' },
  ]

  const games = [
    {
      id: 1,
      title: '俄罗斯方块',
      category: 'puzzle',
      difficulty: 'medium',
      rating: 4.8,
      playCount: 15420,
      thumbnail: '/placeholder-game.jpg',
      description: '经典的俄罗斯方块游戏，考验你的反应速度和空间想象力',
    },
    {
      id: 2,
      title: '纪念碑谷',
      category: 'puzzle',
      difficulty: 'easy',
      rating: 4.9,
      playCount: 8932,
      thumbnail: '/placeholder-game2.jpg',
      description: '美轮美奂的视觉解谜游戏，探索不可能的几何世界',
    },
    {
      id: 3,
      title: '贪吃蛇',
      category: 'casual',
      difficulty: 'easy',
      rating: 4.5,
      playCount: 23456,
      thumbnail: '/placeholder-game3.jpg',
      description: '经典的贪吃蛇游戏，简单易上手但充满挑战',
    },
  ]

  const topGames = games.slice(0, 3)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-4">游戏中心</h1>
        <p className="text-blue-100 mb-6">
          挑战各种有趣的游戏，享受娱乐时光
        </p>
        <Button size="lg" variant="secondary" icon={<Gamepad2 className="w-5 h-5" />}>
          开始游戏
        </Button>
      </motion.section>

      {/* Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button key={category.id} variant="ghost" size="sm">
              {category.label}
            </Button>
          ))}
        </div>
      </motion.section>

      {/* Top Games */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">热门游戏</h2>
          <Button variant="ghost" icon={<Trophy className="w-4 h-4" />}>
            排行榜
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card hover className="overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-dark-700 rounded-lg mb-4 flex items-center justify-center relative group">
                  <Gamepad2 className="w-12 h-12 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button icon={<Play className="w-6 h-6" />}>
                      开始游戏
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {game.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(game.difficulty)}`}>
                    {game.difficulty === 'easy' && '简单'}
                    {game.difficulty === 'medium' && '中等'}
                    {game.difficulty === 'hard' && '困难'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{game.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {game.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>已玩 {game.playCount.toLocaleString()} 次</span>
                  <Button size="sm" icon={<Play className="w-4 h-4" />}>
                    开始
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* All Games */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">全部游戏</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card hover className="overflow-hidden">
                <div className="aspect-square bg-gray-200 dark:bg-dark-700 rounded-lg mb-3 flex items-center justify-center relative group">
                  <Gamepad2 className="w-8 h-8 text-gray-400 group-hover:text-primary-600 transition-colors" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button size="sm" icon={<Play className="w-4 h-4" />}>
                      开始
                    </Button>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                  {game.title}
                </h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{game.rating}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {game.playCount > 1000 ? `${Math.floor(game.playCount / 1000)}k` : game.playCount}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Game Stats */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">我的游戏统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">游戏时长</h3>
            <p className="text-2xl font-bold text-blue-600">24小时</p>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">完成游戏</h3>
            <p className="text-2xl font-bold text-green-600">12个</p>
          </Card>
          <Card className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">最高分</h3>
            <p className="text-2xl font-bold text-purple-600">15,420</p>
          </Card>
        </div>
      </motion.section>
    </div>
  )
}

export default Games