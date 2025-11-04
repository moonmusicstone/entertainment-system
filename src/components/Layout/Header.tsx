import { useState } from 'react'
import { Search, Moon, Sun, User, Settings, Bell } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'
import { useUserStore } from '../../stores/userStore'
import { motion } from 'framer-motion'

const Header = () => {
  const { isDark, toggleTheme } = useThemeStore()
  const { user, isAuthenticated } = useUserStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 实现搜索功能
    console.log('搜索:', searchQuery)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-800/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-700">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">ES</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            娱乐系统
          </h1>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="flex-1 max-w-md mx-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索影视、音乐、游戏、小说..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </motion.form>

        {/* Right Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.username}
                className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-dark-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.username}
              </span>
            </div>
          ) : (
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
              <User className="w-4 h-4" />
              <span>登录</span>
            </button>
          )}

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </motion.div>
      </div>
    </header>
  )
}

export default Header