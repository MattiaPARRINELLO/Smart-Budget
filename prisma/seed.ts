import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Créer l'admin
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'SmartBudget2024!', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@smartbudget.fr' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@smartbudget.fr',
      name: 'Admin Smart Budget',
      password: hashedPassword,
      role: 'admin',
    },
  })
  console.log('✅ Admin créé:', admin.email)

  // Créer les catégories
  const categories = [
    { 
      slug: 'epargne', 
      name: 'Épargne', 
      description: 'Conseils pour épargner efficacement même avec un petit budget',
      color: '#10b981',
      icon: 'PiggyBank',
      order: 1
    },
    { 
      slug: 'budget', 
      name: 'Budget', 
      description: 'Méthodes et outils pour gérer son budget au quotidien',
      color: '#0ea5e9',
      icon: 'Wallet',
      order: 2
    },
    { 
      slug: 'investissement', 
      name: 'Investissement', 
      description: 'Débuter en investissement avec peu de moyens',
      color: '#8b5cf6',
      icon: 'TrendingUp',
      order: 3
    },
    { 
      slug: 'bons-plans', 
      name: 'Bons Plans', 
      description: 'Les meilleurs bons plans pour économiser',
      color: '#f59e0b',
      icon: 'Sparkles',
      order: 4
    },
    { 
      slug: 'banques', 
      name: 'Banques', 
      description: 'Comparatifs et avis sur les banques',
      color: '#ec4899',
      icon: 'Building',
      order: 5
    },
    { 
      slug: 'vie-etudiante', 
      name: 'Vie Étudiante', 
      description: 'Conseils budget spécial étudiants',
      color: '#06b6d4',
      icon: 'GraduationCap',
      order: 6
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log('✅ Catégories créées:', categories.length)

  // Créer quelques tags
  const tags = [
    'débutant', 'avancé', 'livret-a', 'assurance-vie', 
    'etf', 'crypto', 'cashback', 'parrainage',
    'logement', 'courses', 'transport', 'loisirs'
  ]

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { slug: tagName },
      update: {},
      create: { slug: tagName, name: tagName.charAt(0).toUpperCase() + tagName.slice(1).replace('-', ' ') },
    })
  }
  console.log('✅ Tags créés:', tags.length)

  // Créer des articles exemples
  const epargneCategory = await prisma.category.findUnique({ where: { slug: 'epargne' } })
  const budgetCategory = await prisma.category.findUnique({ where: { slug: 'budget' } })
  const bonsPlansCategory = await prisma.category.findUnique({ where: { slug: 'bons-plans' } })

  const articles = [
    {
      slug: 'comment-epargner-100-euros-par-mois-etudiant',
      title: 'Comment épargner 100€ par mois quand on est étudiant',
      excerpt: 'Découvrez nos 10 astuces concrètes pour mettre de côté 100€ chaque mois, même avec un budget étudiant serré. Guide pratique et réaliste.',
      content: `# Comment épargner 100€ par mois quand on est étudiant

Épargner quand on est étudiant peut sembler impossible. Entre le loyer, les courses, les sorties et les frais de scolarité, il reste souvent peu de marge. Pourtant, avec les bonnes stratégies, **mettre 100€ de côté chaque mois est tout à fait réalisable**.

## Pourquoi épargner dès maintenant ?

Commencer à épargner tôt présente de nombreux avantages :

- **L'effet des intérêts composés** : Plus vous commencez tôt, plus votre argent travaille longtemps
- **Créer de bonnes habitudes** : L'épargne devient un réflexe
- **Constituer un matelas de sécurité** : Pour faire face aux imprévus

> 💡 **Le saviez-vous ?** 100€ épargnés chaque mois pendant 10 ans, avec un rendement de 5%, représentent plus de 15 000€ !

## Les 10 astuces pour épargner 100€/mois

### 1. Automatisez votre épargne

La règle d'or : **payez-vous en premier**. Dès que votre argent arrive sur votre compte, transférez automatiquement une somme vers votre épargne.

\`\`\`
Salaire/Bourse → Virement automatique → Livret A
\`\`\`

### 2. Utilisez la méthode 50/30/20

Répartissez votre budget ainsi :
- **50%** pour les besoins essentiels (loyer, courses, transport)
- **30%** pour les envies (sorties, loisirs, shopping)
- **20%** pour l'épargne

### 3. Cuisinez plutôt que commander

Un repas livré coûte en moyenne 15-20€. Un repas maison ? 3-5€ maximum.

| Type de repas | Coût moyen | Par mois (20 repas) |
|--------------|-----------|---------------------|
| Livraison | 18€ | 360€ |
| Maison | 4€ | 80€ |
| **Économie** | **14€** | **280€** |

### 4. Profitez des offres étudiantes

- Spotify/Apple Music étudiant : -50%
- Amazon Prime Student : -50%
- Réductions cinéma, musées, transports

### 5. Vendez ce que vous n'utilisez plus

Vinted, Leboncoin, Facebook Marketplace... Vos vêtements et objets inutilisés peuvent financer votre épargne.

## Où placer son épargne ?

Pour un étudiant, voici les meilleurs placements :

1. **Livret A** : 3% net, disponible immédiatement, 0 risque
2. **LDDS** : Même avantages que le Livret A
3. **Livret Jeune** : Jusqu'à 4%, si vous avez moins de 25 ans

## Conclusion

Épargner 100€ par mois est un objectif ambitieux mais réaliste. La clé ? **La régularité et l'automatisation**. Commencez petit si nécessaire, même 20€ par mois, c'est déjà une victoire !

---

*Cet article vous a aidé ? Inscrivez-vous à notre newsletter pour recevoir nos meilleurs conseils budget chaque semaine !*`,
      focusKeyword: 'épargner étudiant',
      seoScore: 85,
      categoryId: epargneCategory!.id,
      authorId: admin.id,
      status: 'published',
      publishedAt: new Date(),
      readingTime: 6,
    },
    {
      slug: 'methode-budget-50-30-20-guide-complet',
      title: 'La méthode 50/30/20 : le guide complet pour gérer son budget',
      excerpt: 'Apprenez à appliquer la méthode budgétaire 50/30/20 au quotidien. Une règle simple pour équilibrer dépenses, plaisirs et épargne.',
      content: `# La méthode 50/30/20 : le guide complet

La méthode 50/30/20 est l'une des règles de budget les plus simples et efficaces. Popularisée par Elizabeth Warren, elle permet de **structurer ses finances sans se prendre la tête**.

## Le principe en 30 secondes

Divisez vos revenus nets en trois catégories :

- **50% - Besoins** : Loyer, factures, courses, transport, assurances
- **30% - Envies** : Sorties, restaurants, shopping, abonnements streaming
- **20% - Épargne** : Livrets, investissements, remboursement de dettes

## Comment l'appliquer concrètement ?

### Étape 1 : Calculez vos revenus nets

Prenez votre salaire après impôts, ajoutez les aides (APL, bourses...).

**Exemple** : 1 500€ nets/mois

### Étape 2 : Répartissez selon la règle

| Catégorie | Pourcentage | Montant |
|-----------|-------------|---------|
| Besoins | 50% | 750€ |
| Envies | 30% | 450€ |
| Épargne | 20% | 300€ |

### Étape 3 : Ajustez si nécessaire

La règle 50/30/20 est un **guide, pas une prison**. Si votre loyer représente déjà 40% de vos revenus, adaptez les autres catégories.

## Les erreurs à éviter

1. **Confondre besoins et envies** : Netflix n'est pas un besoin !
2. **Oublier les dépenses annuelles** : Assurances, impôts...
3. **Ne pas suivre ses dépenses** : Utilisez une app comme Bankin' ou Linxo

## Conclusion

La méthode 50/30/20 est un excellent point de départ. L'important est de **commencer à structurer son budget**, même imparfaitement.`,
      focusKeyword: 'méthode 50/30/20',
      seoScore: 82,
      categoryId: budgetCategory!.id,
      authorId: admin.id,
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000), // Hier
      readingTime: 5,
    },
    {
      slug: 'meilleures-apps-cashback-2024',
      title: 'Les 8 meilleures applications de cashback en 2024',
      excerpt: 'Comparatif complet des apps de cashback : iGraal, Poulpeo, Widilo... Découvrez lesquelles rapportent vraiment et comment maximiser vos gains.',
      content: `# Les 8 meilleures applications de cashback en 2024

Le cashback, c'est de l'argent remboursé sur vos achats. Simple, gratuit, et ça peut rapporter **plusieurs centaines d'euros par an**. Voici notre sélection des meilleures apps.

## Comment fonctionne le cashback ?

1. Vous passez par un site/app de cashback
2. Vous faites votre achat normalement
3. Vous recevez un pourcentage du montant en retour

> ⚠️ **Important** : Activez toujours le cashback AVANT de commencer vos achats !

## Notre top 8

### 1. iGraal ⭐⭐⭐⭐⭐

Le leader français du cashback.

- **Taux moyens** : 3-10%
- **Nombre de marchands** : 1 800+
- **Bonus inscription** : 3€
- **Seuil de retrait** : 20€

### 2. Poulpeo ⭐⭐⭐⭐

Excellent pour les gros achats.

- **Taux moyens** : 4-12%
- **Spécialité** : High-tech, voyage
- **Bonus inscription** : 5€

### 3. Widilo ⭐⭐⭐⭐

Le challenger qui monte.

- **Taux moyens** : 3-15%
- **Point fort** : Souvent les meilleurs taux
- **Bonus** : 5€

## Comparatif rapide

| App | Marchands | Taux moyen | Seuil retrait |
|-----|-----------|------------|---------------|
| iGraal | 1 800 | 5% | 20€ |
| Poulpeo | 1 500 | 6% | 10€ |
| Widilo | 1 200 | 7% | 10€ |
| eBuyClub | 1 400 | 4% | 10€ |

## Nos conseils pour maximiser

1. **Comparez les taux** avant chaque achat
2. **Cumulez** avec les codes promo
3. **Attendez les boost** de cashback (souvent x2)
4. **Utilisez l'extension navigateur** pour ne rien oublier

## Conclusion

Le cashback, c'est de l'argent gratuit. Installez 2-3 apps et comparez systématiquement. Sur une année, vous pouvez facilement récupérer **200-500€** sans effort !`,
      focusKeyword: 'application cashback',
      seoScore: 88,
      categoryId: bonsPlansCategory!.id,
      authorId: admin.id,
      status: 'published',
      publishedAt: new Date(Date.now() - 172800000), // Il y a 2 jours
      readingTime: 7,
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    })
  }
  console.log('✅ Articles créés:', articles.length)

  // Settings par défaut
  const settings = [
    { key: 'site_name', value: 'Smart Budget' },
    { key: 'site_description', value: 'Conseils budget et finances pour étudiants et jeunes actifs' },
    { key: 'site_logo', value: '/logo.svg' },
    { key: 'newsletter_popup_delay', value: '30000' },
    { key: 'adsense_enabled', value: 'false' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log('✅ Settings configurés')

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
