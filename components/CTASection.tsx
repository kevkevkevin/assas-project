import Link from "next/link";

export default function CTASection() {
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
          Drive Your Dream Today
        </h2>
        
        <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed">
          Whether you need a luxury ride for the weekend or want to take over a lease for the long term, 
          Horizone makes the process seamless, secure, and digital.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-primary hover:bg-secondary text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105">
            Get Started Now
          </button>
          
          <button className="bg-transparent border-2 border-white text-white text-lg font-bold py-4 px-10 rounded-full hover:bg-white hover:text-black transition-all">
            Learn How It Works
          </button>
        </div>
      </div>
    </section>
  );
}