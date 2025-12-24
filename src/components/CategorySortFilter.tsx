'use client';

import React from 'react';

interface CategorySortFilterProps {
    currentSort: string;
    onSortChange: (value: string) => void;
    productCount: number;
}

export default function CategorySortFilter({ currentSort, onSortChange, productCount }: CategorySortFilterProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-4 border-b border-gray-100 sticky top-[80px] bg-white z-30 pt-4">
            {/* Left: Count */}
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <span className="text-xs text-gray-500 uppercase tracking-widest">{productCount} Ürün Listeleniyor</span>
            </div>

            {/* Right: Sort */}
            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Sırala:</span>
                <select
                    value={currentSort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="bg-transparent text-sm font-medium text-gray-900 focus:outline-none cursor-pointer hover:text-red-900 transition-colors py-1 pr-2"
                >
                    <option value="newest">En Yeniler</option>
                    <option value="price-asc">Fiyat: Artan</option>
                    <option value="price-desc">Fiyat: Azalan</option>
                    <option value="name-asc">İsim: A-Z</option>
                </select>
            </div>
        </div>
    );
}
