import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const Card = ({ 
  children, 
  className, 
  hover = false, 
  padding = 'md',
  onClick 
}: CardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  }

  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      className={clsx(
        'bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 shadow-sm',
        hover && 'cursor-pointer hover:shadow-md',
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export default Card