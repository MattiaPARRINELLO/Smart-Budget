'use client'

import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { 
  Twitter, 
  Instagram, 
  Linkedin, 
  Heart 
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white border-t border-neutral-800">
      {/* Newsletter Section */}
      <div id="newsletter-footer" className="border-b border-neutral-800">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {siteConfig.newsletter.title} 💌
            </h2>
            <p className="text-neutral-400 text-lg mb-8">
              {siteConfig.newsletter.description}
            </p>
            <NewsletterForm variant="dark" />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
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
              <span className="font-display font-bold text-xl">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-neutral-400 text-sm mb-6">
              {siteConfig.description}
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              {siteConfig.social.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-primary-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-accent-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Découvrir */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-500 mb-4">
              Découvrir
            </h3>
            <ul className="space-y-3">
              {siteConfig.footerNav.discover.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Catégories */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-500 mb-4">
              Catégories
            </h3>
            <ul className="space-y-3">
              {siteConfig.footerNav.categories.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-neutral-500 mb-4">
              Légal
            </h3>
            <ul className="space-y-3">
              {siteConfig.footerNav.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {currentYear} {siteConfig.name}. Tous droits réservés.
          </p>
          <p className="text-neutral-500 text-sm flex items-center gap-1">
            Fait avec <Heart className="h-4 w-4 text-red-500" /> pour les jeunes budgets
          </p>
        </div>
      </div>
    </footer>
  )
}
