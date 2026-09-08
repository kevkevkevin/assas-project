"use client";

import { useState } from "react";
import { MapPin, Calendar, Search, ArrowRightLeft, Banknote, CarFront } from "lucide-react";
// 1. IMPORT THE TRANSLATION HOOK
import { useLanguage } from "../context/LanguageContext";

export default function Hero() {
  const [activeTab, setActiveTab] = useState("rental");
  // 2. INITIALIZE THE TRANSLATION ENGINE
  const { t } = useLanguage();

  // Helper to make buttons look "active" with your new orange color
  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? "bg-primary text-white shadow-lg scale-105" // Active: Orange & Pop
      : "bg-white text-slate-500 hover:bg-slate-50";  // Inactive: White & Clean
  };

  return (
    <div className="px-6 py-4">
      <div 
        className="relative w-full h-[600px] rounded-3xl bg-cover bg-center flex flex-col justify-end p-4 md:p-10 overflow-hidden shadow-sm"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-start">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-2">
            {t("heroMainTitle")}
          </h1>
          <p className="text-gray-200 mb-8 max-w-lg">
            {t("heroMainSubtitle")}
          </p>

          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-2xl shadow-orange-500/10">
            {/* TABS */}
            <div className="flex flex-wrap gap-4 border-b border-slate-100 pb-4 mb-6">
              <button onClick={() => setActiveTab("rental")} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${getTabClass("rental")}`}>
                <CarFront size={18} /> {t("tabRental")}
              </button>
              <button onClick={() => setActiveTab("lease")} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${getTabClass("lease")}`}>
                <ArrowRightLeft size={18} /> {t("tabLease")}
              </button>
              <button onClick={() => setActiveTab("finance")} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${getTabClass("finance")}`}>
                <Banknote size={18} /> {t("tabFinance")}
              </button>
              <button onClick={() => setActiveTab("swap")} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${getTabClass("swap")}`}>
                <ArrowRightLeft size={18} /> {t("tabSwap")}
              </button>
            </div>

            {/* DYNAMIC CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              
              {/* RENTAL INPUTS */}
              {activeTab === 'rental' && (
                <>
                  <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <label className="text-xs font-bold text-slate-500">{t("pickupLocation")}</label>
                      <input type="text" placeholder={t("cityAirport")} className="w-full bg-transparent outline-none text-slate-900 font-medium mt-1" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <label className="text-xs font-bold text-slate-500">{t("dates")}</label>
                      <input type="text" placeholder={t("selectDates")} className="w-full bg-transparent outline-none text-slate-900 font-medium mt-1" />
                    </div>
                  </div>
                  {/* The Magic Gradient Button */}
                  <button className="h-[52px] bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:opacity-90 transition-opacity w-full shadow-md shadow-orange-200">
                    {t("searchCars")}
                  </button>
                </>
              )}

              {/* LEASE TRANSFER INPUTS */}
              {activeTab === 'lease' && (
                <>
                  <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <label className="text-xs font-bold text-slate-500">{t("carBrandModel")}</label>
                      <input type="text" placeholder={t("egBmw")} className="w-full bg-transparent outline-none text-slate-900 font-medium mt-1" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <label className="text-xs font-bold text-slate-500">{t("maxMonthlyPayment")}</label>
                      <input type="number" placeholder="500" className="w-full bg-transparent outline-none text-slate-900 font-medium mt-1" />
                    </div>
                  </div>
                  <div className="flex gap-2 w-full">
                    <button className="flex-1 h-[52px] border-2 border-primary text-primary rounded-xl font-bold hover:bg-orange-50">{t("listMyCar")}</button>
                    <button className="flex-1 h-[52px] bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:opacity-90 shadow-md shadow-orange-200">{t("findLease")}</button>
                  </div>
                </>
              )}

              {/* FINANCING & SWAP */}
              {activeTab === 'finance' && (
                 <div className="col-span-4 flex items-center justify-center h-[52px] bg-slate-50 rounded-xl text-slate-400">
                   {t("financingPlaceholder")}
                 </div>
              )}
               {activeTab === 'swap' && (
                 <div className="col-span-4 flex items-center justify-center h-[52px] bg-slate-50 rounded-xl text-slate-400">
                   {t("swapPlaceholder")}
                 </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}