export default function DiscountStrip() {
    return (
        <div className="bg-holiday-red text-white py-3 overflow-hidden border-y border-white/10">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 mx-8">
                        <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-4">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                            Kış Sezonu Fırsatları: Seçili Ürünlerde Büyük İndirim
                        </span>
                        <span className="text-xs md:text-sm font-light italic opacity-80">
                            - Sınırlı Süre
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
