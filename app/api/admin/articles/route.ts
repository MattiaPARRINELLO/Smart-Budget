import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { slugify, calculateReadingTime } from '@/lib/utils'
import { calculateSEOScore } from '@/lib/seo'

// GET - Liste des articles
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where = status ? { status } : {}

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true, author: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.article.count({ where }),
  ])

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}

// POST - Créer un article
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await request.json()

    // Validation basique
    if (!data.title || !data.content || !data.categoryId) {
      return NextResponse.json(
        { error: 'Titre, contenu et catégorie requis' },
        { status: 400 }
      )
    }

    // Générer le slug si pas fourni
    let slug = data.slug || slugify(data.title)
    
    // Vérifier unicité du slug
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    // Calculer les métriques
    const readingTime = calculateReadingTime(data.content)
    const seoScore = calculateSEOScore(data)

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || '',
        content: data.content,
        focusKeyword: data.focusKeyword || null,
        coverImage: data.coverImage || null,
        coverImageAlt: data.coverImageAlt || null,
        categoryId: data.categoryId,
        authorId: session.user.id,
        status: data.status || 'draft',
        publishedAt: data.status === 'published' ? new Date() : null,
        readingTime,
        seoScore,
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un article
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const data = await request.json()

    if (!data.id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    const existing = await prisma.article.findUnique({
      where: { id: data.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 })
    }

    // Calculer les métriques
    const readingTime = calculateReadingTime(data.content)
    const seoScore = calculateSEOScore(data)

    const article = await prisma.article.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        focusKeyword: data.focusKeyword || null,
        coverImage: data.coverImage || null,
        coverImageAlt: data.coverImageAlt || null,
        categoryId: data.categoryId,
        status: data.status,
        publishedAt: 
          data.status === 'published' && !existing.publishedAt 
            ? new Date() 
            : existing.publishedAt,
        readingTime,
        seoScore,
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un article
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 })
    }

    await prisma.article.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
