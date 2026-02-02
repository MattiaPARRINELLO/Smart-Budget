// Configuration du site - Smart Budget
// Modifier ces valeurs pour personnaliser le site

export const siteConfig = {
  // Informations générales
  name: 'Smart Budget',
  description: 'Conseils budget et finances pour étudiants et jeunes actifs',
  tagline: 'Gérez votre argent intelligemment 💰',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://smartbudget.fr',
  
  // SEO
  defaultOgImage: '/og-image.jpg',
  twitterHandle: '@smartbudget_fr',
  locale: 'fr_FR',
  
  // Branding
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  
  // Navigation principale
  mainNav: [
    { label: 'Accueil', href: '/' },
    { label: 'Épargne', href: '/categorie/epargne' },
    { label: 'Budget', href: '/categorie/budget' },
    { label: 'Investissement', href: '/categorie/investissement' },
    { label: 'Bons Plans', href: '/categorie/bons-plans' },
  ],
  
  // Footer
  footerNav: {
    discover: [
      { label: 'Articles récents', href: '/articles' },
      { label: 'Catégories', href: '/categories' },
      { label: 'À propos', href: '/a-propos' },
    ],
    categories: [
      { label: 'Épargne', href: '/categorie/epargne' },
      { label: 'Budget', href: '/categorie/budget' },
      { label: 'Investissement', href: '/categorie/investissement' },
      { label: 'Bons Plans', href: '/categorie/bons-plans' },
      { label: 'Banques', href: '/categorie/banques' },
      { label: 'Vie Étudiante', href: '/categorie/vie-etudiante' },
    ],
    legal: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
      { label: 'CGU', href: '/cgu' },
    ],
  },
  
  // Réseaux sociaux
  social: {
    twitter: 'https://twitter.com/smartbudget_fr',
    instagram: 'https://instagram.com/smartbudget_fr',
    linkedin: 'https://linkedin.com/company/smartbudget',
    tiktok: 'https://tiktok.com/@smartbudget_fr',
  },
  
  // Newsletter
  newsletter: {
    title: 'Recevez nos meilleurs conseils',
    description: 'Une fois par semaine, les meilleures astuces budget directement dans votre boîte mail. Gratuit, sans spam.',
    popupDelay: 30000, // 30 secondes
    ctaText: "Je m'inscris gratuitement",
  },
  
  // AdSense
  adsense: {
    enabled: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ? true : false,
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
    // Positions des pubs dans les articles
    positions: {
      afterIntro: true, // Après le premier paragraphe
      midContent: true, // Au milieu
      beforeConclusion: true, // Avant la conclusion
      sidebar: true, // Dans la sidebar
    },
  },
  
  // Articles
  articles: {
    perPage: 12,
    excerptLength: 160,
    relatedCount: 3,
  },
  
  // SEO defaults
  seo: {
    titleTemplate: '%s | Smart Budget',
    defaultTitle: 'Smart Budget - Conseils budget pour étudiants et jeunes actifs',
    openGraph: {
      type: 'website',
      siteName: 'Smart Budget',
    },
  },
}

// Couleurs des catégories
export const categoryColors: Record<string, string> = {
  epargne: '#10b981',
  budget: '#0ea5e9',
  investissement: '#8b5cf6',
  'bons-plans': '#f59e0b',
  banques: '#ec4899',
  'vie-etudiante': '#06b6d4',
}

// Icônes des catégories (Lucide)
export const categoryIcons: Record<string, string> = {
  epargne: 'PiggyBank',
  budget: 'Wallet',
  investissement: 'TrendingUp',
  'bons-plans': 'Sparkles',
  banques: 'Building',
  'vie-etudiante': 'GraduationCap',
}

export default siteConfig
