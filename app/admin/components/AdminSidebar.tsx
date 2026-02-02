'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Mail,
  Settings,
  LogOut,
  PenLine,
  Users,
  BarChart3,
  Image,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface AdminSidebarProps {
  user: {
    name?: string | null
    email: string
  }
}

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/articles', icon: FileText, label: 'Articles' },
  { href: '/admin/articles/new', icon: PenLine, label: 'Nouvel article' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Catégories' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { href: '/admin/medias', icon: Image, label: 'Médias' },
  { href: '/admin/settings', icon: Settings, label: 'Paramètres' },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-neutral-900 rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-700"
      >
        {isMobileOpen ? <X className="h-6 w-6 text-neutral-700 dark:text-neutral-300" /> : <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />}
      </button>

      {/* Overlay mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64',
          'bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800',
          'transform transition-transform lg:transform-none',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-800">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white text-lg">💰</span>
              </div>
              <div>
                <span className="font-display font-bold text-lg block text-neutral-900 dark:text-white">Smart Budget</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">CMS Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3 p-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <span className="text-primary-700 dark:text-primary-300 font-semibold">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-neutral-900 dark:text-white">{user.name || 'Admin'}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
