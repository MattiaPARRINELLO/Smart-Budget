'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Input, Textarea, Alert } from '@/components/ui'
import { ArrowLeft, Save } from 'lucide-react'
import { slugify } from '@/lib/utils'

const PRESET_COLORS = [
  '#0ea5e9', // sky
  '#d946ef', // fuchsia
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#84cc16', // lime
]

export default function NewCategoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoSlug, setAutoSlug] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: PRESET_COLORS[0],
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-générer le slug
      if (field === 'name' && autoSlug) {
        newData.slug = slugify(value)
      }
      
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la création')
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link 
          href="/admin/categories" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux catégories
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Nouvelle catégorie
        </h1>
        <p className="text-gray-500 mt-1">
          Créez une catégorie pour organiser vos articles
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
          <Input
            label="Nom de la catégorie"
            placeholder="Ex: Épargne et investissement"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Slug (URL)
              </label>
              <label className="flex items-center text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={autoSlug}
                  onChange={(e) => setAutoSlug(e.target.checked)}
                  className="mr-2"
                />
                Auto-générer
              </label>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 bg-gray-100 px-3 py-2 rounded-l-lg border border-r-0 border-gray-300">
                /categorie/
              </span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setAutoSlug(false)
                  updateField('slug', e.target.value)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="epargne-investissement"
                required
              />
            </div>
          </div>

          <Textarea
            label="Description"
            placeholder="Une brève description de cette catégorie..."
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            helper="Optionnel. Affichée sur la page de la catégorie."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField('color', color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    formData.color === color 
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">Couleur personnalisée :</span>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => updateField('color', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {formData.color}
              </code>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/admin/categories">
            <Button variant="outline" type="button">
              Annuler
            </Button>
          </Link>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Créer la catégorie
          </Button>
        </div>
      </form>
    </div>
  )
}
