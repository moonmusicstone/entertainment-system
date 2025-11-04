import { forwardRef, InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  variant?: 'default' | 'filled'
  size?: 'sm' | 'md' | 'lg'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, variant = 'default', size = 'md', className, ...props }, ref) => {
    const inputClasses = clsx(
      'w-full border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent',
      {
        // Variants
        'bg-white dark:bg-dark-800 border-gray-300 dark:border-dark-600': variant === 'default',
        'bg-gray-50 dark:bg-dark-700 border-transparent': variant === 'filled',
        
        // Sizes
        'px-3 py-2 text-sm': size === 'sm',
        'px-4 py-3 text-base': size === 'md',
        'px-5 py-4 text-lg': size === 'lg',
        
        // Icon padding
        'pl-10': icon && size === 'sm',
        'pl-12': icon && size === 'md',
        'pl-14': icon && size === 'lg',
        
        // Error state
        'border-red-500 focus:ring-red-500': error,
      },
      'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400',
      className
    )

    const iconClasses = clsx(
      'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
      {
        'w-4 h-4': size === 'sm',
        'w-5 h-5': size === 'md',
        'w-6 h-6': size === 'lg',
      }
    )

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={iconClasses}>
              {icon}
            </div>
          )}
          <motion.input
            ref={ref}
            className={inputClasses}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input