'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Lightbulb,
  X,
} from 'lucide-react'

// ============================================
// ALERT / CALLOUT
// ============================================

type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'tip'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const alertStyles: Record<AlertVariant, { bg: string; border: string; icon: string; text: string }> = {
  info: {
    bg: 'bg-primary-50 dark:bg-primary-950/30',
    border: 'border-primary-200 dark:border-primary-800',
    icon: 'text-primary-500 dark:text-primary-400',
    text: 'text-primary-900 dark:text-primary-100',
  },
  success: {
    bg: 'bg-success-50 dark:bg-success-950/30',
    border: 'border-success-200 dark:border-success-800',
    icon: 'text-success-500 dark:text-success-400',
    text: 'text-success-900 dark:text-success-100',
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-950/30',
    border: 'border-warning-200 dark:border-warning-800',
    icon: 'text-warning-600 dark:text-warning-400',
    text: 'text-warning-900 dark:text-warning-100',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-500 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100',
  },
  tip: {
    bg: 'bg-accent-50 dark:bg-accent-950/30',
    border: 'border-accent-200 dark:border-accent-800',
    icon: 'text-accent-500 dark:text-accent-400',
    text: 'text-accent-900 dark:text-accent-100',
  },
}

const alertIcons: Record<AlertVariant, ReactNode> = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle2 className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  tip: <Lightbulb className="h-5 w-5" />,
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const styles = alertStyles[variant]

  return (
    <div
      className={cn(
        'relative flex gap-3 p-4 rounded-xl border-2',
        styles.bg,
        styles.border,
        className
      )}
      role="alert"
    >
      <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
        {alertIcons[variant]}
      </div>
      
      <div className="flex-1">
        {title && (
          <h4 className={cn('font-semibold mb-1', styles.text)}>{title}</h4>
        )}
        <div className={cn('text-sm', styles.text, 'opacity-90')}>
          {children}
        </div>
      </div>
      
      {dismissible && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors',
            styles.icon
          )}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// BADGE
// ============================================

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'accent'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  children: ReactNode
  className?: string
  dot?: boolean
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
  success: 'bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300',
}

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  )
}

// ============================================
// SKELETON LOADER
// ============================================

interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={cn(
        'bg-neutral-200 dark:bg-neutral-800 animate-pulse',
        roundedClasses[rounded],
        className
      )}
    />
  )
}

// ============================================
// DIVIDER
// ============================================

interface DividerProps {
  className?: string
  label?: string
}

export function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-sm text-neutral-500">{label}</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>
    )
  }

  return <div className={cn('h-px bg-neutral-200', className)} />
}

// ============================================
// AVATAR
// ============================================

interface AvatarProps {
  src?: string | null
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className,
}: AvatarProps) {
  const initials = fallback
    ? fallback
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-primary-100 flex items-center justify-center',
        avatarSizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-primary-700">{initials}</span>
      )}
    </div>
  )
}

// ============================================
// PROGRESS BAR
// ============================================

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  color?: string
  showLabel?: boolean
  className?: string
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  color,
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color || '#0ea5e9',
          }}
        />
      </div>
      {showLabel && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{Math.round(percentage)}%</p>
      )}
    </div>
  )
}
