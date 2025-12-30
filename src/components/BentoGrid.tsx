import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Category = {
    id: number;
    name_tr: string;
    slug: string;
    image_url: string | null;
}

export default function BentoGrid() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchCategories() {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: true });

            if (data) {
                setCategories(data);
            }
        }
        fetchCategories();
    }, []);

    // Simplified grid pattern: 2 large featured items, then 3 columns for the rest
    // This creates a cleaner, less "broken" look while still maintaining visual interest.

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6 max-w-[1400px]">
                {/* Section Header */}
                <div className="mb-12 text-center max-w-2xl mx-auto">
                    <span className="text-xs font-sans tracking-[0.25em] text-holiday-red uppercase mb-3 block font-bold">Koleksiyonlar</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4 leading-tight">
                        Yaşam Alanınızı <span className="italic font-light text-holiday-gold">Şekillendirin</span>
                    </h2>
                    <div className="w-12 h-1 bg-gray-100 mx-auto rounded-full"></div>
                </div>

                <div className="relative">
                    {/* Scroll Container */}
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/?category=${cat.id}`}
                                className="group relative block flex-shrink-0 w-[85vw] md:w-[350px] overflow-hidden bg-gray-100 aspect-[3/4] snap-center"
                            >
                                {/* Image Container - Clean & Chic */}
                                <div className="absolute inset-0 w-full h-full overflow-hidden">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                        style={{ backgroundImage: `url(${cat.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80'})` }}
                                    ></div>
                                </div>

                                {/* Overlay Gradient - Subtle */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>

                                {/* Content - Floating at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-white font-serif text-3xl mb-2 group-hover:text-holiday-gold transition-colors">
                                        {cat.name_tr}
                                    </h3>
                                    <div className="inline-block border-b border-white/30 pb-1 text-white text-xs uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Koleksiyonu Keşfet
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Visual Scroll Hint for Desktop */}
                    <div className="hidden md:flex justify-end gap-2 mt-4 text-gray-300">
                        <span className="text-xs uppercase tracking-widest">Sürükle</span>
                        <svg className="w-4 h-4 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                </div>
            </div>
        </section>
    );
}



