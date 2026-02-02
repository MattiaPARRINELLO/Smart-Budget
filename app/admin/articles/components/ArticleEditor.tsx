'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { slugify, calculateReadingTime, generateExcerpt, debounce } from '@/lib/utils'
import { calculateSEOScore, getSEOCheckResults, seoChecklist } from '@/lib/seo'
import { Button, Input, Textarea, Alert, Badge, Progress } from '@/components/ui'
import { 
  Save, 
  Eye, 
  Send, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lightbulb,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  FileText,
  Tag
} from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

interface Article {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  focusKeyword: string
  categoryId: string
  coverImage: string
  coverImageAlt: string
  status: 'draft' | 'published'
}

interface ArticleEditorProps {
  categories: Category[]
  initialData?: Article
}

export function ArticleEditor({ categories, initialData }: ArticleEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug)
  
  const [article, setArticle] = useState<Article>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    focusKeyword: initialData?.focusKeyword || '',
    categoryId: initialData?.categoryId || categories[0]?.id || '',
    coverImage: initialData?.coverImage || '',
    coverImageAlt: initialData?.coverImageAlt || '',
    status: initialData?.status || 'draft',
  })

  // Calculer le score SEO
  const seoScore = calculateSEOScore(article)
  const { passed, failed } = getSEOCheckResults(article)
  const readingTime = calculateReadingTime(article.content)
  const wordCount = article.content.trim().split(/\s+/).filter(Boolean).length

  // Auto-slug depuis le titre
  useEffect(() => {
    if (autoSlug && article.title) {
      setArticle(prev => ({
        ...prev,
        slug: slugify(article.title)
      }))
    }
  }, [article.title, autoSlug])

  // Auto-excerpt si vide
  useEffect(() => {
    if (!article.excerpt && article.content.length > 200) {
      const autoExcerpt = generateExcerpt(article.content, 155)
      setArticle(prev => ({
        ...prev,
        excerpt: autoExcerpt
      }))
    }
  }, [article.content, article.excerpt])

  // Mettre à jour un champ
  const updateField = (field: keyof Article, value: string) => {
    setArticle(prev => ({ ...prev, [field]: value }))
  }

  // Sauvegarder en brouillon
  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/articles', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...article,
          id: initialData?.id,
          status: 'draft',
          readingTime,
          seoScore,
        }),
      })

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde')
      
      const data = await response.json()
      router.push(`/admin/articles/${data.id}`)
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  // Publier
  const handlePublish = async () => {
    if (seoScore < 50) {
      if (!confirm('Le score SEO est faible. Voulez-vous quand même publier ?')) {
        return
      }
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/admin/articles', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...article,
          id: initialData?.id,
          status: 'published',
          publishedAt: new Date().toISOString(),
          readingTime,
          seoScore,
        }),
      })

      if (!response.ok) throw new Error('Erreur lors de la publication')
      
      router.push('/admin/articles')
      router.refresh()
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la publication')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-6">
      {/* Main Editor */}
      <div className="space-y-6">
        {/* Header actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Retour
          </Button>
          
          <div className="flex-1" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            leftIcon={<Eye className="h-4 w-4" />}
          >
            {showPreview ? 'Éditer' : 'Aperçu'}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={isSaving}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Sauvegarder
          </Button>
          
          <Button
            size="sm"
            onClick={handlePublish}
            isLoading={isSubmitting}
            leftIcon={<Send className="h-4 w-4" />}
          >
            Publier
          </Button>
        </div>

        {/* Title */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Titre de l'article (H1)
              </label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Un titre accrocheur et optimisé SEO..."
                className="w-full text-2xl font-display font-bold border-0 border-b-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-0 pb-2 outline-none bg-transparent dark:text-white dark:placeholder:text-neutral-500"
              />
              <p className="text-sm text-neutral-400 mt-2">
                {article.title.length}/60 caractères
                {article.title.length >= 50 && article.title.length <= 60 && (
                  <span className="text-success-500 ml-2">✓ Optimal</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">URL :</span>
              <code className="text-sm bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-2 py-1 rounded">
                /article/
              </code>
              <input
                type="text"
                value={article.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  updateField('slug', slugify(e.target.value))
                }}
                className="flex-1 text-sm bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 px-2 py-1 rounded border-0 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            Contenu (Markdown)
          </label>
          
          {!showPreview ? (
            <textarea
              value={article.content}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder={`# Votre article ici

Écrivez en Markdown...

## Sous-titre

Votre contenu...

> 💡 **Astuce** : Utilisez des blockquotes pour les conseils

### Points clés

- Point 1
- Point 2
- Point 3`}
              className="w-full min-h-[500px] font-mono text-sm border-2 border-neutral-200 dark:border-neutral-700 rounded-xl p-4 focus:border-primary-500 focus:ring-0 resize-y bg-white dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none min-h-[500px] p-4 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-950">
              <div className="article-content">
                {/* Preview simple - en production utiliser MDX */}
                <div dangerouslySetInnerHTML={{ 
                  __html: article.content
                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                    .replace(/\*(.*)\*/gim, '<em>$1</em>')
                    .replace(/\n/gim, '<br/>')
                }} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{wordCount} mots</span>
            <span>•</span>
            <span>{readingTime} min de lecture</span>
          </div>
        </div>

        {/* Meta Description */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <Textarea
            label="Meta description (résumé)"
            value={article.excerpt}
            onChange={(e) => updateField('excerpt', e.target.value)}
            placeholder="Un résumé accrocheur de 150-160 caractères pour Google..."
            maxLength={160}
            charCount
            hint="Cette description apparaîtra dans les résultats Google"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* SEO Score */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 dark:text-white">
            <AlertCircle className="h-5 w-5 text-primary-500" />
            Score SEO
          </h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={cn(
              'text-4xl font-bold',
              seoScore >= 70 ? 'text-success-500' :
              seoScore >= 50 ? 'text-warning-500' : 'text-red-500'
            )}>
              {seoScore}
            </div>
            <Progress 
              value={seoScore} 
              color={
                seoScore >= 70 ? '#10b981' :
                seoScore >= 50 ? '#f59e0b' : '#ef4444'
              }
            />
          </div>

          <div className="space-y-2">
            {/* Points validés */}
            {passed.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-600 dark:text-neutral-300">{item.label}</span>
              </div>
            ))}
            
            {/* Points à améliorer */}
            {failed.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-neutral-600 dark:text-neutral-300">{item.label}</span>
                  <p className="text-xs text-neutral-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mot-clé principal */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <Input
            label="Mot-clé principal"
            value={article.focusKeyword}
            onChange={(e) => updateField('focusKeyword', e.target.value)}
            placeholder="ex: épargner étudiant"
            leftIcon={<Tag className="h-4 w-4" />}
            hint="Le mot-clé sur lequel vous voulez vous positionner"
          />
        </div>

        {/* Catégorie */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Catégorie
          </label>
          <select
            value={article.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-0 bg-white dark:bg-neutral-950 dark:text-neutral-100"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image de couverture */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <Input
            label="Image de couverture (URL)"
            value={article.coverImage}
            onChange={(e) => updateField('coverImage', e.target.value)}
            placeholder="/images/article.jpg"
            leftIcon={<ImageIcon className="h-4 w-4" />}
          />
          
          {article.coverImage && (
            <div className="mt-4">
              <img
                src={article.coverImage}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl"
              />
            </div>
          )}

          <div className="mt-4">
            <Input
              label="Texte alternatif"
              value={article.coverImageAlt}
              onChange={(e) => updateField('coverImageAlt', e.target.value)}
              placeholder="Description de l'image pour le SEO"
            />
          </div>
        </div>

        {/* Suggestions liens internes */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 dark:text-white">
            <LinkIcon className="h-5 w-5 text-primary-500" />
            Liens internes suggérés
          </h3>
          
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Ajoutez des liens vers d'autres articles pour améliorer le maillage interne.
          </p>
          
          <Alert variant="tip" className="mt-4">
            <p className="text-xs">
              Utilisez la syntaxe Markdown :<br />
              <code className="dark:bg-neutral-800 dark:text-neutral-300">[texte](/article/slug)</code>
            </p>
          </Alert>
        </div>
      </div>
    </div>
  )
}
