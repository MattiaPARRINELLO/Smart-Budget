import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { siteConfig, categoryColors } from "@/lib/config";
import { Button, ArticleCard, CategoryCard } from "@/components/ui";
import { NewsletterBanner } from "@/components/newsletter";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  PiggyBank,
  Wallet,
} from "lucide-react";

// Revalidate toutes les heures
export const revalidate = 3600;

async function getHomeData() {
  const [featuredArticles, recentArticles, categories] = await Promise.all([
    // Articles mis en avant (les 3 plus récents)
    prisma.article.findMany({
      where: { status: "published" },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    // Articles récents (6 suivants)
    prisma.article.findMany({
      where: { status: "published" },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      skip: 3,
      take: 6,
    }),
    // Catégories avec compteur d'articles
    prisma.category.findMany({
      include: {
        _count: { select: { articles: { where: { status: "published" } } } },
      },
      orderBy: { order: "asc" },
    }),
  ]);

  return { featuredArticles, recentArticles, categories };
}

// Icônes pour les catégories
const categoryIconsMap: Record<string, React.ReactNode> = {
  epargne: <PiggyBank className="h-6 w-6" />,
  budget: <Wallet className="h-6 w-6" />,
  investissement: <TrendingUp className="h-6 w-6" />,
  "bons-plans": <Sparkles className="h-6 w-6" />,
};

export default async function HomePage() {
  const { featuredArticles, recentArticles, categories } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 dark:bg-accent-900/30 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 rounded-full shadow-soft mb-8">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary-500">
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
              <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                Le guide budget des 18-30 ans
              </span>
            </div>

            {/* Titre */}
            <h1 className="heading-1 mb-6">
              Gérez votre argent{" "}
              <span className="text-gradient">intelligemment</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 mb-10 max-w-2xl mx-auto">
              Conseils pratiques, bons plans et astuces pour épargner, budgéter
              et investir même avec un petit budget.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Découvrir les articles
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12 mt-12 pt-12 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-center">
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  🎓
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Par des étudiants
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  🚀
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Pour les étudiants
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  💰
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Gratuit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
                À la une
              </span>
              <h2 className="heading-2 mt-2">Articles populaires</h2>
            </div>
            <Link href="/articles" className="hidden md:block">
              <Button
                variant="ghost"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Tous les articles
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
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
                featured={index === 0}
              />
            ))}
          </div>

          <div className="md:hidden mt-8 text-center">
            <Link href="/articles">
              <Button
                variant="outline"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Tous les articles
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-neutral-100 dark:bg-neutral-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
              Explorer
            </span>
            <h2 className="heading-2 mt-2">Nos catégories</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mt-4 max-w-lg mx-auto">
              Trouvez les conseils adaptés à votre situation
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                slug={category.slug}
                name={category.name}
                description={category.description}
                color={category.color}
                icon={categoryIconsMap[category.slug]}
                articleCount={category._count.articles}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-sm font-semibold text-primary-500 uppercase tracking-wider">
                Récent
              </span>
              <h2 className="heading-2 mt-2">Derniers articles</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
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
        </section>
      )}

      {/* Newsletter Banner */}
      <section className="container mx-auto px-4 pb-20">
        <NewsletterBanner />
      </section>

      {/* Why Trust Us */}
      <section className="bg-white dark:bg-neutral-900 py-16 border-t border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-2">Pourquoi nous faire confiance ?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">
                Conseils pratiques
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Des astuces concrètes et applicables immédiatement, pas de
                théorie inutile.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">
                100% indépendant
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Aucun contenu sponsorisé. On recommande uniquement ce qu'on
                utilise.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                <span className="text-3xl">💜</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-neutral-900 dark:text-white">
                Par des jeunes
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                On connaît vos galères budget. On est passés par là aussi !
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
