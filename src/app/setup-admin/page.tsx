'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Loader2, UserPlus } from 'lucide-react'

export default function SetupAdminPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                // If user already exists, try signing in (just to check) or instruct user
                if (error.message.includes('already registered')) {
                    setMessage('❌ Bu e-posta zaten kayıtlı. Lütfen giriş yapmayı deneyin.');
                } else {
                    setMessage(`❌ Hata: ${error.message}`);
                }
                toast.error(error.message)
            } else {
                setMessage(`✅ Kullanıcı oluşturuldu! Lütfen e-postanızı kontrol edin (gerçek e-posta ise) veya giriş yapmayı deneyin. Not: E-posta doğrulama kapalıysa direkt giriş yapabilirsiniz.`);
                toast.success('Kullanıcı oluşturma isteği gönderildi.')
            }
        } catch (error: any) {
            setMessage(`❌ Beklenmedik Hata: ${error.message}`);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Oluştur</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Geçici olarak yeni bir admin kullanıcısı oluşturmak için bu paneli kullanın.
                    </p>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Admin E-posta</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="ornek@admin.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Şifre Belirle</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Güçlü bir şifre girin"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Kullanıcı Oluştur'}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded-lg text-sm ${message.startsWith('❌') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}
