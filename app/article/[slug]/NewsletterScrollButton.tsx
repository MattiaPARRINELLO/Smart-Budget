'use client'

import { Button } from '@/components/ui'

export function NewsletterScrollButton() {
  const handleClick = () => {
    document.getElementById('newsletter-footer')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="w-full"
      onClick={handleClick}
    >
      S'inscrire gratuitement
    </Button>
  )
}
