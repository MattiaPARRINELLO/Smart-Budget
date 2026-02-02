import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isValidEmail, generateToken } from '@/lib/utils'
import { sendConfirmationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    // Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existing) {
      if (existing.status === 'confirmed') {
        return NextResponse.json(
          { error: 'Cet email est déjà inscrit à la newsletter' },
          { status: 400 }
        )
      }
      
      if (existing.status === 'pending') {
        // Renvoyer l'email de confirmation
        const token = generateToken()
        await prisma.subscriber.update({
          where: { id: existing.id },
          data: { confirmToken: token },
        })
        
        await sendConfirmationEmail(email, token)
        
        return NextResponse.json({
          message: 'Un email de confirmation a été renvoyé',
        })
      }
      
      // Unsubscribed - réinscrire
      const token = generateToken()
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: { 
          status: 'pending',
          confirmToken: token,
          source,
        },
      })
      
      await sendConfirmationEmail(email, token)
      
      return NextResponse.json({
        message: 'Vérifiez votre boîte mail pour confirmer votre inscription !',
      })
    }

    // Créer nouveau subscriber
    const token = generateToken()
    
    await prisma.subscriber.create({
      data: {
        email: email.toLowerCase(),
        confirmToken: token,
        source,
        status: 'pending',
      },
    })

    // Envoyer email de confirmation
    await sendConfirmationEmail(email, token)

    return NextResponse.json({
      message: 'Vérifiez votre boîte mail pour confirmer votre inscription !',
    })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Réessayez plus tard.' },
      { status: 500 }
    )
  }
}
