'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import ImageUploader from '@/components/ImageUploader'
import { Tab } from '@headlessui/react'
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  MapPinIcon,
  InformationCircleIcon,
  PhotoIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

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
    hero_title_tr: '',
    hero_subtitle_tr: '',
    hero_image_url: '',
    statement_title_tr: '',
    statement_desc_tr: '',
    statement_image_url: ''
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
        setSettings(prev => ({ ...prev, ...settingsObj }))
      }
    } catch (error: any) {
      toast.error(`Ayarlar yüklenemedi: ${error.message}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
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

  const tabs = [
    { name: 'Genel Bilgiler', icon: BuildingStorefrontIcon },
    { name: 'İletişim & Adres', icon: MapPinIcon },
    { name: 'Hakkımızda', icon: InformationCircleIcon },
    { name: 'Medya & Görseller', icon: PhotoIcon },
    { name: 'Sosyal Medya', icon: GlobeAltIcon },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-500 mt-2">Mağazanızı yönetmek için gerekli tüm yapılandırmalar</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tab.Group>
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="col-span-12 lg:col-span-3">
              <Tab.List className="flex flex-col space-y-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }: { selected: boolean }) =>
                      classNames(
                        'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 outline-none',
                        selected
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    'Kaydediliyor...'
                  ) : (
                    <>
                      <span>💾 Değişiklikleri Kaydet</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-span-12 lg:col-span-9">
              <Tab.Panels>
                {/* Genel Bilgiler */}
                <Tab.Panel className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 outline-none animate-fadeIn">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Şirket Bilgileri</h2>
                    <p className="text-gray-500 text-sm">Temel mağaza kimlik bilgileri</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mağaza Adı</label>
                      <input
                        type="text"
                        value={settings.company_name}
                        onChange={(e) => handleChange('company_name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        placeholder="Solenza"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Kurumsal E-posta</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        placeholder="info@solenza.com"
                      />
                    </div>
                  </div>
                </Tab.Panel>

                {/* İletişim & Adres */}
                <Tab.Panel className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 outline-none animate-fadeIn">
                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h2 className="text-xl font-bold text-gray-900">İletişim Kanalı</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                        <div className="relative">
                          <PhoneIcon className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            value={settings.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Hattı</label>
                        <input
                          type="text"
                          value={settings.whatsapp}
                          onChange={(e) => handleChange('whatsapp', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h2 className="text-xl font-bold text-gray-900">Adres Detayları</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">🇹🇷 Türkçe Açık Adres</label>
                        <textarea
                          value={settings.address_tr}
                          onChange={(e) => handleChange('address_tr', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">🇬🇧 English Address</label>
                        <textarea
                          value={settings.address_en}
                          onChange={(e) => handleChange('address_en', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Hakkımızda */}
                <Tab.Panel className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 outline-none animate-fadeIn">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Hakkımızda Metinleri</h2>
                    <p className="text-gray-500 text-sm">Web sitesinin "Hakkımızda" bölümünde görünecek içerik</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🇹🇷 Türkçe Metin</label>
                      <textarea
                        value={settings.about_tr}
                        onChange={(e) => handleChange('about_tr', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all h-48"
                        placeholder="Hikayemiz..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🇬🇧 English Text</label>
                      <textarea
                        value={settings.about_en}
                        onChange={(e) => handleChange('about_en', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all h-48"
                        placeholder="Our story..."
                      />
                    </div>
                  </div>
                </Tab.Panel>

                {/* Görseller */}
                <Tab.Panel className="space-y-6 outline-none animate-fadeIn">
                  {/* Hero */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Hero (Ana Banner)</h2>
                      <p className="text-gray-500 text-sm">Ana sayfanızın en üstündeki büyük karşılama alanı</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Ana Başlık</label>
                          <input
                            type="text"
                            value={settings.hero_title_tr}
                            onChange={(e) => handleChange('hero_title_tr', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Alt Başlık</label>
                          <textarea
                            value={settings.hero_subtitle_tr}
                            onChange={(e) => handleChange('hero_subtitle_tr', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div>
                        <ImageUploader
                          label="Hero Görseli (Sağ)"
                          currentImage={settings.hero_image_url}
                          onUpload={(url) => handleChange('hero_image_url', url)}
                          folderName="hero"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Statement */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Statement (Vurgu) Alanı</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Vurgu Başlığı</label>
                          <input
                            type="text"
                            value={settings.statement_title_tr}
                            onChange={(e) => handleChange('statement_title_tr', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Vurgu Açıklaması</label>
                          <textarea
                            value={settings.statement_desc_tr}
                            onChange={(e) => handleChange('statement_desc_tr', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div>
                        <ImageUploader
                          label="Vurgu Görseli (Sol)"
                          currentImage={settings.statement_image_url}
                          onUpload={(url) => handleChange('statement_image_url', url)}
                          folderName="statement"
                        />
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                {/* Sosyal Medya */}
                <Tab.Panel className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 outline-none animate-fadeIn">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Sosyal Medya Bağlantıları</h2>
                  </div>
                  <div className="space-y-4">
                    {['facebook', 'instagram', 'twitter'].map((platform) => (
                      <div key={platform}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{platform}</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3.5 text-gray-400">https://</span>
                          <input
                            type="url"
                            value={(settings as any)[platform]}
                            onChange={(e) => handleChange(platform, e.target.value)}
                            className="w-full pl-20 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            placeholder={`${platform}.com/solenza`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </div>
        </Tab.Group>
      </form>
    </div>
  )
}
