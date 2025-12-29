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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">✨</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Kampanya Yönetimi</h1>
              <p className="text-white/80 mt-1">Özel teklifler, evlilik paketleri ve sezonluk indirimler oluşturun</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${showForm
                ? 'bg-white/20 backdrop-blur-md hover:bg-white/30 text-white'
                : 'bg-white text-indigo-600 hover:bg-gray-50'
              }`}
          >
            {showForm ? '✕ İptal' : '+ Yeni Kampanya Oluştur'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 animate-fadeIn">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900">Kampanya Detayları</h2>
            <p className="text-gray-500 text-sm">Yeni bir kampanya veya paket paketi oluşturun</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Kampanya Başlığı (TR) 🇹🇷</label>
                <input
                  type="text"
                  value={formData.title_tr}
                  onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="Örn: 2024 Evlilik Paketi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Campaign Title (EN) 🇬🇧</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="Ex: 2024 Wedding Package"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={formData.show_on_homepage}
                  onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label className="text-sm font-semibold text-gray-900">Bu kampanyayı ana sayfada göster</label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Açıklama (TR) 🇹🇷</label>
                <textarea
                  value={formData.description_tr}
                  onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  rows={4}
                  placeholder="Paket içeriği ve detaylar..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description (EN) 🇬🇧</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  rows={4}
                  placeholder="Package details..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Kampanya Görseli</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="mt-2 text-xs text-gray-500">Önerilen boyut: 1200x600px. JPG, PNG formatları.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-200"
            >
              💾 Kampanyayı Kaydet
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Aktif Kampanyalar</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kampanya</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Süre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                    <h3 className="text-lg font-bold text-gray-900">Henüz kampanya yok</h3>
                    <p className="text-gray-500 mt-1">Yeni bir kampanya oluşturarak başlayın.</p>
                  </td>
                </tr>
              ) : (
                campaigns.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {campaign.image_url ? (
                          <img src={campaign.image_url} alt="" className="w-16 h-12 object-cover rounded-lg shadow-sm" />
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <span className="text-xs">No Img</span>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{campaign.translations.tr?.title}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{campaign.translations.tr?.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <p><span className="text-xs text-gray-400">Başlangıç:</span> {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString('tr-TR') : '-'}</p>
                        <p><span className="text-xs text-gray-400">Bitiş:</span> {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString('tr-TR') : '-'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${campaign.show_on_homepage
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                        }`}>
                        {campaign.show_on_homepage ? '🟢 Yayında' : '⚪ Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(campaign)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
