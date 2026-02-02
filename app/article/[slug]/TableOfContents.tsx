'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'

interface Heading {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    // Observer tous les headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  // Filtrer pour ne garder que H2 et H3
  const filteredHeadings = headings.filter((h) => h.level === 2 || h.level === 3)

  if (filteredHeadings.length === 0) return null

  return (
    <nav className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl">
      <h3 className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white mb-4">
        <List className="h-4 w-4" />
        Sommaire
      </h3>
      
      <ul className="space-y-2">
        {filteredHeadings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={cn(
                'text-left w-full text-sm transition-colors duration-200',
                heading.level === 3 && 'pl-4',
                activeId === heading.id
                  ? 'text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
