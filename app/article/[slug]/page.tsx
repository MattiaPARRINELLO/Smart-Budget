import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { siteConfig } from '@/lib/config'
import { formatDate, formatRelativeDate, extractHeadings } from '@/lib/utils'
import { generateArticleSEO, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo'
import { Button, Badge, ArticleCardCompact } from '@/components/ui'
import { NewsletterBanner } from '@/components/newsletter'
import { ArticleContent } from './ArticleContent'
import { TableOfContents } from './TableOfContents'
import { ShareButtons } from './ShareButtons'
import { 
  Clock, 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin,
  Link as LinkIcon,
  ChevronRight
} from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

// Generate static params for all published articles
export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    select: { slug: true },
  })
  return articles.map((article) => ({ slug: article.slug }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug, status: 'published' },
    include: { category: true },
  })

  if (!article) return {}

  const url = `${siteConfig.url}/article/${article.slug}`
  const seo = generateArticleSEO(article, url)

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: seo.openGraph,
    twitter: seo.twitter,
  }
}

async function getArticle(slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug, status: 'published' },
    include: {
      category: true,
      author: { select: { name: true, image: true } },
      tags: true,
    },
  })

  if (!article) return null

  // Increment views
  await prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  })

  return article
}

async function getRelatedArticles(categoryId: string, currentSlug: string) {
  return prisma.article.findMany({
    where: {
      categoryId,
      status: 'published',
      slug: { not: currentSlug },
    },
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: 4,
  })
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.categoryId, article.slug)
  const headings = extractHeadings(article.content)
  const url = `${siteConfig.url}/article/${article.slug}`

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Accueil', url: '/' },
    { name: article.category.name, url: `/categorie/${article.category.slug}` },
    { name: article.title, url: `/article/${article.slug}` },
  ]

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(article, url)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
        }}
      />

      <article>
        {/* Header */}
        <header className="bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 pt-8 pb-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-8">
              <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link 
                href={`/categorie/${article.category.slug}`}
                className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                {article.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">
                {article.title}
              </span>
            </nav>

            <div className="max-w-4xl">
              {/* Category badge */}
              <Link href={`/categorie/${article.category.slug}`}>
                <Badge
                  variant="primary"
                  className="mb-4"
                  style={{ 
                    backgroundColor: article.category.color + '20',
                    color: article.category.color 
                  }}
                >
                  {article.category.name}
                </Badge>
              </Link>

              {/* Title */}
              <h1 className="heading-1 dark:text-white mb-6">{article.title}</h1>

              {/* Excerpt */}
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8">{article.excerpt}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span>{article.author.name || 'Smart Budget'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={article.publishedAt?.toISOString()}>
                    {formatDate(article.publishedAt || article.createdAt)}
                  </time>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readingTime} min de lecture</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.coverImage && (
          <div className="container mx-auto px-4 -mt-4 mb-12">
            <div className="max-w-4xl">
              <div className="relative aspect-[2/1] rounded-3xl overflow-hidden shadow-strong">
                <Image
                  src={article.coverImage}
                  alt={article.coverImageAlt || article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12 max-w-6xl">
            {/* Main Content */}
            <div className="max-w-3xl">
              <ArticleContent content={article.content} />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                  <h3 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 uppercase mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Link key={tag.id} href={`/tag/${tag.slug}`}>
                        <Badge variant="default" size="md">
                          #{tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold text-sm text-neutral-500 dark:text-neutral-400 uppercase mb-4">
                  Partager cet article
                </h3>
                <ShareButtons url={url} title={article.title} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {/* Table of Contents */}
                {headings.length > 0 && (
                  <TableOfContents headings={headings} />
                )}

                {/* Newsletter mini */}
                <div className="p-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl text-white">
                  <h3 className="font-semibold mb-2">💌 Newsletter</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Recevez nos meilleurs conseils chaque semaine
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-neutral-50 dark:bg-neutral-900/50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="heading-3 dark:text-white mb-8">Articles similaires</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedArticles.map((related) => (
                  <ArticleCardCompact
                    key={related.id}
                    slug={related.slug}
                    title={related.title}
                    category={{
                      name: related.category.name,
                      color: related.category.color,
                    }}
                    readingTime={related.readingTime}
                    publishedAt={related.publishedAt || related.createdAt}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="container mx-auto px-4 py-16">
          <NewsletterBanner />
        </section>
      </article>
    </>
  )
}
