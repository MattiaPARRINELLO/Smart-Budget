'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, Check } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const hasError = !!error
    const hasSuccess = !!success && !hasError

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              // Base
              'w-full h-12 px-4 text-base rounded-xl border-2 transition-all duration-200',
              'bg-white dark:bg-neutral-900',
              'text-neutral-900 dark:text-neutral-100',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
              'focus:outline-none focus:ring-0',
              // Normal state
              !hasError && !hasSuccess && 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-400',
              // Error state
              hasError && 'border-red-400 dark:border-red-500 focus:border-red-500 bg-red-50/50 dark:bg-red-950/30',
              // Success state
              hasSuccess && 'border-success-400 dark:border-success-500 focus:border-success-500',
              // Disabled
              'disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed',
              // Icons padding
              leftIcon && 'pl-11',
              (rightIcon || hasError || hasSuccess) && 'pr-11',
              className
            )}
            {...props}
          />
          
          {(rightIcon || hasError || hasSuccess) && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              hasError && 'text-red-500',
              hasSuccess && 'text-success-500',
              !hasError && !hasSuccess && 'text-neutral-400 dark:text-neutral-500'
            )}>
              {hasError ? (
                <AlertCircle className="h-5 w-5" />
              ) : hasSuccess ? (
                <Check className="h-5 w-5" />
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        
        {(error || success || hint) && (
          <p className={cn(
            'mt-2 text-sm',
            hasError && 'text-red-500',
            hasSuccess && 'text-success-600 dark:text-success-400',
            !hasError && !hasSuccess && 'text-neutral-500 dark:text-neutral-400'
          )}>
            {error || success || hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
