import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Fusion de classes Tailwind intelligente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formater une date en français
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  })
}

// Formater une date relative (il y a X jours)
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`
  return `Il y a ${Math.floor(diffDays / 365)} ans`
}

// Slugifier un texte
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/[^a-z0-9 -]/g, '') // Enlever les caractères spéciaux
    .replace(/\s+/g, '-') // Espaces en tirets
    .replace(/-+/g, '-') // Multiples tirets en un seul
    .replace(/^-+/, '') // Enlever tiret au début
    .replace(/-+$/, '') // Enlever tiret à la fin
}

// Calculer le temps de lecture
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Tronquer un texte
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

// Extraire les headings d'un contenu Markdown pour le sommaire
export function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
      id: slugify(match[2]),
    })
  }

  return headings
}

// Générer un excerpt depuis le contenu Markdown
export function generateExcerpt(content: string, length: number = 160): string {
  // Enlever les headers Markdown
  let text = content.replace(/^#+\s+.+$/gm, '')
  // Enlever les images
  text = text.replace(/!\[.*?\]\(.*?\)/g, '')
  // Enlever les liens mais garder le texte
  text = text.replace(/\[(.+?)\]\(.*?\)/g, '$1')
  // Enlever le formatting Markdown
  text = text.replace(/[*_~`]/g, '')
  // Enlever les blocs de code
  text = text.replace(/```[\s\S]*?```/g, '')
  // Enlever les sauts de ligne multiples
  text = text.replace(/\n+/g, ' ')
  // Trim et tronquer
  return truncate(text.trim(), length)
}

// Valider un email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Générer un token aléatoire
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Formater un nombre (1000 -> 1k)
export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
