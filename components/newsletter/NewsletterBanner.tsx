'use client'

import { cn } from '@/lib/utils'
import { NewsletterForm } from './NewsletterForm'
import { Sparkles } from 'lucide-react'

interface NewsletterBannerProps {
  className?: string
}

export function NewsletterBanner({ className }: NewsletterBannerProps) {
  return (
    <section
      className={cn(
        'relative py-16 px-4 rounded-3xl overflow-hidden',
        'bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600',
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
      </div>

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          Gratuit, 0 spam
        </div>

        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          Des astuces budget<br />
          directement dans ta boîte mail 📬
        </h2>
        
        <p className="text-lg text-white/80 mb-8">
          Rejoins 10 000+ abonnés et reçois nos meilleurs conseils 
          pour économiser et gérer ton argent intelligemment.
        </p>

        <div className="max-w-lg mx-auto">
          <NewsletterForm variant="dark" source="banner" />
        </div>
      </div>
    </section>
  )
}
