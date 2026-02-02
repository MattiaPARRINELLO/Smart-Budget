'use client'

import { useState } from 'react'
import { Button, Input, Textarea, Alert } from '@/components/ui'
import { Save, Globe, Mail, Bell, Search, Code } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'newsletter' | 'ads'>('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [settings, setSettings] = useState({
    // Général
    siteName: 'Smart Budget',
    siteDescription: 'Conseils et astuces pour gérer son budget intelligemment',
    siteUrl: 'https://smartbudget.fr',
    contactEmail: 'contact@smartbudget.fr',
    
    // SEO
    defaultMetaTitle: 'Smart Budget - Gérez votre argent intelligemment',
    defaultMetaDescription: 'Découvrez des conseils pratiques pour économiser, investir et atteindre vos objectifs financiers.',
    googleAnalyticsId: '',
    googleSearchConsoleId: '',
    
    // Newsletter
    newsletterFromName: 'Smart Budget',
    newsletterFromEmail: 'newsletter@smartbudget.fr',
    welcomeEmailSubject: 'Bienvenue sur Smart Budget !',
    
    // Publicités
    adsenseClientId: '',
    adsenseSlotHeader: '',
    adsenseSlotInArticle: '',
    adsenseSlotSidebar: '',
  })

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setSaveSuccess(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simuler la sauvegarde (à implémenter avec l'API)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
  }

  const tabs = [
    { id: 'general' as const, label: 'Général', icon: Globe },
    { id: 'seo' as const, label: 'SEO', icon: Search },
    { id: 'newsletter' as const, label: 'Newsletter', icon: Mail },
    { id: 'ads' as const, label: 'Publicités', icon: Code },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configurez les options de votre site
          </p>
        </div>
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Enregistrer
        </Button>
      </div>

      {saveSuccess && (
        <Alert variant="success" className="mb-6">
          Paramètres enregistrés avec succès !
        </Alert>
      )}

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-6">
          {/* Général */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Informations générales
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Nom du site"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                  />
                  <Textarea
                    label="Description du site"
                    value={settings.siteDescription}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    rows={3}
                  />
                  <Input
                    label="URL du site"
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) => updateSetting('siteUrl', e.target.value)}
                    helper="L'URL complète de votre site (avec https://)"
                  />
                  <Input
                    label="Email de contact"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSetting('contactEmail', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Meta tags par défaut
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Meta title par défaut"
                    value={settings.defaultMetaTitle}
                    onChange={(e) => updateSetting('defaultMetaTitle', e.target.value)}
                    helper={`${settings.defaultMetaTitle.length}/60 caractères`}
                  />
                  <Textarea
                    label="Meta description par défaut"
                    value={settings.defaultMetaDescription}
                    onChange={(e) => updateSetting('defaultMetaDescription', e.target.value)}
                    rows={3}
                    helper={`${settings.defaultMetaDescription.length}/160 caractères`}
                  />
                </div>
              </div>

              <hr className="dark:border-neutral-700" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Outils Google
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Google Analytics ID"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    helper="Format: G-XXXXXXXXXX ou UA-XXXXXXXXX-X"
                  />
                  <Input
                    label="Google Search Console"
                    value={settings.googleSearchConsoleId}
                    onChange={(e) => updateSetting('googleSearchConsoleId', e.target.value)}
                    placeholder="Code de vérification"
                    helper="Le code de vérification Google Search Console"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Newsletter */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Configuration des emails
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Nom de l'expéditeur"
                    value={settings.newsletterFromName}
                    onChange={(e) => updateSetting('newsletterFromName', e.target.value)}
                  />
                  <Input
                    label="Email de l'expéditeur"
                    type="email"
                    value={settings.newsletterFromEmail}
                    onChange={(e) => updateSetting('newsletterFromEmail', e.target.value)}
                  />
                  <Input
                    label="Objet de l'email de bienvenue"
                    value={settings.welcomeEmailSubject}
                    onChange={(e) => updateSetting('welcomeEmailSubject', e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">
                      Configuration SMTP requise
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400/80 mt-1">
                      Pour envoyer des emails, configurez les variables SMTP dans votre fichier .env :
                      SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Publicités */}
          {activeTab === 'ads' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Google AdSense
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Client ID AdSense"
                    value={settings.adsenseClientId}
                    onChange={(e) => updateSetting('adsenseClientId', e.target.value)}
                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                    helper="Votre identifiant éditeur AdSense"
                  />
                </div>
              </div>

              <hr className="dark:border-neutral-700" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Emplacements publicitaires
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Slot - En-tête"
                    value={settings.adsenseSlotHeader}
                    onChange={(e) => updateSetting('adsenseSlotHeader', e.target.value)}
                    placeholder="XXXXXXXXXX"
                    helper="Affiché en haut de la page"
                  />
                  <Input
                    label="Slot - Dans l'article"
                    value={settings.adsenseSlotInArticle}
                    onChange={(e) => updateSetting('adsenseSlotInArticle', e.target.value)}
                    placeholder="XXXXXXXXXX"
                    helper="Inséré automatiquement après le 3ème paragraphe"
                  />
                  <Input
                    label="Slot - Sidebar"
                    value={settings.adsenseSlotSidebar}
                    onChange={(e) => updateSetting('adsenseSlotSidebar', e.target.value)}
                    placeholder="XXXXXXXXXX"
                    helper="Affiché dans la colonne latérale"
                  />
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-900/50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-primary-800 dark:text-primary-300">
                      Placement automatique
                    </h3>
                    <p className="text-sm text-primary-700 dark:text-primary-400/80 mt-1">
                      Les publicités seront automatiquement insérées aux emplacements 
                      configurés une fois le code AdSense approuvé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
