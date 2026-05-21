import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

// 1. Import the Bouncer!
import { AuthProvider } from "../context/AuthContext"; 

const cairo = Cairo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: " مسارات التبديل التجارية ",
  description: "مسارات التبديل التجارية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cairo.className}>
        
        {/* 2. Wrap the entire app with the AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}