import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/newsletter/erreur?reason=token_missing', request.url))
    }

    // Trouver le subscriber avec ce token
    const subscriber = await prisma.subscriber.findUnique({
      where: { confirmToken: token },
    })

    if (!subscriber) {
      return NextResponse.redirect(new URL('/newsletter/erreur?reason=token_invalid', request.url))
    }

    if (subscriber.status === 'confirmed') {
      return NextResponse.redirect(new URL('/newsletter/deja-confirme', request.url))
    }

    // Confirmer l'inscription
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: 'confirmed',
        confirmedAt: new Date(),
        confirmToken: null, // Supprimer le token
      },
    })

    return NextResponse.redirect(new URL('/newsletter/confirme', request.url))
  } catch (error) {
    console.error('Newsletter confirm error:', error)
    return NextResponse.redirect(new URL('/newsletter/erreur?reason=server_error', request.url))
  }
}
