'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Product, Category } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category_id: '',
    price: '',
    original_price: '',
    show_price: true,
    status: 'active' as 'active' | 'inactive',
    stock_status: 'in_stock' as 'in_stock' | 'out_of_stock' | 'pre_order',
    stock_quantity: '',
    show_on_homepage: false,
    is_featured: false,
    is_new: false,
    is_bestseller: false,
    title_tr: '',
    title_en: '',
    description_tr: '',
    description_en: '',
    specs_tr: '',
    specs_en: '',
    color: '',
    colors: [] as string[],
    dimensions: '',
    material: '',
    weight: '',
    brand: '',
    sku: '',
    warranty_months: '24',
  })
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)
  const [draggedExistingIndex, setDraggedExistingIndex] = useState<number | null>(null)
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    price: false,
    stock: false,
    details: false,
    images: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await loadCategories()
    await loadProducts()
  }

  const loadCategories = async () => {
    const { data: cats, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error(`Kategoriler yüklenemedi: ${error.message}`)
      return
    }

    if (cats) {
      setCategories(cats as any)
    }
  }

  const loadProducts = async () => {
    const { data: prods, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error(`Ürünler yüklenemedi: ${error.message}`)
      return
    }

    if (prods) {
      setProducts(prods as any)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let productId = editId

      if (editId) {
        // Update existing product
        const { error: productError } = await supabase
          .from('products')
          .update({
            category_id: formData.category_id || null,
            title_tr: formData.title_tr,
            title_en: formData.title_en,
            description_tr: formData.description_tr,
            description_en: formData.description_en,
            specs_tr: formData.specs_tr,
            specs_en: formData.specs_en,
            price: formData.price ? parseFloat(formData.price) : null,
            show_price: formData.show_price,
            status: formData.status,
            show_on_homepage: formData.show_on_homepage,
          })
          .eq('id', editId)

        if (productError) throw productError
      } else {
        // Create new product
        const productData = {
            category_id: formData.category_id || null,
            title_tr: formData.title_tr,
            title_en: formData.title_en,
            description_tr: formData.description_tr,
            description_en: formData.description_en,
            specs_tr: formData.specs_tr,
            specs_en: formData.specs_en,
            price: formData.price ? parseFloat(formData.price) : null,
            show_price: formData.show_price,
          status: formData.status || 'active', // Default olarak 'active' yap
            show_on_homepage: formData.show_on_homepage,
        }
        
        console.log('Ürün oluşturuluyor:', productData)
        
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()

        if (productError) {
          console.error('Ürün oluşturma hatası:', productError)
          throw productError
        }
        if (!product) throw new Error('Ürün oluşturulamadı')
        
        console.log('Ürün başarıyla oluşturuldu:', product)
        productId = product.id
      }

      // Upload images to Supabase Storage
      if (images.length > 0) {
        // Get max sort_order for existing images
        const { data: existingImgs } = await supabase
          .from('product_images')
          .select('sort_order')
          .eq('product_id', productId)
          .order('sort_order', { ascending: false })
          .limit(1)

        let nextSortOrder = 0
        if (existingImgs && existingImgs.length > 0 && existingImgs[0].sort_order !== null) {
          nextSortOrder = (existingImgs[0].sort_order as number) + 1
        }

        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`
          
          try {
            // Upload to storage
            const { error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(fileName, file)

            if (uploadError) {
              toast.error(`Görsel yüklenemedi: ${file.name}`)
              console.error(uploadError)
              continue
            }

            // Get public URL
            const { data: urlData } = supabase.storage
              .from('product-images')
              .getPublicUrl(fileName)

            const publicUrl = urlData.publicUrl

            // Insert into product_images table with sort_order
            const { error: imageError } = await supabase
              .from('product_images')
              .insert({
                product_id: productId,
                image_url: publicUrl,
                sort_order: nextSortOrder + i,
              })

            if (imageError) {
              toast.error(`Görsel kaydedilemedi: ${file.name}`)
              console.error(imageError)
            }
          } catch (err: any) {
            toast.error(`Görsel işlenemedi: ${file.name}`)
            console.error(err)
          }
        }
      }

      toast.success(editId ? 'Ürün güncellendi!' : 'Ürün başarıyla kaydedildi!')
      
      // Reload product images if editing
      if (editId) {
        await loadProductImages(editId)
      }
      
      resetForm()
      loadData()
    } catch (error: any) {
      toast.error(`Ürün kaydedilemedi: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const loadProductImages = async (productId: string) => {
    const { data: imgs, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Görseller yüklenemedi:', error)
      return
    }

    if (imgs) {
      setExistingImages(imgs)
    }
  }

  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId)

      if (dbError) throw dbError

      // Try to delete from storage (extract path from URL)
      const urlParts = imageUrl.split('/product-images/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        await supabase.storage
          .from('product-images')
          .remove([filePath])
      }

      toast.success('Görsel silindi!')
      if (editId) {
        loadProductImages(editId)
      }
    } catch (error: any) {
      toast.error(`Görsel silinemedi: ${error.message}`)
    }
  }

  const handleEdit = async (product: any) => {
    setEditId(product.id)
    setFormData({
      category_id: product.category_id || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      show_price: product.show_price,
      status: product.status,
      stock_status: product.stock_status || 'in_stock',
      stock_quantity: product.stock_quantity?.toString() || '',
      show_on_homepage: product.show_on_homepage || false,
      is_featured: product.is_featured || false,
      is_new: product.is_new || false,
      is_bestseller: product.is_bestseller || false,
      title_tr: product.title_tr,
      title_en: product.title_en,
      description_tr: product.description_tr || '',
      description_en: product.description_en || '',
      specs_tr: product.specs_tr || '',
      specs_en: product.specs_en || '',
      color: product.color || '',
      colors: product.colors || [],
      dimensions: product.dimensions || '',
      material: product.material || '',
      weight: product.weight?.toString() || '',
      brand: product.brand || '',
      sku: product.sku || '',
      warranty_months: product.warranty_months?.toString() || '24',
    })
    await loadProductImages(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)

      if (error) throw error

      toast.success('Ürün silindi!')
      loadData()
    } catch (error: any) {
      toast.error(`Ürün silinemedi: ${error.message}`)
    }
  }

  const handleDeleteAll = async () => {
    if (products.length === 0) {
      toast.error('Silinecek ürün bulunamadı!')
      return
    }

    const firstConfirm = confirm(`Tüm ürünleri (${products.length} adet) silmek istediğinize emin misiniz?`)
    if (!firstConfirm) return

    const secondConfirm = confirm('⚠️ DİKKAT: Bu işlem geri alınamaz! Tüm ürünler kalıcı olarak silinecek. Devam etmek istiyor musunuz?')
    if (!secondConfirm) return

    try {
      // Önce tüm ürün görsellerini sil
      for (const product of products) {
        const { data: images } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', (product as any).id)

        if (images && images.length > 0) {
          for (const img of images) {
            if (img.image_url) {
              const urlParts = img.image_url.split('/product-images/')
              if (urlParts && urlParts.length > 1) {
                const filePath = urlParts[1]
                await supabase.storage
                  .from('product-images')
                  .remove([filePath])
              }
            }
          }
        }
      }

      // Tüm ürün ID'lerini topla
      const productIds = products.map(p => (p as any).id)
      
      // Tüm ürünleri sil (cascade ile görseller de silinir)
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', productIds)

      if (error) throw error

      toast.success(`Tüm ürünler (${products.length} adet) başarıyla silindi!`)
      loadData()
    } catch (error: any) {
      toast.error(`Ürünler silinemedi: ${error.message}`)
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditId(null)
    setFormData({
      category_id: '',
      price: '',
      original_price: '',
      show_price: true,
      status: 'active',
      stock_status: 'in_stock',
      stock_quantity: '',
      show_on_homepage: false,
      is_featured: false,
      is_new: false,
      is_bestseller: false,
      title_tr: '',
      title_en: '',
      description_tr: '',
      description_en: '',
      specs_tr: '',
      specs_en: '',
      color: '',
      colors: [],
      dimensions: '',
      material: '',
      weight: '',
      brand: '',
      sku: '',
      warranty_months: '24',
    })
    setImages([])
    setImagePreviews([])
    setExistingImages([])
  }

  // Handle file selection with preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Create previews using Promise.all
    Promise.all(
      files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            resolve(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        })
      })
    ).then(previews => {
      setImages([...images, ...files])
      setImagePreviews([...imagePreviews, ...previews])
    })

    // Reset input
    e.target.value = ''
  }

  // Remove new image
  const handleRemoveNewImage = (index: number) => {
    const newImages = [...images]
    const newPreviews = [...imagePreviews]
    newImages.splice(index, 1)
    newPreviews.splice(index, 1)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  // Drag and drop handlers for new images
  const handleDragStartNew = (index: number) => {
    setDraggedImageIndex(index)
  }

  const handleDragOverNew = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDropNew = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedImageIndex === null) return

    const newImages = [...images]
    const newPreviews = [...imagePreviews]
    const draggedImage = newImages[draggedImageIndex]
    const draggedPreview = newPreviews[draggedImageIndex]

    newImages.splice(draggedImageIndex, 1)
    newPreviews.splice(draggedImageIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    newPreviews.splice(dropIndex, 0, draggedPreview)

    setImages(newImages)
    setImagePreviews(newPreviews)
    setDraggedImageIndex(null)
  }

  // Drag and drop handlers for existing images
  const handleDragStartExisting = (index: number) => {
    setDraggedExistingIndex(index)
  }

  const handleDragOverExisting = (e: React.DragEvent, index: number) => {
    e.preventDefault()
  }

  const handleDropExisting = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedExistingIndex === null || !editId) return

    const newImages = [...existingImages]
    const draggedImage = newImages[draggedExistingIndex]

    newImages.splice(draggedExistingIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)

    setExistingImages(newImages)
    setDraggedExistingIndex(null)

    // Update sort_order in database
    try {
      const updates = newImages.map((img, idx) => ({
        id: img.id,
        sort_order: idx,
      }))

      for (const update of updates) {
        await supabase
          .from('product_images')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      }

      toast.success('Görsel sırası güncellendi!')
    } catch (error: any) {
      toast.error(`Sıralama güncellenemedi: ${error.message}`)
      // Reload to revert
      loadProductImages(editId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card - Premium */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🛋️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Ürünler</h1>
              <p className="text-white/80 text-sm mt-1">Ürünleri yönetin ve yeni ürün ekleyin</p>
            </div>
          </div>
          <div className="flex gap-3">
            {products.length > 0 && (
            <button
                onClick={handleDeleteAll}
                className="px-5 py-3 bg-red-600/90 backdrop-blur-sm text-white rounded-2xl hover:bg-red-700 transition-all font-semibold shadow-lg hover:scale-105"
              >
                🗑️ Hepsini Sil ({products.length})
              </button>
            )}
            <button
              onClick={loadData}
              className="px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all font-semibold shadow-lg hover:scale-105"
            >
              🔄 Yenile
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                showForm 
                  ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' 
                  : 'bg-white text-green-700 hover:bg-gray-50'
              }`}
            >
              {showForm ? '✕ İptal' : '+ Yeni Ürün'}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          {/* Temel Bilgiler */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Temel Bilgiler</h3>
            
            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (TR) *</label>
                <input
                  type="text"
                  value={formData.title_tr}
                  onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Modern Koltuk Takımı"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı (EN) *</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Modern Sofa Set"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_tr || 'İsimsiz'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fiyat - Accordion */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedSections({ ...expandedSections, price: !expandedSections.price })}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">💰 Fiyat Bilgileri</span>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.price && (
              <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (₺)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="9999.99"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Eski Fiyat (₺)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="12999.99"
                />
              </div>
              <div className="flex items-end">
                    <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_price}
                    onChange={(e) => setFormData({ ...formData, show_price: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                  />
                      <span className="text-sm text-gray-700">Fiyat Göster</span>
                </label>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* Stok - Accordion */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedSections({ ...expandedSections, stock: !expandedSections.stock })}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">📦 Stok & Durum</span>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.stock ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.stock && (
              <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok Durumu</label>
                <select
                  value={formData.stock_status}
                  onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="in_stock">Stokta Var</option>
                      <option value="out_of_stock">Stokta Yok</option>
                      <option value="pre_order">Ön Sipariş</option>
                </select>
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stok Miktarı</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Durumu</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                </select>
              </div>
            </div>
              </div>
            )}
          </div>

          {/* Detaylar - Accordion */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedSections({ ...expandedSections, details: !expandedSections.details })}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">📝 Açıklama & Detaylar</span>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.details ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.details && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama (TR)</label>
                    <textarea
                      value={formData.description_tr}
                      onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={4}
                      placeholder="Ürün açıklaması..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                    <textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={4}
                      placeholder="Product description..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Özellikler (TR)</label>
                    <textarea
                      value={formData.specs_tr}
                      onChange={(e) => setFormData({ ...formData, specs_tr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                      placeholder="Boyutlar, malzeme, renk..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (EN)</label>
                    <textarea
                      value={formData.specs_en}
                      onChange={(e) => setFormData({ ...formData, specs_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      rows={3}
                      placeholder="Dimensions, material, color..."
                    />
                  </div>
                </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Renk</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Gri, Beyaz, Siyah"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Malzeme</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Ahşap, Kumaş, Deri"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Boyutlar</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="200x150x80 cm"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Solenza"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                  placeholder="SOL-2024-001"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Garanti (Ay)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.warranty_months}
                  onChange={(e) => setFormData({ ...formData, warranty_months: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="24"
                />
              </div>
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ağırlık (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="45.5"
                />
              </div>
            </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.show_on_homepage}
                  onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                    <span className="text-sm text-gray-700">Ana Sayfa</span>
              </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                    <span className="text-sm text-gray-700">Öne Çıkan</span>
              </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                    <span className="text-sm text-gray-700">Yeni Ürün</span>
              </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_bestseller}
                  onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                    <span className="text-sm text-gray-700">Çok Satan</span>
              </label>
            </div>
          </div>
            )}
          </div>

          {/* Görseller - Accordion */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedSections({ ...expandedSections, images: !expandedSections.images })}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">🖼️ Görseller</span>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.images ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.images && (
              <div className="p-4 space-y-6">
                {/* Existing Images - Draggable */}
                {existingImages.length > 0 && (
            <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">Mevcut Görseller ({existingImages.length})</p>
                      <p className="text-xs text-gray-500">Sürükle-bırak ile sıralayın</p>
            </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {existingImages.map((img, index) => (
                        <div
                          key={img.id}
                          draggable
                          onDragStart={() => handleDragStartExisting(index)}
                          onDragOver={(e) => handleDragOverExisting(e, index)}
                          onDrop={(e) => handleDropExisting(e, index)}
                          className={`relative group cursor-move ${
                            draggedExistingIndex === index ? 'opacity-50' : ''
                          }`}
                        >
                          <div className="relative">
                      <img
                        src={img.image_url}
                              alt={`Görsel ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-300 hover:border-red-500 transition-all"
                      />
                            <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                              {index + 1}
                            </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id, img.image_url)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 text-xs"
                        title="Görseli sil"
                      >
                        ✕
                      </button>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <span className="text-white text-xs font-semibold">Sürükle</span>
                          </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

                {/* New Images Upload Area */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Yeni Görseller</p>
                    {images.length > 0 && (
                      <p className="text-xs text-gray-500">Sürükle-bırak ile sıralayın</p>
                    )}
                  </div>
                  
                  {/* File Input */}
                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Görselleri seçin</span> veya sürükleyip bırakın
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                      </div>
            <input
              type="file"
              accept="image/*"
              multiple
                        onChange={handleFileChange}
                        className="hidden"
            />
                    </label>
                  </div>
            
                  {/* New Images Preview - Draggable */}
            {images.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 mb-2">
                        {images.length} görsel seçildi - Sıralama: Yüklenme sırası
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                        {images.map((file, index) => (
                          <div
                            key={index}
                            draggable
                            onDragStart={() => handleDragStartNew(index)}
                            onDragOver={(e) => handleDragOverNew(e, index)}
                            onDrop={(e) => handleDropNew(e, index)}
                            className={`relative group cursor-move ${
                              draggedImageIndex === index ? 'opacity-50' : ''
                            }`}
                          >
                            <div className="relative">
                              <img
                                src={imagePreviews[index] || (typeof window !== 'undefined' ? URL.createObjectURL(file) : '')}
                                alt={`Önizleme ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-300 hover:border-red-500 transition-all"
                              />
                              <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                {index + 1}
                    </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveNewImage(index)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 text-xs"
                                title="Görseli kaldır"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <span className="text-white text-xs font-semibold">Sürükle</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate" title={file.name}>
                              {file.name.length > 12 ? `${file.name.substring(0, 12)}...` : file.name}
                            </p>
                  </div>
                ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={uploading}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              uploading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
              {uploading ? '⏳ Yükleniyor...' : '💾 Kaydet'}
          </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ürün Adı</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fiyat</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(product => {
              const category = categories.find((c: any) => c.id === product.category_id)
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-dark">{(product as any).title_tr}</td>
                  <td className="px-6 py-4 text-gray-600">{(category as any)?.name_tr || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {(product as any).show_price && (product as any).price ? `₺${(product as any).price.toLocaleString()}` : 'Gizli'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      (product as any).status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {(product as any).status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-[#b40019] hover:text-[#8f0014] font-medium transition-colors"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete((product as any).id)}
                      className="text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      🗑️ Sil
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
