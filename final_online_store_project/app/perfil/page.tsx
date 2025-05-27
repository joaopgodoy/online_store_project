"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, MapPin, Mail, Package, CreditCard, Loader2 } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

interface Order {
  _id: string
  total: number
  status: string
  createdAt: string
  items: any[]
  pickupCode?: string
}

interface PaymentMethod {
  _id: string
  type: string
  lastFourDigits?: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState({
    orders: true,
    paymentMethods: true
  })

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Buscar pedidos do usuário
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        const response = await axios.get('/api/users/me/orders')
        setOrders(response.data)
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus pedidos.",
          variant: "destructive"
        })
      } finally {
        setLoading(prev => ({ ...prev, orders: false }))
      }
    }

    fetchOrders()
  }, [user, toast])

  // Buscar formas de pagamento do usuário
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user) return

      try {
        const response = await axios.get('/api/users/me/payment-methods')
        setPaymentMethod(response.data)
      } catch (error) {
        console.error('Erro ao buscar formas de pagamento:', error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas formas de pagamento.",
          variant: "destructive"
        })
      } finally {
        setLoading(prev => ({ ...prev, paymentMethods: false }))
      }
    }

    fetchPaymentMethods()
  }, [user, toast])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    })
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'entregue':
      case 'completed':
        return 'text-green-600'
      case 'em processamento':
      case 'processing':
        return 'text-yellow-600'
      case 'cancelado':
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          {/* Informações Pessoais */}
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
                  <p className="text-sm text-muted-foreground">Nome completo</p>
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
                  <p className="font-medium">Apartamento {user.apartment}</p>
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

          {/* Formas de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Forma de Pagamento</CardTitle>
              <CardDescription>Método de pagamento cadastrado</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.paymentMethods ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Carregando...</span>
                </div>
              ) : paymentMethod ? (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {paymentMethod.type} •••• {paymentMethod.lastFourDigits}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cadastrado em {formatDate(paymentMethod.createdAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CreditCard className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma forma de pagamento cadastrada
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {/* Pedidos */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
              <CardDescription>Histórico dos seus últimos pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.orders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">Carregando pedidos...</span>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Pedido #{order._id.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                          {order.pickupCode && (
                            <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                              Código: {order.pickupCode}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {order.total.toFixed(2)}</p>
                        <p className={`text-sm ${getStatusColor(order.status)}`}>
                          {order.status}
                        </p>
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
