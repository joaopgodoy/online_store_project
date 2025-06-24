"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Minus, Plus, ShoppingBag, Trash2, CreditCard, Plus as PlusIcon } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useProducts } from "@/hooks/use-products"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { formatCardNumber, formatCardExpiry, formatCardCvc } from "@/lib/product-utils"
interface PaymentMethod {
  _id: string
  type: string
  lastFourDigits: string
  cardholderName: string
  createdAt: string
  isDefault?: boolean
}

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { products } = useProducts()
  
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [showNewCardForm, setShowNewCardForm] = useState(false)
  
  // Dados do novo cartão
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardType, setCardType] = useState("credit")
  
  const [orderCode, setOrderCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [finalTotal, setFinalTotal] = useState(0)
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false)

  // Função para obter estoque disponível de um produto
  const getAvailableStock = (productId: string) => {
    // Primeiro, tentar buscar da lista de produtos (mais atualizada)
    const product = products.find(p => p.id === productId)
    if (product && typeof product.availableQuantity === 'number') {
      return product.availableQuantity
    }
    
    // Se não encontrou na lista de produtos ou se estiver carregando,
    // usar os dados do item do carrinho como fallback
    const cartItem = items.find(item => item.id === productId)
    if (cartItem && typeof cartItem.availableQuantity === 'number') {
      return cartItem.availableQuantity
    }
    
    // Se não conseguiu obter de lugar nenhum, retornar um valor alto
    // para não bloquear a funcionalidade enquanto carrega
    return 999
  }

  // Função para incrementar quantidade com validação otimizada
  const handleIncrementQuantity = (item: any) => {
    const availableStock = getAvailableStock(item.id)
    const currentQuantityInCart = item.quantidade
    
    // Atualização imediata primeiro
    updateQuantity(item.id, item.quantidade + 1)
    
    // Verificação básica de estoque - mostra aviso se necessário
    // Só mostrar aviso se o estoque foi carregado (< 999) e realmente atingiu o limite
    if (availableStock < 999 && currentQuantityInCart + 1 >= availableStock) {
      toast({
        title: "Atenção",
        description: `Você está próximo do limite de estoque (${availableStock} ${availableStock === 1 ? 'unidade' : 'unidades'} disponíveis).`,
        variant: "default"
      })
    }
  }

  // Buscar métodos de pagamento quando abrir o checkout
  useEffect(() => {
    if (checkoutOpen && isAuthenticated) {
      fetchPaymentMethods()
    }
  }, [checkoutOpen, isAuthenticated])

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        console.warn('Token não encontrado')
        setPaymentMethods([])
        setShowNewCardForm(true)
        return
      }

      const response = await axios.get('/api/users/me/payment-methods', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const methods = Array.isArray(response.data) ? response.data : []
      setPaymentMethods(methods)
      
      if (methods.length > 0) {
        // Selecionar o cartão padrão ou o primeiro disponível
        const defaultCard = methods.find((m: any) => m.isDefault) || methods[0]
        setSelectedPaymentMethod(defaultCard._id)
      } else {
        setShowNewCardForm(true)
      }
    } catch (error: any) {
      console.error('Erro ao buscar métodos de pagamento:', error)
      setPaymentMethods([])
      setShowNewCardForm(true)
      
      // Só mostrar toast de erro se não for 401 (não autenticado)
      if (error.response?.status !== 401) {
        toast({
          title: "Aviso",
          description: "Não foi possível carregar métodos de pagamento salvos. Você pode adicionar um novo cartão.",
          variant: "default"
        })
      }
    } finally {
      setLoadingPaymentMethods(false)
    }
  }

  // Funções de formatação para os campos do cartão
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    // Limita a 19 caracteres (16 números + 3 espaços)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardExpiry(e.target.value)
    setCardExpiry(formatted)
  }

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardCvc(e.target.value)
    setCardCvc(formatted)
  }

  // Função para alternar entre usar cartão existente e adicionar novo
  const toggleCardForm = () => {
    setShowNewCardForm(!showNewCardForm)
    if (!showNewCardForm) {
      // Ao mostrar formulário, limpar seleção de cartão existente
      setSelectedPaymentMethod("")
    } else {
      // Ao ocultar formulário, selecionar primeiro cartão disponível
      if (paymentMethods.length > 0) {
        const defaultCard = paymentMethods.find(m => m.isDefault) || paymentMethods[0]
        setSelectedPaymentMethod(defaultCard._id)
      }
    }
  }

  const savePaymentMethodAndGetId = async () => {
    try {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        toast({
          title: "Erro",
          description: "Todos os campos do cartão são obrigatórios",
          variant: "destructive"
        })
        return null
      }

      // Validações específicas
      const cleanCardNumber = cardNumber.replace(/\s/g, '')
      if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        toast({
          title: "Erro",
          description: "Número do cartão deve ter entre 13 e 19 dígitos",
          variant: "destructive"
        })
        return null
      }

      if (cardExpiry.length !== 5) {
        toast({
          title: "Erro",
          description: "Data de validade deve estar no formato MM/AA",
          variant: "destructive"
        })
        return null
      }

      if (cardCvc.length < 3) {
        toast({
          title: "Erro",
          description: "CVC deve ter pelo menos 3 dígitos",
          variant: "destructive"
        })
        return null
      }

      // Pegar token do localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erro",
          description: "Token de autenticação não encontrado",
          variant: "destructive"
        })
        return null
      }

      const requestData = {
        cardNumber: cleanCardNumber,
        cardName: cardName.trim(),
        cardExpiry,
        type: cardType
      }

      const response = await fetch('/api/users/me/payment-methods', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`)
      }

      const data = await response.json()
      const newPaymentMethod = data.paymentMethod
      
      if (!newPaymentMethod || !newPaymentMethod._id) {
        throw new Error('Método de pagamento não retornado pela API')
      }
      
      // Atualizar estado local
      setPaymentMethods(prev => [...prev, newPaymentMethod])
      setSelectedPaymentMethod(newPaymentMethod._id)
      
      // Ocultar o formulário automaticamente após adicionar o cartão
      setShowNewCardForm(false)

      // Limpar campos
      setCardNumber("")
      setCardName("")
      setCardExpiry("")
      setCardCvc("")

      toast({
        title: "Sucesso",
        description: "Método de pagamento adicionado com sucesso!"
      })

      // Retornar o ID do método de pagamento criado
      return newPaymentMethod._id
    } catch (error: any) {
      console.error('Erro ao salvar método de pagamento:', error)
      
      let errorMessage = "Erro ao salvar método de pagamento"
      
      if (error.message?.includes('401') || error.message?.includes('Token')) {
        errorMessage = "Sessão expirada. Faça login novamente."
        router.push('/login')
      } else if (error.message?.includes('400')) {
        errorMessage = error.message || "Dados do cartão inválidos"
      } else if (error.message?.includes('500')) {
        errorMessage = "Erro interno do servidor. Tente novamente."
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      })
      return null
    }
  }

  const createOrder = async () => {
    try {
      let paymentMethodId = selectedPaymentMethod

      // Verificar se precisamos salvar um novo cartão primeiro
      if (showNewCardForm && (!selectedPaymentMethod || selectedPaymentMethod === "")) {
        const savedPaymentMethodId = await savePaymentMethodAndGetId()
        if (!savedPaymentMethodId) return null
        
        // Usar o ID retornado diretamente
        paymentMethodId = savedPaymentMethodId
        
      }

      // Se não temos método de pagamento selecionado
      if (!paymentMethodId) {
        toast({
          title: "Erro",
          description: "Selecione um método de pagamento",
          variant: "destructive"
        })
        return null
      }

      // Preparar items do pedido
      const orderItems = items.map(item => ({
        product: item.id,
        quantity: item.quantidade,
        price: item.price
      }))

      const orderData = {
        items: orderItems,
        total: total,
        paymentMethod: paymentMethodId
      }

      console.log('Dados do pedido:', orderData)

      const token = localStorage.getItem('token')
      const response = await axios.post('/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      return response.data
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao processar pedido",
        variant: "destructive"
      })
      return null
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast({
        title: "Erro",
        description: "Faça login para finalizar a compra",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    setIsProcessing(true)
    setFinalTotal(total)

    try {
      // Criar o pedido (que irá adicionar cartão se necessário)
      const orderResult = await createOrder()
      
      if (orderResult) {
        setOrderCode(orderResult.pickupCode)
        
        // Esvaziar carrinho após compra finalizada
        await clearCart()
        
        toast({
          title: "Compra finalizada com sucesso!",
          description: `Seu código de retirada é: ${orderResult.pickupCode}`,
        })
      }
    } catch (error) {
      console.error('Erro no checkout:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetCheckoutState = () => {
    setCheckoutOpen(false)
    setFinalTotal(0)
    setOrderCode("")
    setCardNumber("")
    setCardName("")
    setCardExpiry("")
    setCardCvc("")
    setIsProcessing(false)
    setShowNewCardForm(false)
    setSelectedPaymentMethod("")
  }

  // Verificar autenticação no carregamento da página
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para acessar seu carrinho.",
        variant: "destructive"
      })
      router.push('/login')
    }
  }, [isAuthenticated, router, toast])

  // Se não estiver autenticado, não renderizar nada
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Redirecionando para login...</p>
      </div>
    )
  }

  if (items.length === 0 && !orderCode) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-6">Adicione alguns produtos para começar a comprar.</p>
        <Button asChild>
          <Link href="/produtos">Ver Produtos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Seu Carrinho</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const availableStock = getAvailableStock(item.id)
              // Só mostrar "quantidade máxima atingida" se:
              // 1. O estoque disponível é um número válido e menor que 999 (dados reais carregados)
              // 2. A quantidade no carrinho é maior ou igual ao estoque disponível
              const isMaxQuantity = availableStock < 999 && item.quantidade >= availableStock
              
              return (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative w-20 h-20 overflow-hidden rounded-md">
                  <Image
                    src={item.image || "/placeholder.jpg?height=80&width=80"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="font-semibold">R$ {item.price.toFixed(2)}</p>
                  {isMaxQuantity && (
                    <p className="text-xs text-amber-600 mt-1">
                      Quantidade máxima atingida
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantidade - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantidade}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleIncrementQuantity(item)}
                    disabled={availableStock < 999 && isMaxQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              )
            })}
          </div>
          
          {/* Botão Continuar Comprando abaixo dos produtos */}
          <div className="mt-6">
            <Button variant="outline" asChild className="w-full">
              <Link href="/produtos">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
              <CardDescription>Revise os itens do seu carrinho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantidade}x {item.name}
                    </span>
                    <span>R$ {(item.price * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" onClick={() => setCheckoutOpen(true)}>
                Finalizar Compra
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={checkoutOpen} onOpenChange={(open) => {
        if (!open && orderCode) {
          resetCheckoutState()
        } else {
          setCheckoutOpen(open)
        }
      }}>
        {!orderCode ? (
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCheckout}>
              <DialogHeader>
                <DialogTitle>Finalizar Compra</DialogTitle>
                <DialogDescription>
                  Selecione ou adicione um método de pagamento para finalizar sua compra.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                {loadingPaymentMethods ? (
                  <div className="text-center">Carregando métodos de pagamento...</div>
                ) : (
                  <>
                    {/* Métodos de pagamento existentes */}
                    {paymentMethods.length > 0 && !showNewCardForm && (
                      <div className="space-y-4">
                        <Label>Métodos de pagamento salvos</Label>
                        <RadioGroup 
                          value={selectedPaymentMethod} 
                          onValueChange={setSelectedPaymentMethod}
                        >
                          {paymentMethods.map((method) => (
                            <div key={method._id} className="flex items-center space-x-2">
                              <RadioGroupItem value={method._id} id={method._id} />
                              <Label htmlFor={method._id} className="flex items-center gap-2 cursor-pointer flex-1">
                                <CreditCard className="h-4 w-4" />
                                <div className="flex-1">
                                  <span className="font-medium">
                                    {method.type === 'credit' ? 'Crédito' : 'Débito'} •••• {method.lastFourDigits}
                                  </span>
                                  <span className="text-sm text-muted-foreground ml-2">
                                    ({method.cardholderName})
                                  </span>
                                  {method.isDefault && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Padrão
                                    </Badge>
                                  )}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowNewCardForm(true)}
                          className="w-full"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Adicionar novo cartão
                        </Button>
                      </div>
                    )}

                    {/* Formulário para novo cartão */}
                    {showNewCardForm && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Novo método de pagamento</Label>
                          {paymentMethods.length > 0 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowNewCardForm(false)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                        
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
                    )}
                  </>
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit" disabled={isProcessing} className="w-full">
                  {isProcessing ? "Processando..." : `Pagar R$ ${total.toFixed(2)}`}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        ) : (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center text-center">
                <Check className="h-6 w-6 text-green-500 mr-2" /> Compra Finalizada com Sucesso!
              </DialogTitle>
              <DialogDescription className="text-center">
                Seu pedido foi processado e está pronto para retirada.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 text-center">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Apresente este código na loja física para retirar seu pedido:
                </p>
                <div className="bg-muted p-4 rounded-lg mb-2">
                  <p className="text-4xl font-bold tracking-widest">{orderCode}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Este código é válido por 24 horas. Guarde-o com cuidado.
                </p>
              </div>

              {/* QR Code */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Ou apresente este QR code:
                </p>
                <div className="flex justify-center">
                  <Image 
                    src="/qrcode.png" 
                    alt="QR Code para retirada do pedido" 
                    width={150} 
                    height={150}
                    className="border rounded-lg"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-medium mb-1">Resumo da compra:</p>
                <p className="text-muted-foreground">Total: R$ {finalTotal.toFixed(2)}</p>
                <p className="text-muted-foreground">Data: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  resetCheckoutState()
                  router.push("/")
                }}
                className="w-full"
              >
                Voltar para a Loja
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetCheckoutState()
                  router.push("/perfil")
                }}
              >
                Ver Meus Pedidos
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
