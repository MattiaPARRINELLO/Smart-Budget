'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  charCount?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      charCount = false,
      maxLength,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const currentLength = typeof value === 'string' ? value.length : 0

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
        
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            // Base
            'w-full min-h-[120px] px-4 py-3 text-base rounded-xl border-2 transition-all duration-200',
            'bg-white dark:bg-neutral-900',
            'text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-y',
            'focus:outline-none focus:ring-0',
            // Normal state
            !error && 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 dark:focus:border-primary-400',
            // Error state
            error && 'border-red-400 dark:border-red-500 focus:border-red-500 bg-red-50/50 dark:bg-red-950/30',
            // Disabled
            'disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        
        <div className="flex justify-between mt-2">
          {(error || hint) && (
            <p className={cn(
              'text-sm',
              error ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'
            )}>
              {error || hint}
            </p>
          )}
          
          {charCount && maxLength && (
            <p className={cn(
              'text-sm ml-auto',
              currentLength > maxLength * 0.9 ? 'text-warning-500' : 'text-neutral-400 dark:text-neutral-500',
              currentLength >= maxLength && 'text-red-500'
            )}>
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
