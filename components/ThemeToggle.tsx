'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-5 w-5" />
    }
    return resolvedTheme === 'dark' 
      ? <Moon className="h-5 w-5" /> 
      : <Sun className="h-5 w-5" />
  }

  const getLabel = () => {
    if (theme === 'system') return 'Auto'
    return theme === 'dark' ? 'Sombre' : 'Clair'
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-xl transition-all duration-200',
        'text-neutral-600 dark:text-neutral-400',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        'hover:text-neutral-900 dark:hover:text-neutral-100',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
        className
      )}
      aria-label={`Thème actuel: ${getLabel()}. Cliquez pour changer.`}
      title={`Thème: ${getLabel()}`}
    >
      <div className="flex items-center gap-2">
        {getIcon()}
        {showLabel && (
          <span className="text-sm font-medium">{getLabel()}</span>
        )}
      </div>
    </button>
  )
}
