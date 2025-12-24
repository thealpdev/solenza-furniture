'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';

type Category = {
  id: number;
  name_tr: string | null;
  name_en: string | null;
  slug: string | null;
  image_url: string | null;
  created_at: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name_tr: '',
    name_en: '',
    slug: '',
    image_url: '',
  });
  const [error, setError] = useState('');

  // ilk yüklemede kategorileri çek
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCategories(data as Category[]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // slug boşsa TR adından üret
    const finalSlug =
      formData.slug.trim() !== ''
        ? formData.slug.trim()
        : formData.name_tr.toLowerCase().replace(/\s+/g, '-');

    if (editingId) {
      // GÜNCELLE
      const { error } = await supabase
        .from('categories')
        .update({
          name_tr: formData.name_tr,
          name_en: formData.name_en,
          slug: finalSlug,
          image_url: formData.image_url,
        })
        .eq('id', editingId);

      if (error) {
        setError(error.message);
        return;
      }
    } else {
      // YENİ EKLE
      const { error } = await supabase.from('categories').insert([
        {
          name_tr: formData.name_tr,
          name_en: formData.name_en,
          slug: finalSlug,
          image_url: formData.image_url,
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }
    }

    // formu sıfırla
    setFormData({
      name_tr: '',
      name_en: '',
      slug: '',
      image_url: '',
    });
    setEditingId(null);
    loadCategories();
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({
      name_tr: cat.name_tr || '',
      name_en: cat.name_en || '',
      slug: cat.slug || '',
      image_url: cat.image_url || '',
    });
  };

  const handleDelete = async (id: number) => {
    const ok = confirm('Bu kategoriyi silmek istediğine emin misin?');
    if (!ok) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      setError(error.message);
      toast.error(`Kategori silinemedi: ${error.message}`);
      return;
    }
    toast.success('Kategori silindi!');
    loadCategories();
  };

  const handleDeleteAll = async () => {
    if (categories.length === 0) {
      toast.error('Silinecek kategori bulunamadı!');
      return;
    }

    const firstConfirm = confirm(`Tüm kategorileri (${categories.length} adet) silmek istediğinize emin misiniz?`);
    if (!firstConfirm) return;

    const secondConfirm = confirm('⚠️ DİKKAT: Bu işlem geri alınamaz! Tüm kategoriler kalıcı olarak silinecek. Devam etmek istiyor musunuz?');
    if (!secondConfirm) return;

    try {
      // Tüm kategori ID'lerini topla
      const categoryIds = categories.map(cat => cat.id);

      // Tüm kategorileri sil
      const { error } = await supabase
        .from('categories')
        .delete()
        .in('id', categoryIds);

      if (error) throw error;

      toast.success(`Tüm kategoriler (${categories.length} adet) başarıyla silindi!`);
      loadCategories();
    } catch (error: any) {
      toast.error(`Kategoriler silinemedi: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📂</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Kategoriler</h1>
              <p className="text-white/80 text-sm mt-1">Ürün kategorilerini yönetin</p>
            </div>
          </div>
          {categories.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="px-5 py-3 bg-red-600/90 backdrop-blur-sm text-white rounded-2xl hover:bg-red-700 transition-all font-semibold shadow-lg hover:scale-105"
            >
              🗑️ Hepsini Sil ({categories.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Card - Premium */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b-2 border-blue-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">{editingId ? '✏️' : '➕'}</span>
              </div>
              {editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kategori Adı (Türkçe) *
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                value={formData.name_tr}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name_tr: e.target.value }))
                }
                placeholder="Örn: Koltuk Takımları"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Kategori Adı (İngilizce)
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                value={formData.name_en}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name_en: e.target.value }))
                }
                placeholder="Ex: Sofa Sets"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                URL Slug (Opsiyonel)
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-mono text-sm"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="koltuk-takimlari"
              />
              <p className="text-xs text-gray-500 mt-2">Boş bırakırsanız otomatik oluşturulur</p>
            </div>

            <div>
              <ImageUploader
                label="Kategori Görseli"
                currentImage={(formData as any).image_url}
                onUpload={(url) => setFormData((prev) => ({ ...prev, image_url: url } as any))}
                folderName="categories"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                <p className="text-red-700 text-sm font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3.5 rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {editingId ? '✓ Güncelle' : '+ Kaydet'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name_tr: '', name_en: '', slug: '' });
                  }}
                  className="px-6 py-3.5 rounded-2xl border-2 border-gray-300 hover:bg-gray-50 transition-all font-bold"
                >
                  İptal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Card - Premium */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b-2 border-green-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">📋</span>
                </div>
                Mevcut Kategoriler
              </h2>
              <span className="px-3 py-1.5 bg-green-200 text-green-800 rounded-full text-xs font-bold">
                {categories.length} Kategori
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {categories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-gray-500 font-medium">Henüz kategori eklenmemiş</p>
                <p className="text-sm text-gray-400 mt-2">Sol taraftan yeni kategori ekleyebilirsiniz</p>
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`group relative border-2 rounded-2xl p-4 transition-all ${editingId === cat.id
                    ? 'border-blue-300 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 relative group-hover:border-blue-300 transition-colors">
                        {cat.image_url ? (
                          <img src={cat.image_url} alt={cat.name_tr || ''} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                            <span className="text-2xl">🖼️</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-900">{cat.name_tr}</h3>
                        </div>
                        {cat.name_en && (
                          <p className="text-sm text-gray-600 mb-1">🌐 {cat.name_en}</p>
                        )}
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
                          /{cat.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all group-hover:scale-110"
                        title="Düzenle"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all group-hover:scale-110"
                        title="Sil"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
