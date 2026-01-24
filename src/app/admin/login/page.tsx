'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Lock, Mail, Loader2, KeyRound } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...')
      router.push('/admin')
    } catch (error: any) {
      toast.error(error.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Lütfen e-posta adresinizi girin.')
      return
    }
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      })

      if (error) throw error

      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
      setIsResetMode(false)
    } catch (error: any) {
      toast.error(error.message || 'Şifre sıfırlama işlemi başarısız oldu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-400/10 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Brand Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 transform group-hover:rotate-12 transition-transform duration-500">
              <span className="text-3xl font-serif font-bold text-white">S</span>
            </div>
            <h1 className="text-4xl font-serif text-white tracking-tight mb-2">Solenza</h1>
            <p className="text-gold-200 text-sm tracking-[0.2em] uppercase opacity-80">Admin Panel</p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isResetMode ? 'Şifre Sıfırlama' : 'Hoş Geldiniz'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isResetMode
                ? 'E-posta adresinize sıfırlama bağlantısı gönderilecek.'
                : 'Yönetim paneline erişmek için giriş yapın.'}
            </p>
          </div>

          <form onSubmit={isResetMode ? handleResetPassword : handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider ml-1">E-posta</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="admin@solenza.com"
                  required
                />
              </div>
            </div>

            {!isResetMode && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gold-200 uppercase tracking-wider ml-1">Şifre</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isResetMode ? (
                <>
                  <KeyRound className="h-4 w-4" />
                  <span>Bağlantı Gönder</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <button
              onClick={() => setIsResetMode(!isResetMode)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isResetMode ? 'Giriş Ekranına Dön' : 'Şifremi Unuttum'}
            </button>
            <Link href="/" className="text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Siteye Dön</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
