// Utilitaires SEO pour Smart Budget
import { siteConfig } from './config'
import type { Article, Category } from '@prisma/client'

// Interface pour les métadonnées
interface SEOMetadata {
  title: string
  description: string
  canonical?: string
  openGraph?: {
    title: string
    description: string
    type: string
    url: string
    images?: { url: string; alt: string; width: number; height: number }[]
    article?: {
      publishedTime: string
      modifiedTime: string
      authors: string[]
      tags: string[]
      section: string
    }
  }
  twitter?: {
    card: string
    title: string
    description: string
    images?: string[]
  }
}

// Générer les métadonnées pour un article
export function generateArticleSEO(
  article: Article & { category: Category },
  absoluteUrl: string
): SEOMetadata {
  const title = article.metaTitle || article.title
  const description = article.metaDescription || article.excerpt
  const imageUrl = article.coverImage 
    ? `${siteConfig.url}${article.coverImage}` 
    : `${siteConfig.url}${siteConfig.defaultOgImage}`

  return {
    title,
    description,
    canonical: absoluteUrl,
    openGraph: {
      title,
      description,
      type: 'article',
      url: absoluteUrl,
      images: [
        {
          url: imageUrl,
          alt: article.coverImageAlt || article.title,
          width: 1200,
          height: 630,
        },
      ],
      article: {
        publishedTime: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
        modifiedTime: article.updatedAt.toISOString(),
        authors: [siteConfig.url],
        tags: [article.focusKeyword || ''],
        section: article.category.name,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

// Générer le schema.org Article
export function generateArticleSchema(
  article: Article & { category: Category; author: { name: string | null } },
  absoluteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage 
      ? `${siteConfig.url}${article.coverImage}` 
      : `${siteConfig.url}${siteConfig.defaultOgImage}`,
    author: {
      '@type': 'Person',
      name: article.author.name || 'Smart Budget',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.logo}`,
      },
    },
    datePublished: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl,
    },
    articleSection: article.category.name,
    keywords: article.focusKeyword,
    wordCount: article.content.split(/\s+/).length,
    timeRequired: `PT${article.readingTime}M`,
  }
}

// Générer le schema.org Organization
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    sameAs: Object.values(siteConfig.social),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
  }
}

// Générer le schema.org BreadcrumbList
export function generateBreadcrumbSchema(
  breadcrumbs: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}

// Générer le schema.org FAQ (pour les articles avec des questions)
export function generateFAQSchema(
  questions: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }
}

// Checklist SEO pour l'éditeur
export interface SEOCheckItem {
  id: string
  label: string
  description: string
  check: (article: Partial<Article>) => boolean
  weight: number
}

export const seoChecklist: SEOCheckItem[] = [
  {
    id: 'title-length',
    label: 'Titre optimisé',
    description: 'Le titre doit faire entre 50 et 60 caractères',
    check: (a) => (a.title?.length || 0) >= 50 && (a.title?.length || 0) <= 60,
    weight: 15,
  },
  {
    id: 'title-keyword',
    label: 'Mot-clé dans le titre',
    description: 'Le mot-clé principal doit apparaître dans le titre',
    check: (a) => {
      if (!a.title || !a.focusKeyword) return false
      return a.title.toLowerCase().includes(a.focusKeyword.toLowerCase())
    },
    weight: 15,
  },
  {
    id: 'excerpt-length',
    label: 'Meta description optimisée',
    description: 'Le résumé doit faire entre 150 et 160 caractères',
    check: (a) => (a.excerpt?.length || 0) >= 150 && (a.excerpt?.length || 0) <= 160,
    weight: 10,
  },
  {
    id: 'excerpt-keyword',
    label: 'Mot-clé dans la description',
    description: 'Le mot-clé doit apparaître dans le résumé',
    check: (a) => {
      if (!a.excerpt || !a.focusKeyword) return false
      return a.excerpt.toLowerCase().includes(a.focusKeyword.toLowerCase())
    },
    weight: 10,
  },
  {
    id: 'content-length',
    label: 'Contenu suffisant',
    description: 'Le contenu doit faire au moins 800 mots',
    check: (a) => (a.content?.split(/\s+/).length || 0) >= 800,
    weight: 10,
  },
  {
    id: 'content-keyword-density',
    label: 'Densité du mot-clé',
    description: 'Le mot-clé doit apparaître 3-5 fois dans le contenu',
    check: (a) => {
      if (!a.content || !a.focusKeyword) return false
      const regex = new RegExp(a.focusKeyword, 'gi')
      const matches = a.content.match(regex)
      return (matches?.length || 0) >= 3 && (matches?.length || 0) <= 10
    },
    weight: 10,
  },
  {
    id: 'has-headings',
    label: 'Sous-titres H2/H3',
    description: "L'article doit contenir des sous-titres",
    check: (a) => /^#{2,3}\s/m.test(a.content || ''),
    weight: 10,
  },
  {
    id: 'has-image',
    label: 'Image de couverture',
    description: 'Une image de couverture est définie',
    check: (a) => !!a.coverImage,
    weight: 10,
  },
  {
    id: 'image-alt',
    label: 'Alt text image',
    description: "L'image a un texte alternatif",
    check: (a) => !!a.coverImageAlt,
    weight: 5,
  },
  {
    id: 'internal-links',
    label: 'Liens internes',
    description: 'Le contenu contient des liens internes',
    check: (a) => /\[.+?\]\(\/.+?\)/.test(a.content || ''),
    weight: 5,
  },
]

// Calculer le score SEO
export function calculateSEOScore(article: Partial<Article>): number {
  let score = 0
  let totalWeight = 0

  for (const item of seoChecklist) {
    totalWeight += item.weight
    if (item.check(article)) {
      score += item.weight
    }
  }

  return Math.round((score / totalWeight) * 100)
}

// Obtenir les items SEO passés/échoués
export function getSEOCheckResults(article: Partial<Article>): {
  passed: SEOCheckItem[]
  failed: SEOCheckItem[]
} {
  const passed: SEOCheckItem[] = []
  const failed: SEOCheckItem[] = []

  for (const item of seoChecklist) {
    if (item.check(article)) {
      passed.push(item)
    } else {
      failed.push(item)
    }
  }

  return { passed, failed }
}
