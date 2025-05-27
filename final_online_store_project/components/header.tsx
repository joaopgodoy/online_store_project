"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"

const categorias = [
    { name: "Alimentos e Bebidas", url: "/categorias/alimentos-bebidas" },
    { name: "Higiene e Cuidados Pessoais", url: "/categorias/higiene-cuidados" },
    { name: "Limpeza", url: "/categorias/limpeza" },
    { name: "Farmácia e Bem-estar", url: "/categorias/farmacia-bem-estar" },
]

export default function Header() {
    const pathname = usePathname()
    const { items } = useCart()
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Calcular quantidade total de itens no carrinho
    const cartItemCount = items.reduce(
        (total, item) => total + item.quantidade,
        0
    )

    // Verificar o tamanho da tela para responsividade
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)

        return () => {
            window.removeEventListener("resize", checkIfMobile)
        }
    }, [])

    // Fechar menu quando mudar de rota
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <header className="w-full py-4 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Menu Hambúrguer (Mobile) */}
                {isMobile && (
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-full hover:bg-gray-100 flex-shrink-0"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-5 h-5 text-gray-700" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-700" />
                        )}
                    </button>
                )}

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <div className={`relative ${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`}>
                        <Image
                            src="/placeholder.jpg"
                            alt="Near Market Logo"
                            width={isMobile ? 40 : 32}
                            height={isMobile ? 40 : 32}
                            className="object-contain"
                            priority
                            quality={95}
                            sizes="(max-width: 768px) 40px, 32px"
                        />
                    </div>
                    <span className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
                        Near Market
                    </span>
                </Link>

                {/* Navegação Desktop */}
                <nav className="hidden md:flex items-center space-x-8">
                    {categorias.map((categoria) => (
                        <Link
                            key={categoria.url}
                            href={categoria.url}
                            className={`text-sm transition-colors hover:text-gray-900 ${
                                pathname === categoria.url
                                    ? "font-medium text-black"
                                    : "text-gray-600"
                            }`}
                        >
                            {categoria.name}
                        </Link>
                    ))}
                </nav>

                {/* Ícones de Usuário e Carrinho */}
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <Link
                        href="/perfil"
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <User className="w-5 h-5 text-gray-700" />
                    </Link>

                    <Link
                        href="/carrinho"
                        className="p-2 relative rounded-full hover:bg-gray-100"
                    >
                        <ShoppingCart className="w-5 h-5 text-gray-700" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Menu Mobile Dropdown */}
            {isMobile && isMenuOpen && (
                <div className="mt-4 pb-4 border-t border-gray-200 bg-white">
                    <nav className="container mx-auto px-4">
                        <div className="flex flex-col space-y-3 py-3">
                            {categorias.map((categoria) => (
                                <Link
                                    key={categoria.url}
                                    href={categoria.url}
                                    className={`text-sm py-2 transition-colors hover:text-gray-900 ${
                                        pathname === categoria.url
                                            ? "font-medium text-black"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {categoria.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}