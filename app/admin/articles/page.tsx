import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button, Badge } from '@/components/ui'
import { formatRelativeDate } from '@/lib/utils'
import { 
  Plus, 
  Eye, 
  Pencil, 
  Trash2, 
  MoreHorizontal,
  Search,
  Filter 
} from 'lucide-react'

export const metadata = {
  title: 'Articles - CMS',
}

async function getArticles() {
  return prisma.article.findMany({
    include: { 
      category: true, 
      author: { select: { name: true } } 
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2 dark:text-white">Articles</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {articles.length} article{articles.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Nouvel article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="search"
            placeholder="Rechercher un article..."
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-0 bg-white dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          />
        </div>
        
        <select className="h-12 px-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 bg-white dark:bg-neutral-900 dark:text-neutral-100">
          <option value="">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
        </select>
      </div>

      {/* Articles List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 dark:border-neutral-800">
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Article
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Catégorie
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Statut
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                SEO
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Vues
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Modifié
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr 
                key={article.id} 
                className="border-b border-neutral-50 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link 
                    href={`/admin/articles/${article.id}`}
                    className="font-medium text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {article.title}
                  </Link>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-md">
                    {article.excerpt}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    size="sm"
                    style={{ 
                      backgroundColor: article.category.color + '20',
                      color: article.category.color 
                    }}
                  >
                    {article.category.name}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge 
                    variant={article.status === 'published' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {article.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                        article.seoScore >= 70 
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                          : article.seoScore >= 50 
                            ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}
                    >
                      {article.seoScore}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-600 dark:text-neutral-300">
                  {article.views}
                </td>
                <td className="px-6 py-4 text-neutral-500 dark:text-neutral-400 text-sm">
                  {formatRelativeDate(article.updatedAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/article/${article.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link 
                      href={`/admin/articles/${article.id}`}
                      className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {articles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                  Aucun article pour le moment.{' '}
                  <Link href="/admin/articles/new" className="text-primary-600 dark:text-primary-400 hover:underline">
                    Créer le premier
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
