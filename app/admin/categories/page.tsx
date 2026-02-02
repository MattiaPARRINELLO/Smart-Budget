import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Catégories</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {categories.length} catégorie{categories.length > 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Nouvelle catégorie
          </Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800">
          <FolderOpen className="w-12 h-12 mx-auto text-gray-400 dark:text-neutral-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucune catégorie
          </h3>
          <p className="text-gray-500 dark:text-neutral-400 mb-6">
            Créez votre première catégorie pour organiser vos articles.
          </p>
          <Link href="/admin/categories/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Créer une catégorie
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 bg-gray-50 dark:bg-neutral-800/50 border-b border-gray-200 dark:border-neutral-800 font-medium text-gray-500 dark:text-neutral-400 text-sm">
            <div>Couleur</div>
            <div>Nom</div>
            <div>Slug</div>
            <div className="text-center">Articles</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-neutral-800">
            {categories.map((category) => (
              <div
                key={category.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
              >
                <div>
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>

                <div>
                  <code className="text-sm bg-gray-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded">
                    /{category.slug}
                  </code>
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded-full text-sm font-medium text-gray-700 dark:text-neutral-300">
                    {category._count.articles}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/categories/${category.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <form action={`/api/admin/categories/${category.id}`} method="DELETE">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30"
                      disabled={category._count.articles > 0}
                      title={category._count.articles > 0 ? 'Supprimez d\'abord les articles de cette catégorie' : 'Supprimer'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-950/50 dark:to-accent-950/50 rounded-2xl border border-primary-100 dark:border-primary-900/50">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          💡 Conseil SEO
        </h3>
        <p className="text-gray-600 dark:text-neutral-300 text-sm">
          Créez des catégories claires et ciblées pour améliorer la structure de votre site. 
          Les URLs de catégories comme <code className="bg-white/50 dark:bg-neutral-800/50 dark:text-neutral-300 px-1 rounded">/categorie/epargne</code> 
          aident Google à comprendre l'organisation de votre contenu.
        </p>
      </div>
    </div>
  )
}
