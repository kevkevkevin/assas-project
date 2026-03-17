import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Import the Bouncer!
import { AuthProvider } from "../context/AuthContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horizone Automotive",
  description: "Rental and Settlement Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* 2. Wrap the entire app with the AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}