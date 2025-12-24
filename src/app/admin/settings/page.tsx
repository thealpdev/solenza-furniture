'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import ImageUploader from '@/components/ImageUploader'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    company_name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address_tr: '',
    address_en: '',
    about_tr: '',
    about_en: '',
    facebook: '',
    instagram: '',
    twitter: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*')

      if (error) throw error

      if (data) {
        const settingsObj: any = {}
        data.forEach(item => {
          settingsObj[item.key] = item.value || ''
        })
        setSettings(settingsObj)
      }
    } catch (error: any) {
      toast.error(`Ayarlar yüklenemedi: ${error.message}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Upsert each setting
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('settings')
          .upsert({
            key,
            value: value || '',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'key'
          })

        if (error) throw error
      }

      toast.success('Ayarlar başarıyla kaydedildi!')
    } catch (error: any) {
      toast.error(`Ayarlar kaydedilemedi: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-dark">Ayarlar</h1>
        <p className="text-gray-600 mt-1">Mağaza bilgilerini ve iletişim detaylarını yönetin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Şirket Bilgileri */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-dark mb-6">Şirket Bilgileri</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Mağaza Adı</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Solenza"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">E-posta</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="info@solenza.com"
              />
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-dark mb-6">İletişim Bilgileri</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Telefon</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+90 XXX XXX XX XX"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">WhatsApp</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="+90 XXX XXX XX XX"
              />
            </div>
          </div>
        </div>

        {/* Adres */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-dark mb-6">Adres</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Adres (TR) 🇹🇷</label>
              <textarea
                value={settings.address_tr}
                onChange={(e) => handleChange('address_tr', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows={3}
                placeholder="İstanbul, Türkiye..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Address (EN) 🇬🇧</label>
              <textarea
                value={settings.address_en}
                onChange={(e) => handleChange('address_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows={3}
                placeholder="Istanbul, Turkey..."
              />
            </div>
          </div>
        </div>

        {/* Hakkımızda */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-dark mb-6">Hakkımızda</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Hakkımızda (TR) 🇹🇷</label>
              <textarea
                value={settings.about_tr}
                onChange={(e) => handleChange('about_tr', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows={5}
                placeholder="Solenza hakkında bilgi..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">About Us (EN) 🇬🇧</label>
              <textarea
                value={settings.about_en}
                onChange={(e) => handleChange('about_en', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                rows={5}
                placeholder="About Solenza..."
              />
            </div>
          </div>
        </div>

        {/* Anasayfa Görselleri */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-dark mb-6">Anasayfa Görselleri</h2>

          {/* Hero Section */}
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Hero Alanı (Üst Banner)</h3>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Başlık (TR)</label>
                <input
                  type="text"
                  value={(settings as any).hero_title_tr || ''}
                  onChange={(e) => handleChange('hero_title_tr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="The Art of Living"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Alt Başlık (TR)</label>
                <textarea
                  value={(settings as any).hero_subtitle_tr || ''}
                  onChange={(e) => handleChange('hero_subtitle_tr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={2}
                  placeholder="Eviniz için seçkin parçalar..."
                />
              </div>
            </div>
            <ImageUploader
              label="Hero Görseli (Sağ Taraf)"
              currentImage={(settings as any).hero_image_url}
              onUpload={(url) => handleChange('hero_image_url', url)}
              folderName="hero"
            />
          </div>

          {/* Statement Section */}
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">Statement (Vurgulu) Alan</h3>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Koleksiyon Başlığı</label>
                <input
                  type="text"
                  value={(settings as any).statement_title_tr || ''}
                  onChange={(e) => handleChange('statement_title_tr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="The Velvet Touch Series"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Açıklama</label>
                <textarea
                  value={(settings as any).statement_desc_tr || ''}
                  onChange={(e) => handleChange('statement_desc_tr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  rows={2}
                  placeholder="Ustalıkla işlenmiş..."
                />
              </div>
            </div>
            <ImageUploader
              label="Statement Görseli (Sol Taraf)"
              currentImage={(settings as any).statement_image_url}
              onUpload={(url) => handleChange('statement_image_url', url)}
              folderName="statement"
            />
          </div>
        </div>

        {/* Sosyal Medya */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-dark mb-6">Sosyal Medya</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://facebook.com/solenza"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://instagram.com/solenza"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-2">Twitter URL</label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://twitter.com/solenza"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Kaydediliyor...' : '💾 Ayarları Kaydet'}
        </button>
      </form>
    </div>
  )
}
