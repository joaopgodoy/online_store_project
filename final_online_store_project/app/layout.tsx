import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Near Market - O Seu Supermercado em Casa!",
  description: "Supermercado online com entrega rápida no seu condomínio",
  icons: {
    icon: [
      {
        url: "/placeholder-icon.png",
        sizes: "32x32",
        type: "image/jpeg"
      },
      {
        url: "/placeholder-icon.png",
        sizes: "16x16",
        type: "image/jpeg"
      }
    ],
    shortcut: "placeholder-icon.png",
    apple: "placeholder-icon.png"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}