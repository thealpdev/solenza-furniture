'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Campaign } from '@/types'

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title_tr: '',
    title_en: '',
    description_tr: '',
    description_en: '',
    start_date: '',
    end_date: '',
    show_on_homepage: false,
    image: null as File | null,
  })

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*, campaign_translations(*)')
      .order('created_at', { ascending: false })

    if (data) {
      const formatted = data.map(camp => ({
        ...camp,
        translations: {
          tr: camp.campaign_translations.find((t: any) => t.lang === 'tr'),
          en: camp.campaign_translations.find((t: any) => t.lang === 'en'),
        },
      }))
      setCampaigns(formatted)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      let imageUrl = null

      if (formData.image) {
        const fileName = `${Date.now()}_${formData.image.name}`
        const { error: uploadError } = await supabase.storage
          .from('campaigns')
          .upload(fileName, formData.image)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('campaigns')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      let campaignId = editId

      if (editId) {
        await supabase
          .from('campaigns')
          .update({
            image_url: imageUrl,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            show_on_homepage: formData.show_on_homepage,
          })
          .eq('id', editId)

        await supabase.from('campaign_translations').delete().eq('campaign_id', editId)
      } else {
        const { data: camp } = await supabase
          .from('campaigns')
          .insert({
            image_url: imageUrl,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            show_on_homepage: formData.show_on_homepage,
          })
          .select()
          .single()

        if (!camp) throw new Error('Failed to create campaign')
        campaignId = camp.id
      }

      await supabase.from('campaign_translations').insert([
        {
          campaign_id: campaignId,
          lang: 'tr',
          title: formData.title_tr,
          description: formData.description_tr,
        },
        {
          campaign_id: campaignId,
          lang: 'en',
          title: formData.title_en,
          description: formData.description_en,
        },
      ])

      toast.success('Kampanya kaydedildi!')
      resetForm()
      loadCampaigns()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleEdit = (campaign: Campaign) => {
    setEditId(campaign.id)
    setFormData({
      title_tr: campaign.translations.tr?.title || '',
      title_en: campaign.translations.en?.title || '',
      description_tr: campaign.translations.tr?.description || '',
      description_en: campaign.translations.en?.description || '',
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
      show_on_homepage: campaign.show_on_homepage,
      image: null,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) return

    const { error } = await supabase.from('campaigns').delete().eq('id', id)

    if (error) {
      toast.error(`Kampanya silinemedi: ${error.message}`)
    } else {
      toast.success('Kampanya silindi!')
      loadCampaigns()
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditId(null)
    setFormData({
      title_tr: '',
      title_en: '',
      description_tr: '',
      description_en: '',
      start_date: '',
      end_date: '',
      show_on_homepage: false,
      image: null,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Kampanyalar</h1>
              <p className="text-white/80 text-sm mt-1">Kampanyaları yönetin ve yeni kampanya ekleyin</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              showForm 
                ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' 
                : 'bg-white text-purple-700 hover:bg-gray-50'
            }`}
          >
            {showForm ? '✕ İptal' : '+ Yeni Kampanya'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Başlık (TR) 🇹🇷</label>
              <input
                type="text"
                value={formData.title_tr}
                onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Yeni Yıl Kampanyası"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Title (EN) 🇬🇧</label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="New Year Campaign"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Açıklama (TR) 🇹🇷</label>
              <textarea
                value={formData.description_tr}
                onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Kampanya açıklaması..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description (EN) 🇬🇧</label>
              <textarea
                value={formData.description_en}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows={4}
                placeholder="Campaign description..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Başlangıç Tarihi</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Bitiş Tarihi</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Görsel</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.show_on_homepage}
              onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label className="text-sm font-semibold text-gray-900">Ana sayfada göster</label>
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            💾 Kampanyayı Kaydet
          </button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlık</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Başlangıç</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bitiş</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ana Sayfa</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-500 font-medium">Henüz kampanya eklenmemiş</p>
                </td>
              </tr>
            ) : (
              campaigns.map(campaign => (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{campaign.translations.tr?.title}</td>
                  <td className="px-6 py-4 text-gray-600">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString('tr-TR') : '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('tr-TR') : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.show_on_homepage ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.show_on_homepage ? 'Evet' : 'Hayır'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      🗑️ Sil
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
