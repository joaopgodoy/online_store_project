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
	{ name: "Higiene e Cuidados Pessoais", href: "/categorias/higiene-cuidados" },
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
			<div className="container flex h-16 items-center px-4 relative">
				{/* Left Side - Logo and Mobile Menu */}
				<div className="flex items-center gap-4">
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
										src="/placeholder.svg?height=40&width=40"
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

					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/placeholder.svg?height=40&width=40"
							alt="Logo"
							width={40}
							height={40}
							className="rounded-md"
						/>
						<span className="font-bold text-xl">Near Market</span>
					</Link>
				</div>

				{/* Center - Desktop Navigation */}
				<nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
					{categorias.map((categoria) => (
						<Link
							key={categoria.href}
							href={categoria.href}
							className={`text-sm font-medium transition-colors hover:text-primary ${
								pathname === categoria.href
									? "text-primary"
									: "text-muted-foreground"
							}`}
						>
							{categoria.name}
						</Link>
					))}
				</nav>

				{/* Right Side - User Actions */}
				<div className="flex items-center gap-4 ml-auto">
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
				</div>
			</div>
		</header>
	)
}
