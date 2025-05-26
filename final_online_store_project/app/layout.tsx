import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Near Market",
  description: "O Seu Supermercado em Casa"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}