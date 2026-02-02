import Link from 'next/link'
import { Button } from '@/components/ui'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Inscription confirmée',
  description: 'Votre inscription à la newsletter est confirmée',
}

export default function NewsletterConfirmePage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-success-500" />
        </div>
        
        <h1 className="heading-2 mb-4">C'est confirmé ! 🎉</h1>
        
        <p className="text-lg text-neutral-600 mb-8">
          Bienvenue dans la communauté Smart Budget ! 
          Vous recevrez très bientôt nos meilleurs conseils pour gérer votre argent.
        </p>
        
        <Link href="/">
          <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
            Découvrir les articles
          </Button>
        </Link>
      </div>
    </div>
  )
}
