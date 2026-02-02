import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ArticleEditor } from '../components/ArticleEditor'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { id: string }
}

export default async function EditArticlePage({ params }: Props) {
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({
      where: { id: params.id },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
    }),
  ])

  if (!article) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/admin/articles" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux articles
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier l'article
        </h1>
        <p className="text-gray-500 mt-1">
          Modifiez le contenu et les paramètres SEO de cet article
        </p>
      </div>

      <ArticleEditor 
        categories={categories}
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || '',
          content: article.content,
          focusKeyword: article.keyword || '',
          categoryId: article.categoryId || '',
          coverImage: article.coverImage || '',
          coverImageAlt: '',
          status: article.published ? 'published' : 'draft',
        }}
      />
    </div>
  )
}
