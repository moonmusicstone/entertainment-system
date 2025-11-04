import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface DropdownItem {
  id: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  className?: string
}

const Dropdown = ({ trigger, items, placement = 'bottom-left', className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const dropdownClasses = clsx(
    'absolute z-50 min-w-48 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg shadow-lg',
    {
      'top-full left-0 mt-2': placement === 'bottom-left',
      'top-full right-0 mt-2': placement === 'bottom-right',
      'bottom-full left-0 mb-2': placement === 'top-left',
      'bottom-full right-0 mb-2': placement === 'top-right',
    }
  )

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={dropdownClasses}
          >
            <div className="py-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick()
                      setIsOpen(false)
                    }
                  }}
                  disabled={item.disabled}
                  className={clsx(
                    'w-full px-4 py-2 text-left text-sm flex items-center space-x-3 transition-colors',
                    {
                      'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700': !item.disabled,
                      'text-gray-400 dark:text-gray-600 cursor-not-allowed': item.disabled,
                    }
                  )}
                >
                  {item.icon && (
                    <span className="w-4 h-4 flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown