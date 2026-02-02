import { prisma } from '@/lib/db'
import { StatCard } from '@/components/ui'
import { 
  FileText, 
  Eye, 
  Mail, 
  TrendingUp,
  Users,
  PenLine
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { formatRelativeDate } from '@/lib/utils'

async function getDashboardStats() {
  const [
    articlesCount,
    publishedCount,
    draftCount,
    subscribersCount,
    confirmedSubscribers,
    totalViews,
    recentArticles,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.count({ where: { status: 'draft' } }),
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: 'confirmed' } }),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.article.findMany({
      include: { category: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
  ])

  return {
    articlesCount,
    publishedCount,
    draftCount,
    subscribersCount,
    confirmedSubscribers,
    totalViews: totalViews._sum.views || 0,
    recentArticles,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Bienvenue sur votre espace d'administration</p>
        </div>
        <Link href="/admin/articles/new">
          <Button leftIcon={<PenLine className="h-4 w-4" />}>
            Nouvel article
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Articles publiés"
          value={stats.publishedCount}
          icon={<FileText className="h-6 w-6" />}
          color="#0ea5e9"
        />
        <StatCard
          label="Brouillons"
          value={stats.draftCount}
          icon={<PenLine className="h-6 w-6" />}
          color="#f59e0b"
        />
        <StatCard
          label="Vues totales"
          value={stats.totalViews}
          icon={<Eye className="h-6 w-6" />}
          color="#8b5cf6"
        />
        <StatCard
          label="Abonnés newsletter"
          value={stats.confirmedSubscribers}
          icon={<Mail className="h-6 w-6" />}
          color="#10b981"
        />
      </div>

      {/* Recent Articles */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg text-neutral-900 dark:text-white">Articles récents</h2>
          <Link href="/admin/articles" className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
            Voir tout →
          </Link>
        </div>

        <div className="space-y-4">
          {stats.recentArticles.map((article) => (
            <Link
              key={article.id}
              href={`/admin/articles/${article.id}`}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <div
                className="w-2 h-12 rounded-full"
                style={{ backgroundColor: article.category.color }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                  {article.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  <span>{article.category.name}</span>
                  <span>•</span>
                  <span>{formatRelativeDate(article.updatedAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  article.status === 'published' 
                    ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                    : 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                }`}>
                  {article.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
                <span className="text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views}
                </span>
              </div>
            </Link>
          ))}

          {stats.recentArticles.length === 0 && (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              Aucun article pour le moment.{' '}
              <Link href="/admin/articles/new" className="text-primary-600 dark:text-primary-400 hover:underline">
                Créer le premier
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
