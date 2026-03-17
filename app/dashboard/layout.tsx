"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Menu, CarFront } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State to track if the mobile menu is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. Dark Overlay (Only visible on mobile when menu is open) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. The Sidebar (Hidden off-screen on mobile, visible on desktop) */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* 3. The Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen w-full">
        
        {/* Mobile Top Bar (Hidden on Desktop) */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <CarFront size={18} />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">AutoSettle</span>
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="text-slate-600 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          {children}
        </main>

      </div>
    </div>
  );
}