"use client"

import Link from "next/link"
import { Mail, Phone } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function Footer() {
  const { isAuthenticated, user } = useAuth()
  
  // Function to check if user is admin
  const isAdmin = (user: any) => {
    return user && user.admin === true
  }

  return (
    <footer className="bg-muted py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Near Market</h3>
            <p className="text-muted-foreground">
              O Seu Supermercado em Casa!
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-muted-foreground hover:text-primary transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link 
                  href="/perfil" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Meu Perfil
                </Link>
              </li>
              {!isAuthenticated && (
                <li>
                  <Link 
                    href="/login" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                </li>
              )}
              {isAuthenticated && isAdmin(user) && (
                <li>
                  <Link 
                    href="/admin" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Administração
                  </Link>
                </li>
              )}
              {!isAuthenticated && (
                <li>
                  <Link 
                    href="/cadastro" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Cadastro
                  </Link>
                </li>
              )}
              <li>
                <Link href="/carrinho" className="text-muted-foreground hover:text-primary transition-colors">
                  Carrinho
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contato@nearmarket.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-muted-foreground">
          <p>&copy; 2025 Near Market. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
