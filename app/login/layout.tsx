import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion CMS - Smart Budget',
  description: 'Espace d\'administration Smart Budget',
  robots: 'noindex, nofollow',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
