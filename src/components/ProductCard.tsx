"use client";

import React, { useState } from "react";
import Link from "next/link";

type ProductImage = {
  id: string; // Standardized to UUID string
  image_url: string;
};

type Product = {
  id: string; // Standardized to UUID string
  title_tr: string;
  price: number;
  product_images?: ProductImage[];
  created_at?: string;
  category_id?: string;
};

interface ProductCardProps {
  product: Product;
  className?: string; // Allow custom classes for spacing/grid
  variant?: 'default' | 'large' | 'wide'; // For controlling internal layout/aspect ratio
}

export default function ProductCard({ product, className = '', variant = 'default' }: ProductCardProps) {
  const images = product.product_images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const activeImage =
    images.length > 0 && images[activeIndex]
      ? images[activeIndex].image_url
      : "";

  // Dummy logic for badges - normally would come from DB
  const isNew = product.created_at && new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
  const isSale = false; // Placeholder

  return (
    <div
      className={`group relative flex flex-col h-full bg-transparent ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area - Dynamic Aspect Ratio */}
      <div className={`relative w-full overflow-hidden mb-4 bg-[#f4f4f4] ${variant === 'large' ? 'aspect-[4/5]' :
        variant === 'wide' ? 'aspect-[16/9]' :
          'aspect-[3/4]'
        }`}>
        {activeImage ? (
          <>
            <img
              src={activeImage}
              alt={product.title_tr}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            />

            {/* Dark Gradient Overlay on Hover for better contrast */}
            <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && <span className="bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black">Yeni</span>}
              {isSale && <span className="bg-primary text-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">İndirim</span>}
            </div>

            {/* Float Actions */}
            <div className={`absolute bottom-4 right-4 flex flex-col gap-2 transition-all duration-300 transform ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <button
                onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
                className={`w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-primary text-white' : 'bg-white/90 text-black hover:bg-black hover:text-white'}`}
                title="Favorilere Ekle"
              >
                <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-black hover:bg-black hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50">
            <span className="text-[10px] uppercase tracking-widest">Görsel Yok</span>
          </div>
        )}
      </div>

      {/* Content Area - Minimalist Left Aligned */}
      <div className="flex flex-col items-start w-full px-1">
        <h3 className="font-serif text-lg leading-tight text-gray-900 mb-1 group-hover:text-primary transition-colors duration-300">
          <Link href={`/products/${product.id}`}>
            {product.title_tr}
          </Link>
        </h3>

        {/* Price & Details */}
        <div className="w-full flex items-center justify-between mt-1 border-t border-transparent group-hover:border-gray-100 transition-colors pt-2">
          <div className="text-sm font-sans font-medium text-gray-900">
            {product.price && product.price > 0 ? (
              <span>₺{product.price.toLocaleString("tr-TR")}</span>
            ) : (
              <span className="text-gray-400 text-xs uppercase">Fiyat Sorunuz</span>
            )}
          </div>

          {/* Hidden "Add to Cart" or Arrow that appears on hover could go here, 
               but user removed cart. Maybe just a subtle arrow. */}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
