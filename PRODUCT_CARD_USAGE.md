# ProductCard Component Usage

## Component Features

✅ **Mini Image Slider** - Click dots to switch between product images
✅ **Responsive Dots** - Shows dots only when product has multiple images
✅ **Active Dot Indicator** - Current image dot is highlighted in red and wider
✅ **No Image Placeholder** - Shows "No Image" when product has no images
✅ **Turkish Labels** - All UI text in Turkish
✅ **Hover Effects** - Card shadow increases on hover
✅ **Red Theme** - Uses #b40019 brand color

## Component Props

```typescript
type ProductImage = {
  id: number
  image_url: string
}

type ProductCardProps = {
  id: number          // Product ID
  title_tr: string    // Product title in Turkish
  price: number       // Product price
  images: ProductImage[]  // Array of product images
}
```

## Usage Example

### In a Product List Page

```tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ProductCard } from "@/components/ProductCard"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .order("created_at", { ascending: false })

    if (data) {
      setProducts(data)
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Ürünler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            title_tr={p.title_tr}
            price={p.price}
            images={p.product_images ?? []}
          />
        ))}
      </div>
    </div>
  )
}
```

### In Homepage

```tsx
"use client"

import { ProductCard } from "@/components/ProductCard"

export default function HomePage() {
  // ... your data fetching logic

  return (
    <main>
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6">Popüler Ürünler</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              title_tr={p.title_tr}
              price={p.price}
              images={p.product_images ?? []}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
```

### With TypeScript Types

```tsx
import { ProductCard } from "@/components/ProductCard"

type Product = {
  id: number
  title_tr: string
  price: number
  product_images: Array<{
    id: number
    image_url: string
  }>
}

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title_tr={product.title_tr}
          price={product.price}
          images={product.product_images}
        />
      ))}
    </div>
  )
}
```

## Component Behavior

### Image Slider
- **Single Image**: No dots shown, just displays the image
- **Multiple Images**: Dots appear at bottom, click to switch images
- **No Images**: Shows gray placeholder with "No Image" text

### Dots Styling
- **Inactive Dot**: Small white circle with 70% opacity
- **Active Dot**: Red (#b40019) elongated pill shape
- **Hover**: White dots become fully opaque on hover

### Buttons
- **Detay**: Links to `/urun/[id]` (product detail page)
- **Sepete Ekle**: Button ready for cart functionality

## Styling Details

- **Card**: `rounded-3xl` with light border and shadow
- **Image Area**: 4:3 aspect ratio
- **Badges**: Blue for "KARGO BEDAVA", Orange for "SON 3 ADET"
- **Price**: Red (#b40019) color, bold, with ₺ symbol
- **Buttons**: Red theme with hover effects

## Grid Layouts

### Desktop (4 columns)
```tsx
<div className="grid grid-cols-4 gap-6">
  {products.map(p => <ProductCard {...p} />)}
</div>
```

### Responsive (2 on mobile, 4 on desktop)
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
  {products.map(p => <ProductCard {...p} />)}
</div>
```

### Responsive (1-3-4 columns)
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map(p => <ProductCard {...p} />)}
</div>
```

## Customization

### Change Link Route
Update the Link href in the component:
```tsx
<Link href={`/products/${id}`}>  // Change from /urun/ to /products/
```

### Add to Cart Handler
Add onClick handler to the button:
```tsx
<button onClick={() => handleAddToCart(id)}>
  Sepete Ekle
</button>
```

### Hide Badges
Remove or conditionally render the badges section:
```tsx
{showBadges && (
  <div className="flex gap-2 flex-wrap">
    {/* badges */}
  </div>
)}
```

## Notes

- Component is marked as `"use client"` for React state management
- Uses Next.js Image component for optimized images
- Images use `fill` prop with `object-cover` for proper sizing
- Price is formatted with Turkish locale: `toLocaleString("tr-TR")`
- All text is in Turkish as per requirements
