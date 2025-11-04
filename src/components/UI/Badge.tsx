import { motion } from 'framer-motion'
import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Badge = ({ children, variant = 'default', size = 'md', className }: BadgeProps) => {
  const badgeClasses = clsx(
    'inline-flex items-center font-medium rounded-full',
    {
      // Variants
      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200': variant === 'default',
      'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300': variant === 'primary',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': variant === 'success',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': variant === 'warning',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300': variant === 'danger',
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': variant === 'info',
      
      // Sizes
      'px-2 py-1 text-xs': size === 'sm',
      'px-3 py-1 text-sm': size === 'md',
      'px-4 py-2 text-base': size === 'lg',
    },
    className
  )

  return (
    <motion.span
      className={badgeClasses}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  )
}

export default Badge