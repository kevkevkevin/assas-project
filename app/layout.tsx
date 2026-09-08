import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

// 1. Import the Bouncer! (Auth)
import { AuthProvider } from "../context/AuthContext"; 
// 2. Import the Translation Engine! (Language)
import { LanguageProvider } from "../context/LanguageContext"; 

// 3. Configure Cairo to load both English and Arabic subsets
const cairo = Cairo({ 
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: " مسارات التبديل التجارية ",
  description: "مسارات التبديل التجارية",

  // 1. ADD THIS VERIFICATION BLOCK:
  verification: {
    google: 'br28MLMi4fB5eiaGDIeJDgZ1DFnT0AWfYeWD9SWglmo',
  },
  // ADD THIS NEW ICONS BLOCK:
  icons: {
    icon: '/logomain.png', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Inject the Cairo variable into the HTML tag
    <html lang="en" className={`${cairo.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900">
        
        {/* 4. Wrap the entire app with BOTH providers */}
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>

      </body>
    </html>
  );
}