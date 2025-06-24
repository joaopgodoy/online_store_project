"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, User, Menu, X, Search } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { useAuth } from './auth-provider'
import { Badge } from "@/components/ui/badge"
import SearchBar from "./search-bar"

const categorias = [
    { name: "Alimentos e Bebidas", url: "/categorias/alimentos-bebidas" },
    { name: "Higiene e Cuidados Pessoais", url: "/categorias/higiene-cuidados" },
    { name: "Limpeza", url: "/categorias/limpeza" },
    { name: "Farmácia e Bem-estar", url: "/categorias/farmacia-bem-estar" },
]

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()
    const { items } = useCart()
    const { isAuthenticated, user } = useAuth()
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)

    // Function to check if user is admin
    const isAdmin = (user: any) => {
        return user && user.admin === true
    }

    // Function to handle profile button click
    const handleProfileClick = (e: React.MouseEvent) => {
        e.preventDefault()
        router.push('/perfil')
    }

    // Calculate total cart items only if authenticated and mounted
    const cartItemCount = hasMounted && isAuthenticated ? items.reduce(
        (total, item) => total + item.quantidade,
        0
    ) : 0

    // Check screen size for responsiveness
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            return
        }

        setHasMounted(true)

        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)

        return () => {
            window.removeEventListener("resize", checkIfMobile)
        }
    }, [])

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
    }, [pathname])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
        // Close search if open
        if (isSearchOpen) {
            setIsSearchOpen(false)
        }
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
        // Close menu if open
        if (isMenuOpen) {
            setIsMenuOpen(false)
        }
    }

    return (
        <header className={`sticky top-0 z-50 w-full ${!isSearchOpen ? 'border-b' : ''} bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
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
                                src="/placeholder-icon.png"
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

                    {/* Ícones de Pesquisa, Usuário e Carrinho */}
                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        <button
                            onClick={toggleSearch}
                            className="p-2 rounded-full hover:bg-gray-100"
                            title="Pesquisar produtos"
                        >
                            <Search className="w-5 h-5 text-gray-700" />
                        </button>

                        <button
                            onClick={handleProfileClick}
                            className="p-2 rounded-full hover:bg-gray-100"
                            title={isAdmin(user) ? "Ir para Painel Administrativo" : "Ir para Perfil"}
                        >
                            <User className="w-5 h-5 text-gray-700" />
                        </button>

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
            </div>

            {/* Search Bar */}
            <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Menu Mobile Dropdown */}
            {isMobile && isMenuOpen && (
                <div className="mt-4 pb-4 border-t border-b border-gray-200 bg-white">
                    <nav className="container mx-auto px-4">
                        <div className="flex flex-col space-y-3 py-3">
                            {/* Search option for mobile */}
                            <button
                                onClick={toggleSearch}
                                className="flex items-center space-x-2 text-sm py-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Search className="h-5 w-5" />
                                <span>Pesquisar</span>
                            </button>

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

                            {isAuthenticated && (
                                <Link
                                    href="/carrinho"
                                    className={`flex items-center space-x-2 hover:text-primary transition-colors ${
                                        pathname === "/carrinho" ? "text-primary" : ""
                                    }`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    <span>Carrinho</span>
                                    {cartItemCount > 0 && (
                                        <Badge variant="destructive" className="ml-auto">
                                            {cartItemCount}
                                        </Badge>
                                    )}
                                </Link>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}