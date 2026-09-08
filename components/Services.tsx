"use client";

import { CarFront, ArrowRightLeft, Banknote, ShieldCheck } from "lucide-react";
// 1. IMPORT THE TRANSLATION HOOK
import { useLanguage } from "../context/LanguageContext";

export default function Services() {
  // 2. INITIALIZE THE ENGINE
  const { t } = useLanguage();

  const services = [
    {
      icon: <CarFront size={32} className="text-white" />,
      title: t("premiumRentals"),
      description: t("premiumRentalsDesc"),
    },
    {
      icon: <ArrowRightLeft size={32} className="text-white" />,
      title: t("leaseTransfer"),
      description: t("leaseTransferDesc"),
    },
    {
      icon: <Banknote size={32} className="text-white" />,
      title: t("easyFinancing"),
      description: t("easyFinancingDesc"),
    },
    {
      icon: <ArrowRightLeft size={32} className="text-white" />,
      title: t("carSwapping"),
      description: t("carSwappingDesc"),
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("servicesTitle")}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {t("servicesSubtitle")}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-3xl border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 bg-white"
            >
              {/* Icon Circle */}
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-500 leading-relaxed">
                {service.description}
              </p>

              {/* "Learn More" Link */}
              <div className="mt-6">
                <button className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
                  {t("learnMore")} <span className="text-xl rtl:rotate-180">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust/Safety Banner */}
        <div className="mt-20 bg-gray-900 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           {/* Decorative Background Blob */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

           <div className="relative z-10 text-start">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {t("secureTransactions")}
              </h3>
              <p className="text-gray-400 max-w-lg">
                {t("secureTransactionsDesc")}
              </p>
           </div>
           
           <div className="relative z-10">
              <button className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-900/20 transition-transform hover:scale-105 flex items-center gap-2">
                 <ShieldCheck size={20} />
                 {t("verifyAccount")}
              </button>
           </div>
        </div>

      </div>
    </section>
  );
}