'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/config'
import { NewsletterForm } from './NewsletterForm'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Vérifier si déjà fermé récemment
    const dismissed = localStorage.getItem('newsletter-popup-dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const now = new Date()
      // Ne pas réafficher pendant 7 jours
      if (now.getTime() - dismissedDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return
      }
    }

    // Vérifier si déjà inscrit
    const subscribed = localStorage.getItem('newsletter-subscribed')
    if (subscribed) return

    // Afficher après le délai configuré
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, siteConfig.newsletter.popupDelay)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter-popup-dismissed', new Date().toISOString())
  }

  const handleSuccess = () => {
    localStorage.setItem('newsletter-subscribed', 'true')
    setTimeout(() => setIsOpen(false), 3000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-strong border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors z-10"
              aria-label="Fermer"
            >
              <X className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            </button>

            {/* Header gradient */}
            <div className="h-32 bg-gradient-to-br from-primary-500 via-accent-500 to-primary-600 flex items-center justify-center">
              <span className="text-6xl">✉️</span>
            </div>

            {/* Content */}
            <div className="p-8 pt-6">
              <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-white mb-2 text-center">
                Rejoignez 10 000+ lecteurs ! 🚀
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-center mb-6">
                Recevez nos meilleurs conseils budget chaque semaine. 
                Gratuit, sans spam, et désabonnement en 1 clic.
              </p>
              
              <NewsletterForm source="popup" />
              
              <button
                onClick={handleDismiss}
                className="w-full mt-4 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
              >
                Non merci, je préfère payer plein pot 😅
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
