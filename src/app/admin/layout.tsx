'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check if current page is the login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    checkAuth()
  }, [pathname])

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setIsAuthenticated(!!session)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // If it's the login page, just render it without any wrapper
  if (isLoginPage) {
    return <>{children}</>
  }

  // For other admin pages, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-light">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  // If not authenticated and not on login page, the individual pages will handle redirect
  // But we can show the layout without navigation for a cleaner experience
  if (!isAuthenticated) {
    return <>{children}</>
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Ürünler', icon: '🛋️' },
    { href: '/admin/categories', label: 'Kategoriler', icon: '📂' },
    { href: '/admin/campaigns', label: 'Kampanyalar', icon: '🎯' },
    { href: '/admin/settings', label: 'Ayarlar', icon: '⚙️' },
  ]

  const getPageTitle = () => {
    const item = navItems.find(item => item.href === pathname)
    return item ? item.label : 'Dashboard'
  }

  return (
    <div className="flex h-screen bg-[#f5f5f5] overflow-hidden">
      {/* Left Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg group-hover:bg-red-700 transition-colors">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Solenza</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-gray-200 space-y-2">
          <a
            href="/"
            target="_blank"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all text-sm"
          >
            <span className="text-lg">🌐</span>
            <span>Siteyi Gör</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
          >
            <span className="text-lg">🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col">
            {/* Logo */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-200">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div>
                  <h1 className="text-xl font-bold text-dark">Solenza</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    pathname === item.href
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <a
                href="/"
                target="_blank"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
              >
                <span className="text-xl">🌐</span>
                <span className="font-medium">Siteyi Gör</span>
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium"
              >
                <span className="text-xl">🚪</span>
                <span>Çıkış Yap</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {getPageTitle()}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Solenza Admin Paneli</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Admin Profile */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-semibold text-gray-900 block">Admin</span>
                <span className="text-xs text-gray-500">Yönetici</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
