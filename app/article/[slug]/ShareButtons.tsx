'use client'

import { Button } from '@/components/ui'
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-colors"
        aria-label="Partager sur Twitter"
      >
        <Twitter className="h-5 w-5" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 flex items-center justify-center hover:bg-[#4267B2] hover:text-white transition-colors"
        aria-label="Partager sur Facebook"
      >
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors"
        aria-label="Partager sur LinkedIn"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <button
        onClick={handleCopyLink}
        className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
        aria-label="Copier le lien"
      >
        <LinkIcon className="h-5 w-5" />
      </button>
    </div>
  )
}
