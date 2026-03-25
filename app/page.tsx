"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { CarFront, ArrowRight, Search, ShieldCheck, Zap, Star, ArrowRightLeft, CheckCircle } from "lucide-react";
import CTASection from "@/components/CTASection";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";
import Services from "@/components/Services";

// Dummy data for our new gorgeous cards
const TOP_CARS = [
  { id: "1", make: "Toyota", model: "Camry", year: "2024", price: 65, image: "https://www.autobond.cz/wp-content/uploads/2018/10/camry.png" },
  { id: "2", make: "BMW", model: "X5", year: "2023", price: 120, image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&q=80&w=800" },
  { id: "3", make: "Tesla", model: "Model 3", year: "2024", price: 95, image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800" },
  { id: "4", make: "Mercedes", model: "C-Class", year: "2024", price: 110, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800" },
];

const SWAP_CARS = [
  { id: "s1", myMake: "Honda", myModel: "CR-V", targetMake: "Toyota", targetType: "SUV", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800" },
  { id: "s2", myMake: "Ford", myModel: "F-150", targetMake: "Any", targetType: "Sedan", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800" },
  { id: "s3", myMake: "Audi", myModel: "A4", targetMake: "BMW", targetType: "Sports", image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=800" },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // NEW: Smart Routing for Rentals!
  const handleRentalClick = () => {
    if (user) {
      router.push("/dashboard/rentals");
    } else {
      router.push("/login");
    }
  };

  // NEW: Smart Routing for Swaps!
  const handleSwapClick = () => {
    if (user) {
      router.push("/dashboard/swap");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* Background Creative Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* DYNAMIC HEADER NAV (THE BIG PILL) */}
      <header className="fixed top-6 w-full z-50 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-[1600px] bg-white/85 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/40 h-20 rounded-full flex items-center justify-between px-6 md:px-8 pointer-events-auto transition-all">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <CarFront size={22} />
            </div>
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">AutoSettle</span>
          </Link>

          <div>
            {loading ? (
              <div className="w-32 h-12 bg-slate-200 animate-pulse rounded-full"></div>
            ) : user ? (
              <Link href="/dashboard" className="flex items-center gap-3 bg-white border border-slate-200 hover:border-primary/40 px-2 py-1.5 pr-5 rounded-full transition-all hover:shadow-md shadow-sm group">
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform">😊</div>
                <span className="font-bold text-slate-700 hidden sm:block">{user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
                <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block"></div>
                <span className="text-sm font-extrabold text-primary flex items-center gap-1">Dashboard <ArrowRight size={14} /></span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 sm:gap-4">
                <Link href="/login" className="font-bold text-slate-500 hover:text-slate-900 transition-colors hidden sm:block px-4">Log In</Link>
                <Link href="/signup" className="bg-slate-900 hover:bg-slate-800 text-white px-6 md:px-8 py-3 rounded-full font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="pt-40 pb-20 px-6 relative z-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-bold text-sm mb-6 border border-orange-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Saudi Arabia's #1 Settlement Platform
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
              Find your perfect car, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">without the hassle.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
              Whether you want to take over a lease, rent a luxury vehicle, secure instant financing, or simply swap your ride.
            </p>

            <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-2xl shadow-slate-200/60 border border-slate-100 flex items-center max-w-xl mb-12 animate-in fade-in zoom-in-95 duration-1000 delay-150 relative">
              <div className="pl-4 pr-2 text-slate-400"><Search size={24} /></div>
              <input 
                type="text" required value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 'Toyota Camry' or 'Lease'..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 h-14 text-base md:text-lg px-2 w-full"
              />
              <button type="submit" className="bg-primary hover:bg-secondary text-white px-6 md:px-8 py-3.5 rounded-full font-bold transition-all shadow-md shadow-orange-500/20 hover:shadow-lg flex items-center gap-2">
                <span className="hidden md:block">Search</span>
                <ArrowRight size={20} className="md:hidden" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-8 opacity-60 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-500">
              <div className="flex items-center gap-2 font-bold text-slate-700"><ShieldCheck className="text-green-500" /> Secure Payments</div>
              <div className="flex items-center gap-2 font-bold text-slate-700"><Zap className="text-yellow-500" /> Instant Approvals</div>
              <div className="flex items-center gap-2 font-bold text-slate-700"><Star className="text-primary" /> Verified Users</div>
            </div>
          </div>

          <div className="relative w-full h-[400px] lg:h-[600px] animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="absolute inset-4 bg-gradient-to-tr from-slate-200 to-slate-50 rounded-[3rem] transform rotate-3 shadow-inner"></div>
            <img 
              src="./ctaimg.png" 
              alt="Luxury Sports Car" 
              className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-700"
            />
            <div className="absolute -left-4 top-1/4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce shadow-slate-200">
               <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><CheckCircle size={20}/></div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase">Sale Now</p>
                 <p className="font-extrabold text-slate-900">Toyota Raize</p>
               </div>
            </div>
          </div>

        </div>
      </main>

      {/* ========================================= */}
      {/* SECTION 1: Top Picks (Rentals)            */}
      {/* ========================================= */}
      <section className="max-w-[1600px] mx-auto px-6 py-20 relative z-10 mt-10">
        <div className="flex justify-between items-end mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Top picks this month</h2>
            <p className="text-slate-500 text-lg">Experience the epitome of an amazing journey with our top rentals.</p>
          </div>
          {/* View All Rentals Button uses smart routing */}
          <button onClick={handleRentalClick} className="hidden md:block text-primary font-bold hover:underline transition-all">View all rentals</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TOP_CARS.map((car, index) => (
            <div 
              key={index} 
              onClick={handleRentalClick} // Entire card is clickable
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer animate-in fade-in zoom-in-95 flex flex-col" 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                <img src={car.image} alt={car.model} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
                  <span className="font-extrabold text-slate-900">{car.price}</span><span className="text-xs font-bold text-slate-500 ml-1">ريال/day</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-1">{car.make} {car.model}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-6">{car.year} • Auto • 5 Seats</p>
                </div>
                {/* NEW: Book Now Button uses smart routing */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Stops the card click from firing twice
                    handleRentalClick();
                  }} 
                  className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================= */}
      {/* SECTION 2: Available for Swap             */}
      {/* ========================================= */}
      <section className="max-w-[1600px] mx-auto px-6 pb-24 relative z-10">
        <div className="flex justify-between items-end mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Available for Swap</h2>
            <p className="text-slate-500 text-lg">Trade your current vehicle for something new.</p>
          </div>
          {/* See All Swaps Button uses smart routing */}
          <button onClick={handleSwapClick} className="hidden md:block text-purple-600 font-bold hover:underline transition-all">See all swaps</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SWAP_CARS.map((car, index) => (
            <div 
              key={index} 
              onClick={handleSwapClick} // Entire card is clickable
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer animate-in fade-in zoom-in-95 flex flex-col"
            >
              <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                <img src={car.image} alt={car.myModel} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1.5 rounded-xl shadow-md font-bold text-xs flex items-center gap-1.5">
                  <ArrowRightLeft size={14} /> Open to Trade
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Offering</p>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{car.myMake} <br/>{car.myModel}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-2"><ArrowRightLeft size={18} /></div>
                  <div className="flex-1 text-right">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Looking For</p>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{car.targetMake} <br/>{car.targetType}</h3>
                  </div>
                </div>
                {/* NEW: Trade Button uses smart routing */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSwapClick();
                  }}
                  className="w-full bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Trade for this
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
        {/* ========================================= */}
      {/* RENDER YOUR EXISTING COMPONENTS HERE        */}
      {/* ========================================= */}
      {/* Services Section */}
      <Services />

      {/* CTA Section */}
      <FadeIn delay={0.3} direction="up" fullWidth>
        <CTASection />
      </FadeIn>

      {/* NEW: Footer */}
      <Footer />
    </div>
  );
}