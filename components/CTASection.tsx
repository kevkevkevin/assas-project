"use client";

import Link from "next/link";
// 1. IMPORT THE TRANSLATION HOOK
import { useLanguage } from "../context/LanguageContext"; 

export default function CTASection() {
  // 2. INITIALIZE THE TRANSLATION ENGINE
  const { t } = useLanguage();

  return (
    <section 
      className="relative w-full h-[70vh] bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{ 
        backgroundImage: "url('/ctaimg.png')" 
      }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Centered Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          {t("driveDream")}
        </h2>
        
        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
          {t("ctaSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary hover:bg-secondary text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105">
            {t("getStarted")}
          </button>
          
          <button className="bg-transparent border-2 border-white text-white text-lg font-bold py-4 px-10 rounded-full hover:bg-white hover:text-black transition-all">
            {t("learnHowItWorks")}
          </button>
        </div>
      </div>
    </section>
  );
}