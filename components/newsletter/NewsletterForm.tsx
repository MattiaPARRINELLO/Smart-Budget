'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button, Input } from '@/components/ui'
import { Mail, Check, Loader2 } from 'lucide-react'

interface NewsletterFormProps {
  variant?: 'light' | 'dark'
  className?: string
  source?: string
}

export function NewsletterForm({ 
  variant = 'light', 
  className,
  source = 'footer'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Veuillez entrer votre email')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setStatus('success')
      setMessage(data.message || 'Vérifiez votre boîte mail pour confirmer !')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  if (status === 'success') {
    return (
      <div className={cn(
        'flex items-center gap-3 p-4 rounded-2xl',
        variant === 'light' ? 'bg-success-50' : 'bg-success-900/30',
        className
      )}>
        <div className="w-10 h-10 rounded-full bg-success-500 flex items-center justify-center flex-shrink-0">
          <Check className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className={cn(
            'font-semibold',
            variant === 'light' ? 'text-success-700' : 'text-success-300'
          )}>
            Parfait ! 🎉
          </p>
          <p className={cn(
            'text-sm',
            variant === 'light' ? 'text-success-600' : 'text-success-400'
          )}>
            {message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Mail className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5',
            variant === 'light' ? 'text-neutral-400' : 'text-neutral-500'
          )} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            disabled={status === 'loading'}
            className={cn(
              'w-full h-14 pl-12 pr-4 rounded-xl transition-all',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              variant === 'light' 
                ? 'bg-white border-2 border-neutral-200 text-neutral-900' 
                : 'bg-neutral-800 border-2 border-neutral-700 text-white placeholder:text-neutral-500',
              status === 'error' && 'border-red-400'
            )}
          />
        </div>
        
        <Button
          type="submit"
          disabled={status === 'loading'}
          size="lg"
          className="h-14 px-8"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Inscription...
            </>
          ) : (
            <>
              Je m'inscris
            </>
          )}
        </Button>
      </div>
      
      {status === 'error' && message && (
        <p className="mt-2 text-sm text-red-500">{message}</p>
      )}
      
      <p className={cn(
        'mt-3 text-xs',
        variant === 'light' ? 'text-neutral-500' : 'text-neutral-400'
      )}>
        🔒 Pas de spam. Désinscription en 1 clic.
      </p>
    </form>
  )
}
