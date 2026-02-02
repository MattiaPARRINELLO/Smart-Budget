import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calculateReadingTime, slugify } from '@/lib/utils'
import { calculateSEOScore } from '@/lib/seo'

// GET /api/admin/articles/[id] - Récupérer un article
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        tags: true,
      },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/articles/[id] - Mettre à jour un article
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      slug: providedSlug,
      content,
      excerpt,
      coverImage,
      focusKeyword,
      status,
      categoryId,
      readingTime: providedReadingTime,
      seoScore: providedSeoScore,
    } = body

    // Vérifier que l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id },
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Générer le slug si non fourni
    const slug = providedSlug || slugify(title)

    // Vérifier l'unicité du slug (si différent de l'actuel)
    if (slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ce slug est déjà utilisé' },
          { status: 400 }
        )
      }
    }

    // Calculer le temps de lecture si non fourni
    const readingTime = providedReadingTime || calculateReadingTime(content)

    // Calculer le score SEO si non fourni
    const seoScore = providedSeoScore || calculateSEOScore({
      title,
      excerpt: excerpt || '',
      content,
      focusKeyword: focusKeyword || '',
      coverImage: coverImage || '',
    })

    const isPublished = status === 'published'

    // Mettre à jour l'article
    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        keyword: focusKeyword,
        published: isPublished,
        categoryId: categoryId || null,
        readingTime,
        seoScore,
        publishedAt: isPublished && !existingArticle.publishedAt 
          ? new Date() 
          : existingArticle.publishedAt,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/articles/[id] - Supprimer un article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Vérifier que l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id },
    })

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    await prisma.article.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
