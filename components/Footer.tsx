"use client";

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, CarFront } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-start">
          
          {/* Column 1: Brand & Bio */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-10">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <CarFront size={22} />
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight hidden sm:block">مسارات</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {t("footerBio")}
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
            <h3 className="font-bold text-gray-900 mb-4">{t("footerCompany")}</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerAbout")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerCareers")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerBlog")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerPartnership")}</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t("footerSupport")}</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerHelpCenter")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerTerms")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerPrivacy")}</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">{t("footerTrust")}</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{t("footerContact")}</h3>
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-0.5" />
                <span>support@autosettle.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-0.5" />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                 <span className="text-gray-400 text-xs">
                   {t("footerLocation")}
                 </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            {t("footerCopyright")}
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <Link href="#" className="hover:text-gray-900">{t("footerPrivacyPolicy")}</Link>
            <Link href="#" className="hover:text-gray-900">{t("footerTermsCondition")}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}