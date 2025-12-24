// Get the first image URL from a product's images array
// Images are stored with full public URL in the database
export const getFirstProductImage = (product: any): string | null => {
  if (Array.isArray(product.product_images) && product.product_images.length > 0) {
    return product.product_images[0].image_url
  }
  return null
}

// Get all image URLs from a product
export const getAllProductImages = (product: any): string[] => {
  if (Array.isArray(product.product_images) && product.product_images.length > 0) {
    return product.product_images.map((img: any) => img.image_url)
  }
  return []
}
