export type Language = 'tr' | 'en'

export interface Category {
  id: string
  slug: string
  image_url: string | null
  created_at: string
  translations: {
    tr?: { name: string; description?: string }
    en?: { name: string; description?: string }
  }
}

export interface Product {
  id: string
  category_id: string | null
  price: number | null
  show_price: boolean
  status: 'active' | 'inactive'
  created_at: string
  translations: {
    tr?: { title: string; description?: string; specs?: string }
    en?: { title: string; description?: string; specs?: string }
  }
  images: ProductImage[]
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
}

export interface Campaign {
  id: string
  image_url: string | null
  start_date: string | null
  end_date: string | null
  show_on_homepage: boolean
  created_at: string
  translations: {
    tr?: { title: string; description?: string }
    en?: { title: string; description?: string }
  }
}

export interface Settings {
  [key: string]: string
}
