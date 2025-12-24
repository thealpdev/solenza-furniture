"use client"

// 6 Popüler Banka Logosu - Güvenilir URL'ler
const POPULAR_BANKS = [
  { 
    name: "Ziraat Bankası", 
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Ziraat_Bankas%C4%B1_logo.svg"
  },
  { 
    name: "İş Bankası", 
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Isbank_logo.svg"
  },
  { 
    name: "Garanti BBVA", 
    url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Garanti_BBVA_logo.svg"
  },
  { 
    name: "Akbank", 
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Akbank_logo.svg"
  },
  { 
    name: "Yapı Kredi", 
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Yap%C4%B1_Kredi_logo.svg"
  },
  { 
    name: "Halkbank", 
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Halkbank_logo.svg"
  },
]

const fallbackLogo = "https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png"

export default function BankLogos() {
  return (
    <section className="py-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Title */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Desteklenen Kartlar</h3>
              <p className="text-xs text-gray-600">Tüm kartlara taksit</p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>

          {/* Bank Logos */}
          <div className="flex flex-wrap items-center justify-center gap-3 flex-1">
            {POPULAR_BANKS.map((bank) => (
              <div
                key={bank.name}
                className="group relative bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-md p-3 transition-all duration-200 min-w-[100px] min-h-[60px] flex items-center justify-center"
                title={bank.name}
              >
                <img
                  src={bank.url}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackLogo;
                    target.style.opacity = '0.5';
                  }}
                  alt={bank.name}
                  className="h-10 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity max-w-[120px]"
                  loading="lazy"
                />
              </div>
            ))}
            
            {/* Daha Fazlası - Tıklanamaz */}
            <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-yellow-50 hover:to-yellow-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-yellow-400 hover:shadow-md p-4 transition-all duration-200 min-w-[100px] min-h-[60px] flex items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-1">
                <svg className="w-6 h-6 text-gray-500 group-hover:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-yellow-700 transition-colors whitespace-nowrap">
                  Daha Fazlası
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
