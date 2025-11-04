import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Film, 
  Music, 
  Gamepad2, 
  BookOpen, 
  Heart, 
  History, 
  TrendingUp,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStore } from '../../stores/userStore'

const Sidebar = () => {
  const { favorites, history } = useUserStore()

  const mainNavItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/movies', icon: Film, label: '影视' },
    { path: '/music', icon: Music, label: '音乐' },
    { path: '/games', icon: Gamepad2, label: '游戏' },
    { path: '/books', icon: BookOpen, label: '小说' },
  ]

  const userNavItems = [
    { path: '/favorites', icon: Heart, label: '我的收藏', count: favorites.length },
    { path: '/history', icon: History, label: '观看历史', count: history.length },
    { path: '/trending', icon: TrendingUp, label: '热门推荐' },
    { path: '/ratings', icon: Star, label: '我的评分' },
  ]

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 overflow-y-auto">
      <div className="p-4">
        {/* Main Navigation */}
        <nav className="space-y-2">
          {mainNavItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200 dark:border-dark-700"></div>

        {/* User Navigation */}
        <div>
          <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            个人中心
          </h3>
          <nav className="space-y-2">
            {userNavItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (mainNavItems.length + index) * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg"
        >
          <h4 className="text-sm font-semibold text-primary-800 dark:text-primary-200 mb-2">
            今日统计
          </h4>
          <div className="space-y-2 text-sm text-primary-700 dark:text-primary-300">
            <div className="flex justify-between">
              <span>观看时长</span>
              <span>2小时30分</span>
            </div>
            <div className="flex justify-between">
              <span>新增收藏</span>
              <span>3个</span>
            </div>
            <div className="flex justify-between">
              <span>完成游戏</span>
              <span>1个</span>
            </div>
          </div>
        </motion.div>
      </div>
    </aside>
  )
}

export default Sidebar