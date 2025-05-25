"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, MapPin, Mail, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

// Pedidos de exemplo para simulação
const pedidosExemplo = [
  { id: "1234", data: "15/04/2025", valor: 75.9, status: "Entregue" },
  { id: "5678", data: "10/04/2025", valor: 42.5, status: "Em processamento" },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    })
    router.push("/")
  }

  if (!user) {
    return null // Não renderiza nada enquanto verifica autenticação
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Seus dados cadastrais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">name</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-muted-foreground">Email</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Apartamento {user.apartamento}</p>
                  <p className="text-sm text-muted-foreground">Endereço de entrega</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair da conta
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
              <CardDescription>Histórico dos seus últimos pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              {pedidosExemplo.length > 0 ? (
                <div className="space-y-4">
                  {pedidosExemplo.map((pedido) => (
                    <div key={pedido.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Pedido #{pedido.id}</p>
                          <p className="text-sm text-muted-foreground">{pedido.data}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {pedido.valor.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{pedido.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">Nenhum pedido encontrado</h3>
                  <p className="text-muted-foreground">Você ainda não realizou nenhum pedido.</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/produtos">Ver produtos disponíveis</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
