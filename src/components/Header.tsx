"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { CATEGORIES, CATEGORY_IMAGES } from "@/lib/constants";

import LanguageSwitcher from './LanguageSwitcher';

import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  activeCategory?: string;
  onCategorySelect?: (slug: string) => void;
  onSearch?: (term: string) => void;
  currentLang?: "tr" | "en";
  onLangChange?: (lang: "tr" | "en") => void;
}

export default function Header({
  activeCategory,
  onCategorySelect,
  onSearch,
  currentLang,
  onLangChange,
}: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const { favorites } = useFavorites();
  const [categories, setCategories] = useState<any[]>(CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Define pages that have a white background (needing dark header text initially)
  const isLightPage = ['/contact', '/privacy'].includes(pathname);

  // Dynamic Text Color Logic
  // If scrolled: Always white (bg is dark)
  // If not scrolled: Dark if isLightPage, White otherwise
  const headerTextColor = scrolled
    ? "text-white"
    : isLightPage
      ? "text-gray-900"
      : "text-white";

  const headerBorderColor = scrolled
    ? "border-white/10"
    : isLightPage
      ? "border-gray-900/10" // Darker border for light page
      : "border-white/10";

  // Create a robust image map combining DB data and Constants
  const getCategoryImage = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    if (category?.image_url) return category.image_url;
    return CATEGORY_IMAGES[slug] || CATEGORY_IMAGES[slug.toLowerCase()] || CATEGORY_IMAGES['oturma-grubu'];
  };

  useEffect(() => {
    setMounted(true);

    fetchCategories();
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setCategories(data);
    }
  };

  // Lock Body Scroll when Menu is Open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const activeImage = hoveredCategory ? getCategoryImage(hoveredCategory) : null;

  const lang = currentLang || (mounted ? language : "tr");

  const handleLangChange = (newLang: "tr" | "en") => {
    if (onLangChange) {
      onLangChange(newLang);
    } else {
      setLanguage(newLang);
    }
  };

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    } else if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (slug: string) => {
    if (onCategorySelect) {
      onCategorySelect(slug);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-[#020610]/95 backdrop-blur-md shadow-lg py-4 border-b border-white/5"
        : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between">

          {/* LEFT: Explore & Search */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`group flex items-center gap-3 transition-colors ${headerTextColor} hover:text-holiday-red`}
            >
              <div className="relative w-8 h-8 flex flex-col justify-center gap-1.5">
                <span className="block w-8 h-0.5 bg-current transition-all group-hover:w-full group-hover:bg-holiday-red"></span>
                <span className="block w-5 h-0.5 bg-current transition-all group-hover:w-full group-hover:bg-holiday-red"></span>
                <span className="block w-8 h-0.5 bg-current transition-all group-hover:w-full group-hover:bg-holiday-red"></span>
              </div>
              <span className="hidden md:block font-serif italic text-lg tracking-wide group-hover:translate-x-1 transition-transform">
                {lang === 'tr' ? 'Keşfet' : 'Explore'}
              </span>
            </button>

            <div className={`hidden md:flex items-center gap-2 border-b pb-0.5 transition-colors ${scrolled ? 'border-white/10 hover:border-white/30' : (isLightPage ? 'border-gray-900/20 hover:border-gray-900/40' : 'border-white/20 hover:border-white/40')}`}>
              <svg className={`w-5 h-5 opacity-70 ${headerTextColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={lang === 'tr' ? 'Ara...' : 'Search...'}
                className={`bg-transparent outline-none text-sm w-24 focus:w-48 transition-all duration-500 font-light ${headerTextColor} ${scrolled || !isLightPage ? 'placeholder:text-white/50' : 'placeholder:text-gray-500/50'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          {/* CENTER: Logo */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group text-center">
            <h1 className={`font-serif text-3xl md:text-5xl font-bold tracking-tighter transition-colors duration-500 group-hover:text-holiday-red ${headerTextColor}`}>
              SOLENZA
            </h1>
            <span className={`hidden md:block text-[10px] uppercase tracking-[0.3em] mt-1 transition-colors group-hover:text-holiday-gold ${scrolled ? 'text-gray-400' : (isLightPage ? 'text-gray-500' : 'text-white/60')}`}>
              Luxury Furniture
            </span>
          </Link>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className={`hidden md:block text-sm font-light ${headerTextColor}`}>
              {/* Simplified Language Switcher for Color Inheritence */}
              <div className="flex items-center gap-2">
                <button onClick={() => handleLangChange('tr')} className={`hover:font-medium transition-all ${lang === 'tr' ? 'font-medium underline decoration-1 underline-offset-4' : 'opacity-70'}`}>TR</button>
                <span className="opacity-30">|</span>
                <button onClick={() => handleLangChange('en')} className={`hover:font-medium transition-all ${lang === 'en' ? 'font-medium underline decoration-1 underline-offset-4' : 'opacity-70'}`}>EN</button>
              </div>
            </div>

            {/* Favorites Icon */}
            <Link href="/favorites" className="relative group p-1">
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-holiday-red rounded-full animate-ping"></span>
              )}
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-holiday-red rounded-full border border-[#020610]"></span>
              )}
              <svg
                className={`w-6 h-6 transition-all duration-300 group-hover:text-holiday-red group-hover:scale-110 ${headerTextColor}`}
                fill={favorites.length > 0 ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* SIDEBAR MENU (Remaining Unchanged) */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-700 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-full md:w-[600px] bg-[#020610] z-[70] shadow-2xl transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-r border-white/10 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} overflow-hidden`}
      >

        {/* Dynamic Background Image Layer */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform ${activeImage ? 'scale-110 opacity-40' : 'scale-100 opacity-60'}`}
          style={{ backgroundImage: `url(${activeImage || 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'})` }}
        ></div>

        <div className={`absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-purple-900/40 mix-blend-overlay transition-opacity duration-500 ${activeImage ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>

        <div className="relative z-20 h-full flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-10 border-b border-white/10">
            <div>
              <span className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-1">{lang === 'tr' ? 'Keşfet' : 'Explore'}</span>
              <span className="font-serif italic text-2xl text-white">Solenza</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="group p-3 hover:bg-white/10 rounded-full transition-all duration-300 border border-transparent hover:border-white/20"
            >
              <svg className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto px-10 py-8 no-scrollbar">
            <div className="space-y-2">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.slug}
                  href={`/?category=${cat.id}`} // Using ID instead of slug to match page.tsx logic simpler, or I need to lookup slug in page.tsx. Page uses ID. Let's use ID if available. Wait, categories in Header have slug and likely ID.
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={() => setHoveredCategory(cat.slug)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="block text-3xl md:text-5xl font-serif font-light text-white hover:text-holiday-gold hover:pl-8 transition-all duration-500 text-left w-full group animate-fade-in-up"
                  style={{ animationDelay: `${200 + (idx * 50)}ms` }}
                >
                  <span className="relative inline-block">
                    {cat.name_tr || cat.name || cat.slug}
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-lg opacity-0 group-hover:opacity-100 transition-opacity text-holiday-gold">
                      ✦
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Area */}
          <div className="p-10 border-t border-white/10 bg-black/20 backdrop-blur-md">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-4">
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white text-sm uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  {lang === 'tr' ? 'Hakkımızda' : 'About Us'}
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-white/70 hover:text-white text-sm uppercase tracking-widest transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  {lang === 'tr' ? 'İletişim' : 'Contact'}
                </Link>
              </div>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/solenzamobilya/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white cursor-pointer transition-colors text-xs uppercase tracking-widest">Instagram</a>
                <a href="#" className="text-white/40 hover:text-white cursor-pointer transition-colors text-xs uppercase tracking-widest">Pinterest</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

