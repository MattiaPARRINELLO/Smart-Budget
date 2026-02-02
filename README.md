# Smart Budget - Site de contenu SEO-optimisé

Site web moderne destiné à publier des articles optimisés SEO pour une audience étudiants et jeunes actifs (18-30 ans) sur le thème "Smart Budget".

## 🚀 Fonctionnalités

### Frontend Public
- ✅ Design moderne, coloré et premium
- ✅ Mobile-first avec animations légères (Framer Motion)
- ✅ Pages : Accueil, Catégories, Articles
- ✅ Newsletter intégrée (formulaire + popup)
- ✅ Typographie optimisée pour la lecture longue
- ✅ Sommaire automatique dans les articles

### CMS / Éditeur
- ✅ Éditeur Markdown ultra simple
- ✅ Checklist SEO guidée avec score en temps réel
- ✅ Champs : titre, résumé, mot-clé principal, catégories
- ✅ Aperçu avant publication
- ✅ Dashboard avec statistiques

### SEO & Performance
- ✅ URLs propres (`/article/mon-article`)
- ✅ Sitemap.xml et robots.txt automatiques
- ✅ HTML sémantique avec Schema.org Article
- ✅ Open Graph et meta tags automatiques
- ✅ Lazy loading images
- ✅ Optimisé Lighthouse

### Newsletter
- ✅ Formulaires sur toutes les pages
- ✅ Double opt-in par email
- ✅ Stockage des emails en base
- ✅ Templates email stylés

## 🛠 Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Styling** : Tailwind CSS + Design System custom
- **Base de données** : SQLite via Prisma
- **Auth** : NextAuth.js
- **Animations** : Framer Motion
- **Emails** : Nodemailer
- **Contenu** : MDX

## 📦 Installation

### Prérequis
- Node.js 18+
- npm ou pnpm

### Étapes

1. **Cloner et installer les dépendances**
```bash
cd "Site News"
npm install
```

2. **Configurer l'environnement**
```bash
cp .env.example .env
```
Modifier `.env` avec vos valeurs (voir section Configuration).

3. **Initialiser la base de données**
```bash
npm run db:push
npm run db:seed
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000)

L'admin est accessible sur [http://localhost:3000/admin](http://localhost:3000/admin)
- Email: `admin@smartbudget.fr`
- Mot de passe: `SmartBudget2024!`

## ⚙️ Configuration

### Variables d'environnement

```env
# Base de données
DATABASE_URL="file:./dev.db"

# NextAuth (générer une clé secrète pour la prod)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-cle-secrete-32-caracteres

# Admin initial
ADMIN_EMAIL=admin@smartbudget.fr
ADMIN_PASSWORD=VotreMotDePasseSecurise!

# Email SMTP (pour newsletter)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-app-password
EMAIL_FROM=Smart Budget <noreply@smartbudget.fr>

# Site
NEXT_PUBLIC_SITE_URL=https://smartbudget.fr
NEXT_PUBLIC_SITE_NAME=Smart Budget
```

## 📝 Créer un nouvel article

### Via le CMS (recommandé)

1. Aller sur `/admin`
2. Cliquer sur "Nouvel article"
3. Remplir les champs :
   - **Titre** : 50-60 caractères, avec le mot-clé principal
   - **Contenu** : Écrire en Markdown
   - **Résumé** : 150-160 caractères pour la meta description
   - **Mot-clé principal** : Le terme SEO cible
   - **Catégorie** : Choisir parmi les existantes
   - **Image** : URL de l'image de couverture
4. Vérifier le score SEO (viser 70+)
5. Sauvegarder en brouillon ou publier

### Syntaxe Markdown

```markdown
# Titre principal

Introduction de l'article...

## Sous-titre

Paragraphe avec **texte en gras** et *italique*.

### Liste à puces
- Point 1
- Point 2
- Point 3

### Tableau
| Colonne 1 | Colonne 2 |
|-----------|-----------|
| Valeur 1  | Valeur 2  |

### Blockquote (conseil)
> 💡 **Astuce** : Votre conseil ici

### Lien interne
[Voir cet article](/article/slug-article)

### Code
\`code inline\` ou bloc de code avec \`\`\`
```

## 🎨 Personnalisation

### Couleurs

Modifier `tailwind.config.ts` :

```typescript
colors: {
  primary: {
    500: '#0ea5e9', // Couleur principale
    // ...
  },
  accent: {
    500: '#d946ef', // Couleur accent
    // ...
  },
}
```

### Logo et branding

Modifier `lib/config.ts` :

```typescript
export const siteConfig = {
  name: 'Smart Budget',
  description: 'Votre description',
  // ...
}
```

### Navigation

Modifier `lib/config.ts` > `mainNav` et `footerNav`.

### Catégories

Via Prisma Studio :
```bash
npm run db:studio
```

Ou directement dans le seed (`prisma/seed.ts`).

## 🚀 Déploiement

### Vercel (recommandé)

1. Pusher le code sur GitHub
2. Importer le projet sur [Vercel](https://vercel.com)
3. Configurer les variables d'environnement
4. Utiliser une base PostgreSQL (Vercel Postgres ou Supabase)

Modifier `prisma/schema.prisma` pour PostgreSQL :
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Netlify

Similaire à Vercel. Utiliser le plugin `@netlify/plugin-nextjs`.

## 📊 SEO Checklist

L'éditeur vérifie automatiquement :

1. ✅ Titre entre 50-60 caractères
2. ✅ Mot-clé dans le titre
3. ✅ Meta description 150-160 caractères
4. ✅ Mot-clé dans la description
5. ✅ Contenu de 800+ mots
6. ✅ Densité du mot-clé correcte
7. ✅ Sous-titres H2/H3
8. ✅ Image de couverture
9. ✅ Texte alt sur les images
10. ✅ Liens internes

## 🔧 Scripts disponibles

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run start      # Lancer la production
npm run db:push    # Synchroniser le schéma Prisma
npm run db:studio  # Interface Prisma Studio
npm run db:seed    # Peupler la base avec des données exemple
```

## 📁 Structure du projet

```
├── app/
│   ├── admin/           # Pages CMS
│   ├── api/             # Routes API
│   ├── article/         # Page article dynamique
│   ├── categorie/       # Page catégorie dynamique
│   ├── newsletter/      # Pages confirmation newsletter
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Page d'accueil
│   ├── globals.css      # Styles globaux
│   ├── sitemap.ts       # Sitemap automatique
│   └── robots.ts        # Robots.txt
├── components/
│   ├── layout/          # Header, Footer
│   ├── newsletter/      # Composants newsletter
│   └── ui/              # Design system
├── lib/
│   ├── auth.ts          # Configuration NextAuth
│   ├── config.ts        # Configuration site
│   ├── db.ts            # Client Prisma
│   ├── email.ts         # Envoi d'emails
│   ├── seo.ts           # Utilitaires SEO
│   └── utils.ts         # Fonctions utilitaires
├── prisma/
│   ├── schema.prisma    # Schéma base de données
│   └── seed.ts          # Données initiales
└── public/              # Assets statiques
```

## 🤝 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.

## 📄 Licence

MIT - Libre d'utilisation commerciale et personnelle.
