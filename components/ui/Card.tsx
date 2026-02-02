'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ChevronRight } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'

// ============================================
// CARD DE BASE
// ============================================

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ 
  children, 
  className, 
  hover = false,
  padding = 'md' 
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-neutral-900 rounded-2xl',
        'border border-neutral-100 dark:border-neutral-800',
        'shadow-soft',
        hover && 'transition-all duration-300 hover:shadow-medium hover:-translate-y-1',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-6',
        padding === 'lg' && 'p-8',
        className
      )}
    >
      {children}
    </div>
  )
}

// ============================================
// ARTICLE CARD - GRANDE
// ============================================

interface ArticleCardProps {
  slug: string
  title: string
  excerpt: string
  coverImage?: string | null
  category: {
    name: string
    slug: string
    color: string
  }
  readingTime: number
  publishedAt: Date | string
  featured?: boolean
}

export function ArticleCard({
  slug,
  title,
  excerpt,
  coverImage,
  category,
  readingTime,
  publishedAt,
  featured = false,
}: ArticleCardProps) {
  return (
    <Link href={`/article/${slug}`}>
      <article
        className={cn(
          'group bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden',
          'border border-neutral-100 dark:border-neutral-800',
          'shadow-soft transition-all duration-300',
          'hover:shadow-medium hover:-translate-y-1'
        )}
      >
        {/* Contenu */}
        <div className="p-6">
          {/* Badge catégorie */}
          <div className="mb-4">
            <span
              className="px-3 py-1 text-sm font-semibold text-white rounded-full shadow-sm"
              style={{ backgroundColor: category.color }}
            >
              {category.name}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readingTime} min
            </span>
            <span>{formatRelativeDate(publishedAt)}</span>
          </div>
          
          {/* Titre */}
          <h3 className={cn(
            'font-display font-bold text-neutral-900 dark:text-white mb-2',
            'group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors',
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          )}>
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4">
            {excerpt}
          </p>
          
          {/* CTA */}
          <span className="inline-flex items-center gap-1 text-primary-500 font-semibold group-hover:gap-2 transition-all">
            Lire l'article
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  )
}

// ============================================
// ARTICLE CARD - COMPACTE
// ============================================

interface ArticleCardCompactProps {
  slug: string
  title: string
  category: {
    name: string
    color: string
  }
  readingTime: number
  publishedAt: Date | string
}

export function ArticleCardCompact({
  slug,
  title,
  category,
  readingTime,
  publishedAt,
}: ArticleCardCompactProps) {
  return (
    <Link href={`/article/${slug}`}>
      <article className="group flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
        {/* Indicateur couleur */}
        <div
          className="w-1 h-12 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{category.name}</span>
            <span>•</span>
            <span>{readingTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

// ============================================
// CATEGORY CARD
// ============================================

interface CategoryCardProps {
  slug: string
  name: string
  description?: string | null
  color: string
  icon?: ReactNode
  articleCount?: number
}

export function CategoryCard({
  slug,
  name,
  description,
  color,
  icon,
  articleCount,
}: CategoryCardProps) {
  return (
    <Link href={`/categorie/${slug}`}>
      <div
        className={cn(
          'group relative p-6 rounded-2xl overflow-hidden',
          'transition-all duration-300 hover:scale-105 hover:shadow-strong'
        )}
        style={{ backgroundColor: color + '15' }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`,
          }}
        />
        
        {/* Icône */}
        <div
          className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
          style={{ backgroundColor: color }}
        >
          {icon || <span className="text-xl">📁</span>}
        </div>
        
        {/* Contenu */}
        <h3 className="relative font-display font-bold text-xl text-neutral-900 dark:text-white mb-2">
          {name}
        </h3>
        
        {description && (
          <p className="relative text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mb-3">
            {description}
          </p>
        )}
        
        {articleCount !== undefined && (
          <p className="relative text-sm font-medium" style={{ color }}>
            {articleCount} article{articleCount > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Link>
  )
}

// ============================================
// STAT CARD
// ============================================

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    positive: boolean
  }
  color?: string
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = '#0ea5e9',
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-soft">
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        
        {trend && (
          <span
            className={cn(
              'text-sm font-semibold px-2 py-1 rounded-full',
              trend.positive
                ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            )}
          >
            {trend.positive ? '+' : ''}{trend.value}%
          </span>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{label}</p>
      </div>
    </div>
  )
}
