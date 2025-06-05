"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from '@/components/auth-provider'
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Package, CreditCard, Loader2, LogOut, ChevronDown, Trash2, Check, Plus, ShieldCheck } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface OrderItem {
  product: {
    _id: string
    name: string
    price: number
    image?: string
  }
  quantity: number
  price: number
}

interface Order {
  _id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
  pickupCode?: string
}

interface PaymentMethod {
  _id: string
  type: string
  lastFourDigits?: string
  cardholderName?: string
  isDefault?: boolean
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, refreshUser } = useAuth()
  const { toast } = useToast()
  
  // Função para verificar se o usuário é admin
  const isAdmin = (user: any) => {
    return user && user.admin === true
  }
  
  const [orders, setOrders] = useState<Order[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState({
    orders: true,
    paymentMethods: true
  })
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")
  
  // Estados para adicionar cartão
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardType, setCardType] = useState("credit")
  const [addingCard, setAddingCard] = useState(false)

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Dados do usuário já são carregados automaticamente pelo AuthProvider

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
        const token = localStorage.getItem('token')
        if (!token) {
          console.warn('Token não encontrado para buscar métodos de pagamento')
          return
        }

        const response = await axios.get('/api/users/me/payment-methods', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        // A API retorna diretamente o array de métodos de pagamento
        const methods = Array.isArray(response.data) ? response.data : []
        setPaymentMethods(methods)
      } catch (error: any) {
        console.error('Erro ao buscar formas de pagamento:', error)
        
        // Não mostrar erro se for 401 (não autenticado) ou se não houver métodos
        if (error.response?.status !== 401) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar suas formas de pagamento.",
            variant: "destructive"
          })
        }
        
        // Garantir que paymentMethods seja um array vazio em caso de erro
        setPaymentMethods([])
      } finally {
        setLoading(prev => ({ ...prev, paymentMethods: false }))
      }
    }

    fetchPaymentMethods()
  }, [user, toast])

  const handleLogout = () => {
    // Primeiro executar o logout para limpar os dados de autenticação
    logout();
    
    // Forçar um recarregamento da página em vez de navegação suave
    // isso garante que todas as requisições sejam canceladas e o estado seja realmente limpo
    window.location.href = '/';
    
    // Mostrar toast - isso vai aparecer brevemente antes do redirecionamento
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso."
    });
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendente':
        return 'text-yellow-600'
      case 'processando':
        return 'text-blue-600'
      case 'concluído':
      case 'entregue':
        return 'text-green-600'
      case 'cancelado':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  // Modificar função para deletar método de pagamento
  const deletePaymentMethod = async (methodId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erro",
          description: "Token de autenticação não encontrado",
          variant: "destructive"
        })
        return
      }

      const response = await axios.delete(`/api/users/me/payment-methods/${methodId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Remover da lista local
      setPaymentMethods(prev => prev.filter(method => method._id !== methodId))
      
      toast({
        title: "Sucesso",
        description: "Método de pagamento excluído com sucesso"
      })
    } catch (error: any) {
      console.error('Erro ao excluir método de pagamento:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir método de pagamento",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedPaymentMethodId("")
    }
  }

  // Modificar função para confirmar retirada de pedido
  const confirmOrderPickup = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erro",
          description: "Token de autenticação não encontrado",
          variant: "destructive"
        })
        return
      }

      const response = await axios.put(`/api/orders/${orderId}/confirm`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Atualizar o pedido na lista local
      setOrders(prev => prev.map(order => 
        order._id === orderId 
          ? { ...order, status: 'completed' }
          : order
      ))
      
      toast({
        title: "Sucesso",
        description: "Pedido confirmado como retirado!"
      })
    } catch (error: any) {
      console.error('Erro ao confirmar retirada:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao confirmar retirada",
        variant: "destructive"
      })
    } finally {
      setConfirmDialogOpen(false)
      setSelectedOrderId("")
    }
  }

  // Função para adicionar cartão
  const addPaymentMethod = async () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc || !cardType) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      })
      return
    }

    // Validar número do cartão (remover espaços e validar)
    const cleanCardNumber = cardNumber.replace(/\s/g, "")
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19 || !/^\d+$/.test(cleanCardNumber)) {
      toast({
        title: "Erro",
        description: "Número do cartão inválido",
        variant: "destructive"
      })
      return
    }

    // Validar data de validade
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      toast({
        title: "Erro",
        description: "Data de validade deve estar no formato MM/AA",
        variant: "destructive"
      })
      return
    }

    // Validar CVC
    if (cardCvc.length < 3) {
      toast({
        title: "Erro",
        description: "CVC deve ter pelo menos 3 dígitos",
        variant: "destructive"
      })
      return
    }

    setAddingCard(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erro",
          description: "Token de autenticação não encontrado",
          variant: "destructive"
        })
        return
      }

      const response = await axios.post('/api/users/me/payment-methods', {
        cardNumber: cleanCardNumber,
        cardName: cardName.trim(),
        cardExpiry,
        type: cardType
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Adicionar o novo método à lista local
      if (response.data.paymentMethod) {
        setPaymentMethods(prev => [response.data.paymentMethod, ...prev])
      }

      // Limpar formulário
      setCardNumber("")
      setCardName("")
      setCardExpiry("")
      setCardCvc("")
      setCardType("credit")

      setAddCardDialogOpen(false)

      toast({
        title: "Sucesso",
        description: "Cartão adicionado com sucesso"
      })
    } catch (error: any) {
      console.error('Erro ao adicionar cartão:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao adicionar cartão",
        variant: "destructive"
      })
    } finally {
      setAddingCard(false)
    }
  }

  // Funções de formatação para os campos do cartão
  const formatCardNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    // Adiciona espaços a cada 4 dígitos
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    // Adiciona barra após 2 dígitos
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4)
    }
    return numbers
  }

  const formatCvc = (value: string) => {
    // Remove tudo que não é número e limita a 4 dígitos
    return value.replace(/\D/g, '').slice(0, 4)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    // Limita a 19 caracteres (16 números + 3 espaços)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setCardExpiry(formatted)
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCvc(e.target.value)
    setCardCvc(formatted)
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações e pedidos</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="self-start sm:self-auto">
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div>
          {/* Card de informações do usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                Informações Pessoais
              </CardTitle>
              <CardDescription>Seus dados cadastrais no sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</p>
                <p className="font-medium">{user.name}</p>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Apartamento</p>
                <p className="font-medium">{user.apartment || 'Não informado'}</p>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground mb-1">Tipo de Usuário</p>
                <Badge variant={user.admin ? "default" : "secondary"} className="mt-1">
                  {user.admin ? "Administrador" : "Cliente"}
                </Badge>
              </div>
              
              {/* Botão de acesso à área administrativa para admins */}
              {isAdmin(user) && (
                <Button 
                  variant="default" 
                  className="w-full mt-2" 
                  onClick={() => router.push('/admin')}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Acessar Painel Administrativo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Métodos de pagamento com botão de deletar */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pagamento
              </CardTitle>
              <CardDescription>Seus cartões cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.paymentMethods ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Carregando...</span>
                </div>
              ) : paymentMethods.length > 0 ? (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method._id} className="p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {method.type === 'credit' ? 'Crédito' : 'Débito'} •••• {method.lastFourDigits}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {method.cardholderName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Adicionado em {formatDate(method.createdAt)}
                            </p>
                          </div>
                        </div>
                        <AlertDialog open={deleteDialogOpen && selectedPaymentMethodId === method._id} onOpenChange={(open) => {
                          setDeleteDialogOpen(open)
                          if (!open) setSelectedPaymentMethodId("")
                        }}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPaymentMethodId(method._id)
                                setDeleteDialogOpen(true)
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir método de pagamento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cartão {method.type === 'credit' ? 'Crédito' : 'Débito'} terminado em {method.lastFourDigits}?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deletePaymentMethod(method._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                  <CreditCard className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Nenhum cartão cadastrado
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Adicione um cartão usando o botão abaixo
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Dialog open={addCardDialogOpen} onOpenChange={setAddCardDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Cartão
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Cartão</DialogTitle>
                    <DialogDescription>
                      Preencha os dados do seu cartão para adicionar um novo método de pagamento.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-6 py-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Tipo do cartão</Label>
                        <RadioGroup value={cardType} onValueChange={setCardType} className="flex gap-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit" id="credit" />
                            <Label htmlFor="credit">Crédito</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="debit" id="debit" />
                            <Label htmlFor="debit">Débito</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Nome no Cartão</Label>
                        <Input
                          id="cardName"
                          placeholder="Nome completo"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          maxLength={50}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Validade</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            placeholder="123"
                            value={cardCvc}
                            onChange={handleCvcChange}
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAddCardDialogOpen(false)
                        setCardNumber("")
                        setCardName("")
                        setCardExpiry("")
                        setCardCvc("")
                        setCardType("credit")
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={addPaymentMethod}
                      disabled={addingCard}
                    >
                      {addingCard ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adicionando...
                        </>
                      ) : (
                        "Adicionar Cartão"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-2">
          {/* Pedidos com botão de confirmar retirada */}
          <Card>
            <CardHeader>
              <CardTitle>Meus Pedidos</CardTitle>
              <CardDescription>Histórico dos seus últimos pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.orders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Carregando...</span>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Collapsible key={order._id}>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-medium">Pedido #{order._id.slice(-6)}</h3>
                              <Badge variant={
                                order.status === 'completed' ? 'default' : 
                                order.status === 'processing' ? 'secondary' : 'outline'
                              }>
                                {order.status === 'completed' ? 'Concluído' : 
                                 order.status === 'processing' ? 'Processando' : order.status}
                              </Badge>
                              {order.pickupCode && order.status !== 'completed' && (
                                <Badge variant="outline" className="font-mono">
                                  Código: {order.pickupCode}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(order.createdAt)} • R$ {order.total.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.status === 'processing' && (
                              <AlertDialog open={confirmDialogOpen && selectedOrderId === order._id} onOpenChange={(open) => {
                                setConfirmDialogOpen(open)
                                if (!open) setSelectedOrderId("")
                              }}>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrderId(order._id)
                                      setConfirmDialogOpen(true)
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Confirmar Retirada
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar retirada do pedido</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Confirma que você retirou o pedido #{order._id.slice(-6)} com código {order.pickupCode}?
                                      <br />
                                      <strong>Total: R$ {order.total.toFixed(2)}</strong>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => confirmOrderPickup(order._id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Confirmar Retirada
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>
                        
                        <CollapsibleContent>
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-3">Itens do pedido:</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                                  {item.product.image && (
                                    <img 
                                      src={item.product.image} 
                                      alt={item.product.name}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Quantidade: {item.quantity} • 
                                      R$ {item.price.toFixed(2)} cada
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* QR Code section - only show for non-completed orders */}
                            {order.status !== 'completed' && order.pickupCode && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="font-medium mb-3">Código de retirada:</h4>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                  <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-2">Código numérico:</p>
                                    <div className="bg-muted p-3 rounded-lg">
                                      <p className="text-2xl font-bold tracking-wider font-mono">{order.pickupCode}</p>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-2">QR Code:</p>
                                    <Image 
                                      src="/qrcode.png" 
                                      alt="QR Code para retirada do pedido" 
                                      width={100} 
                                      height={100}
                                      className="border rounded-lg"
                                    />
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-2">
                                  Apresente qualquer uma das opções acima na loja física para retirar seu pedido
                                </p>
                              </div>
                            )}
                            
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex justify-between items-center font-medium">
                                <span>Total do pedido:</span>
                                <span>R$ {order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
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
                <Link href="/produtos">Continuar Comprando</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
