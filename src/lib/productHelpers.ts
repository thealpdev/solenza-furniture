import { supabase } from "@/lib/supabase"

export type ProductWithImage = {
  id: string
  title_tr: string
  title_en: string
  description_tr: string
  description_en: string
  specs_tr: string
  specs_en: string
  price: number | null
  show_price: boolean
  status: string
  category_id: string | null
  show_on_homepage: boolean
  created_at: string
  firstImage: string | null
}

export async function getProductsWithImages(limit?: number): Promise<ProductWithImage[]> {
  let query = supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Failed to load products:", error.message)
    return []
  }

  return (data || []).map((p: any) => ({
    ...p,
    firstImage: p.product_images?.[0]?.image_url ?? null,
  }))
}

export async function getProductsByCategoryWithImages(categoryId: string): Promise<ProductWithImage[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("category_id", categoryId)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to load products:", error.message)
    return []
  }

  return (data || []).map((p: any) => ({
    ...p,
    firstImage: p.product_images?.[0]?.image_url ?? null,
  }))
}
