"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"

const categorias = [
	{ name: "Alimentos e Bebidas", href: "/categorias/alimentos-bebidas" },
	{ name: "Higiene e Cuidados", href: "/categorias/higiene-cuidados" },
	{ name: "Limpeza", href: "/categorias/limpeza" },
	{ name: "Farmácia e Bem-estar", href: "/categorias/farmacia-bem-estar" },
]

export default function Header() {
	const pathname = usePathname()
	const { items } = useCart()
	const { isAuthenticated } = useAuth()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto px-4 max-w-7xl">
				<div className="flex h-16 items-center justify-between">
					{/* Logo - Lado Esquerdo */}
					<div className="flex items-center min-w-0 flex-shrink-0">
						<Link href="/" className="flex items-center gap-2">
							<Image
								src="/placeholder.jpg?height=40&width=40"
								alt="Logo"
								width={40}
								height={40}
								className="rounded-md"
							/>
							<span className="font-bold text-xl hidden sm:inline-block whitespace-nowrap">
								Near Market
							</span>
						</Link>
					</div>

					{/* Desktop Navigation - Centro */}
					<nav className="hidden md:flex items-center justify-center gap-6 flex-1 px-8">
						{categorias.map((categoria) => (
							<Link
								key={categoria.href}
								href={categoria.href}
								className={`text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
									pathname === categoria.href
										? "text-primary"
										: "text-muted-foreground"
								}`}
							>
								{categoria.name}
							</Link>
						))}
					</nav>

					{/* User Actions - Lado Direito */}
					<div className="flex items-center gap-2 min-w-0 flex-shrink-0">
						<Link href={isAuthenticated ? "/perfil" : "/login"}>
							<Button variant="ghost" size="icon" aria-label="Perfil">
								<User className="h-5 w-5" />
							</Button>
						</Link>
						<Link href="/carrinho">
							<Button
								variant="ghost"
								size="icon"
								aria-label="Carrinho"
								className="relative"
							>
								<ShoppingCart className="h-5 w-5" />
								{items.length > 0 && (
									<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
										{items.length}
									</span>
								)}
							</Button>
						</Link>

						{/* Mobile Menu Button */}
						<Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="md:hidden"
									aria-label="Menu"
								>
									<Menu className="h-5 w-5" />
								</Button>
							</SheetTrigger>
							<SheetContent side="left" className="w-[300px] sm:w-[400px]">
								<div className="flex flex-col gap-6 py-4">
									<Link
										href="/"
										className="flex items-center gap-2"
										onClick={() => setIsMenuOpen(false)}
									>
										<Image
											src="/placeholder.jpg?height=40&width=40"
											alt="Logo"
											width={40}
											height={40}
											className="rounded-md"
										/>
										<span className="font-bold text-xl">Near Market</span>
									</Link>
									<nav className="flex flex-col gap-4">
										{categorias.map((categoria) => (
											<Link
												key={categoria.href}
												href={categoria.href}
												className={`text-base font-medium transition-colors hover:text-primary ${
													pathname === categoria.href
														? "text-primary"
														: "text-muted-foreground"
												}`}
												onClick={() => setIsMenuOpen(false)}
											>
												{categoria.name}
											</Link>
										))}
									</nav>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	)
}
