import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { siteConfig } from '@/lib/config'
import { ArticleCard } from '@/components/ui'
import { NewsletterBanner } from '@/components/newsletter'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: { slug: string }
  searchParams: { page?: string }
}

// Generate static params
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  })
  return categories.map((cat) => ({ slug: cat.slug }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) return {}

  const title = `${category.name} - Conseils et astuces`
  const description = category.description || `Tous nos articles sur ${category.name.toLowerCase()}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

const ARTICLES_PER_PAGE = 12

async function getCategoryData(slug: string, page: number) {
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) return null

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where: { 
        categoryId: category.id,
        status: 'published',
      },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * ARTICLES_PER_PAGE,
      take: ARTICLES_PER_PAGE,
    }),
    prisma.article.count({
      where: { 
        categoryId: category.id,
        status: 'published',
      },
    }),
  ])

  return {
    category,
    articles,
    totalCount,
    totalPages: Math.ceil(totalCount / ARTICLES_PER_PAGE),
    currentPage: page,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const data = await getCategoryData(slug, page)

  if (!data) {
    notFound()
  }

  const { category, articles, totalCount, totalPages, currentPage } = data

  return (
    <>
      {/* Header */}
      <header 
        className="py-16"
        style={{ 
          background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)` 
        }}
      >
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
              Catégories
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-neutral-700 dark:text-neutral-300">{category.name}</span>
          </nav>

          {/* Title */}
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl"
            style={{ backgroundColor: category.color }}
          >
            💰
          </div>
          
          <h1 className="heading-1 dark:text-white mb-4">{category.name}</h1>
          
          {category.description && (
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl">
              {category.description}
            </p>
          )}

          <p className="mt-6 text-neutral-500 dark:text-neutral-400">
            {totalCount} article{totalCount > 1 ? 's' : ''} dans cette catégorie
          </p>
        </div>
      </header>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 py-16">
        {articles.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  coverImage={article.coverImage}
                  category={{
                    name: article.category.name,
                    slug: article.category.slug,
                    color: article.category.color,
                  }}
                  readingTime={article.readingTime}
                  publishedAt={article.publishedAt || article.createdAt}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/categorie/${params.slug}?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-neutral-200 transition-colors"
                  >
                    Précédent
                  </Link>
                )}
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/categorie/${params.slug}?page=${pageNum}`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      pageNum === currentPage
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-neutral-200'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}

                {currentPage < totalPages && (
                  <Link
                    href={`/categorie/${params.slug}?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 dark:text-neutral-200 transition-colors"
                  >
                    Suivant
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-500 dark:text-neutral-400 mb-4">
              Aucun article dans cette catégorie pour le moment
            </p>
            <Link 
              href="/"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Retour à l'accueil
            </Link>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 pb-16">
        <NewsletterBanner />
      </section>
    </>
  )
}
