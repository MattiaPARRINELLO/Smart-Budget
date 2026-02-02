'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/config'
import { Button } from '@/components/ui'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Détecter le scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer le menu mobile sur changement de page
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md shadow-soft'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path
                    d="M12 3L2 8L12 13L22 8L12 3Z"
                    fill="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 10.5V15C6 16.66 8.69 18 12 18C15.31 18 18 16.66 18 15V10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <circle cx="18" cy="18" r="4.5" fill="#fbbf24" stroke="currentColor" strokeWidth="1"/>
                  <text
                    x="18"
                    y="21"
                    textAnchor="middle"
                    fill="white"
                    fontSize="5"
                    fontWeight="bold"
                  >
                    $
                  </text>
                </svg>
              </div>
              <span className="font-display font-bold text-xl text-neutral-900 dark:text-white hidden sm:block group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {siteConfig.name}
              </span>
            </Link>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center gap-1">
              {siteConfig.mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Recherche */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* CTA Newsletter */}
              <Button
                size="sm"
                className="hidden sm:flex"
                onClick={() => document.getElementById('newsletter-footer')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Newsletter 📬
              </Button>

              {/* Menu mobile toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors md:hidden"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 shadow-strong">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col gap-1">
                  {siteConfig.mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                        pathname === item.href
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal recherche */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-2xl mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-strong border border-neutral-200 dark:border-neutral-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <form action="/recherche" method="GET" className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="search"
                  name="q"
                  placeholder="Rechercher un article..."
                  autoFocus
                  className="w-full h-14 pl-14 pr-4 text-lg bg-transparent outline-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                />
              </form>
              <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
                <kbd className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">Échap</kbd> pour fermer
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer pour le header fixed */}
      <div className="h-16 md:h-20" />
    </>
  )
}
