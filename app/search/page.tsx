"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { ArrowLeft, FileText, ArrowRightLeft, Search as SearchIcon } from "lucide-react";
// 1. IMPORT THE TRANSLATION HOOK
import { useLanguage } from "../../context/LanguageContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  
  // 2. INITIALIZE TRANSLATION ENGINE
  const { t } = useLanguage();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We fetch Leases and Swaps from the DB that contain the search keyword!
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const matchedItems: any[] = [];

        // Fetch Leases
        const leaseDocs = await getDocs(collection(db, "leases"));
        leaseDocs.forEach((doc) => {
          const data = doc.data();
          const searchableString = `${data.make} ${data.model} ${data.year} lease transfer`.toLowerCase();
          if (searchableString.includes(query)) {
            matchedItems.push({ id: doc.id, type: "Lease", ...data });
          }
        });

        // Fetch Swaps
        const swapDocs = await getDocs(collection(db, "swaps"));
        swapDocs.forEach((doc) => {
          const data = doc.data();
          const searchableString = `${data.myMake} ${data.myModel} ${data.targetMake} swap trade`.toLowerCase();
          if (searchableString.includes(query)) {
            matchedItems.push({ id: doc.id, type: "Swap", ...data });
          }
        });

        setResults(matchedItems);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 text-start">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors group">
          <ArrowLeft size={18} className="rtl:rotate-180 group-hover:ltr:-translate-x-1 group-hover:rtl:translate-x-1 transition-transform" /> {t("backToHome")}
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">
            {t("searchResultsFor")} <span className="text-primary">"{query}"</span>
          </h1>
          <p className="text-slate-500 text-lg">{t("searchSubtitle")}</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-lg">{t("searchingDb")}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 py-20 px-6 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <SearchIcon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t("noMatchesFound")}</h3>
            <p className="text-slate-500 max-w-md">{t("noMatchesDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all group">
                
                {/* Dynamic Header based on Type */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-50">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                    item.type === 'Lease' ? 'bg-orange-50 text-orange-600' : 'bg-purple-50 text-purple-600'
                  }`}>
                    {item.type === 'Lease' ? <FileText size={14}/> : <ArrowRightLeft size={14}/>} 
                    {item.type === 'Lease' ? t("leaseWord") : t("swapWord")}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                     {/* Translate status if matched, else raw */}
                     {item.status === 'Under Review' ? t("underReview") : item.status === 'Reviewing Matches' ? t("reviewingMatches") : item.status}
                  </span>
                </div>

                {/* Content */}
                {item.type === 'Lease' ? (
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-900 mb-1">{item.make} {item.model}</h3>
                    <p className="text-sm text-slate-500 mb-4">{item.year} • {item.mileage} km</p>
                    <p className="text-2xl font-bold text-primary flex items-baseline gap-1">
                      {item.monthlyPayment} <span className="text-sm font-medium text-slate-400">{t("currencySAR")}/{t("perMonthText")}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t("offeringLabel")}</p>
                    <h3 className="font-extrabold text-xl text-slate-900 mb-4">{item.myMake} {item.myModel}</h3>
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-0.5">{t("lookingForLabel")}</p>
                    <h3 className="font-extrabold text-lg text-slate-700">{item.targetMake || t("anyWord")} {t(item.targetType?.toLowerCase() as any) || item.targetType}</h3>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

// Export the page wrapped in Suspense for Next.js requirements
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-primary">Loading Search...</div>}>
      <header className="fixed top-6 w-full z-50 flex justify-center px-4 pointer-events-none text-start">
        <div className="w-full max-w-[1600px] bg-white/85 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/40 h-20 rounded-full flex items-center px-6 md:px-8 pointer-events-auto">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logomain.png" alt="مسارات Logo" className="w-10 h-10 object-contain hover:scale-105 transition-transform" />
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">مسارات</span>
          </Link>
        </div>
      </header>
      <SearchContent />
    </Suspense>
  );
}