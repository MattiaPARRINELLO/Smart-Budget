import Link from 'next/link'
import { Button } from '@/components/ui'
import { AlertCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Erreur newsletter',
  description: 'Une erreur est survenue',
}

export default function NewsletterErreurPage({
  searchParams,
}: {
  searchParams: { reason?: string }
}) {
  const messages: Record<string, string> = {
    token_missing: "Le lien de confirmation est incomplet.",
    token_invalid: "Le lien de confirmation n'est plus valide ou a déjà été utilisé.",
    server_error: "Une erreur technique est survenue. Veuillez réessayer.",
  }

  const message = messages[searchParams.reason || ''] || messages.server_error

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        
        <h1 className="heading-2 mb-4">Oups ! 😕</h1>
        
        <p className="text-lg text-neutral-600 mb-8">
          {message}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" size="lg">
              Retour à l'accueil
            </Button>
          </Link>
          <Link href="/#newsletter-footer">
            <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Réessayer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
