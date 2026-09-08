"use client";

import { CarFront } from 'lucide-react';
import Link from 'next/link';
// 1. IMPORT THE TRANSLATION HOOK
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  // 2. INITIALIZE THE TRANSLATION ENGINE
  const { t } = useLanguage();

  return (
    <div className="navbar fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4 transition-all duration-300">
      {/* 1. Left Side: Logo */}
      <div className="flex-1">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-primary tracking-tighter">
          <img 
            src="/logomain.png" 
            alt="مسارات Logo" 
            className="w-10 h-10 object-contain hover:scale-105 transition-transform" 
          />
          مسارات
        </Link>
      </div>

      {/* 2. Middle: Search Bar */}
      <div className="flex-none gap-2 mx-4 hidden md:block">
        <div className="form-control">
          <input 
            type="text" 
            placeholder={t("searchDestination")} 
            className="input input-bordered w-64 rounded-full bg-slate-50 h-10 text-sm px-4 focus:outline-none focus:border-primary/50" 
          />
        </div>
      </div>

      {/* 3. Right Side: User Profile & Buttons */}
      <div className="flex-none gap-4">
        <Link href="/signup" className="flex items-center justify-center bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-full px-6 min-h-[40px] h-[40px] font-bold transition-all shadow-sm">
          {t("signup")}
        </Link>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:bg-slate-100 transition-colors">
            <div className="w-10 rounded-full">
              <img alt="User" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}