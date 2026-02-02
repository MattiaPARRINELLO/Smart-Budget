import { prisma } from '@/lib/db'
import { ArticleEditor } from '../components/ArticleEditor'

async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export const metadata = {
  title: 'Nouvel article - CMS',
}

export default async function NewArticlePage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-2 dark:text-white">Nouvel article</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Créez un nouvel article optimisé pour le SEO</p>
      </div>

      <ArticleEditor categories={categories} />
    </div>
  )
}
