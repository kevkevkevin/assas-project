import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, CarFront } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Bio */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-10">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <CarFront size={22} />
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">AutoSettle</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              The all-in-one platform for car rentals, lease transfers, and automotive financing. We simplify the journey of vehicle ownership.
            </p>
            <div className="flex gap-4">
               {/* Social Icons */}
               <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                  <Facebook size={18} />
               </button>
               <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                  <Twitter size={18} />
               </button>
               <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                  <Instagram size={18} />
               </button>
            </div>
          </div>

          {/* Column 2: About */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partnership</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-0.5" />
                <span>support@autosettle.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-0.5" />
                <span>+966 50 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                 <span className="text-gray-400 text-xs">
                    Jeddah, Saudi Arabia
                 </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © 2026 AutoSettle. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="#" className="hover:text-gray-900">Privacy & Policy</Link>
            <Link href="#" className="hover:text-gray-900">Terms & Condition</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}