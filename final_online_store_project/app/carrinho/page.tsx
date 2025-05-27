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

interface PaymentMethod {
  _id: string
  type: string
  lastFourDigits: string
  cardholderName: string
  createdAt: string
}

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  
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

  // Buscar métodos de pagamento quando abrir o checkout
  useEffect(() => {
    if (checkoutOpen && isAuthenticated) {
      fetchPaymentMethods()
    }
  }, [checkoutOpen, isAuthenticated])

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true)
      const response = await axios.get('/api/users/me/payment-methods')
      
      if (response.data) {
        setPaymentMethods([response.data])
        setSelectedPaymentMethod(response.data._id)
      } else {
        setPaymentMethods([])
        setShowNewCardForm(true)
      }
    } catch (error) {
      console.error('Erro ao buscar métodos de pagamento:', error)
      setPaymentMethods([])
      setShowNewCardForm(true)
    } finally {
      setLoadingPaymentMethods(false)
    }
  }

  const savePaymentMethod = async () => {
    try {
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        toast({
          title: "Erro",
          description: "Todos os campos do cartão são obrigatórios",
          variant: "destructive"
        })
        return false
      }

      // Pegar token do localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Erro",
          description: "Token de autenticação não encontrado",
          variant: "destructive"
        })
        return false
      }

      const response = await axios.post('/api/users/me/payment-methods', {
        cardNumber,
        cardName,
        cardExpiry,
        type: cardType
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const newPaymentMethod = response.data.paymentMethod
      setPaymentMethods([newPaymentMethod])
      setSelectedPaymentMethod(newPaymentMethod._id)
      setShowNewCardForm(false)
      
      // Limpar campos
      setCardNumber("")
      setCardName("")
      setCardExpiry("")
      setCardCvc("")

      toast({
        title: "Sucesso",
        description: "Método de pagamento salvo com sucesso!"
      })

      return true
    } catch (error: any) {
      console.error('Erro ao salvar método de pagamento:', error)
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar método de pagamento",
        variant: "destructive"
      })
      return false
    }
  }

  const createOrder = async () => {
    try {
      if (!selectedPaymentMethod && !showNewCardForm) {
        toast({
          title: "Erro",
          description: "Selecione um método de pagamento",
          variant: "destructive"
        })
        return null
      }

      // Se está usando um novo cartão, salvar primeiro
      if (showNewCardForm) {
        const saved = await savePaymentMethod()
        if (!saved) return null
      }

      // Preparar items do pedido
      const orderItems = items.map(item => ({
        product: item.id,
        quantity: item.quantidade,
        price: item.preco
      }))

      const orderData = {
        items: orderItems,
        total: total,
        paymentMethod: selectedPaymentMethod
      }

      const response = await axios.post('/api/orders', orderData)
      
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
      // Criar o pedido
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
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Seu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative w-20 h-20 overflow-hidden rounded-md">
                  <Image
                    src={item.imagem || "/placeholder.jpg?height=80&width=80"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.categoria}</p>
                  <p className="font-semibold">R$ {item.preco.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantidade - 1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantidade}</span>
                  <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantidade + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
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
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
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
                              <Label htmlFor={method._id} className="flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-4 w-4" />
                                {method.type === 'credit' ? 'Crédito' : 'Débito'} •••• {method.lastFourDigits}
                                <span className="text-sm text-muted-foreground">
                                  ({method.cardholderName})
                                </span>
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
                              onChange={(e) => setCardNumber(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cardName">Nome no Cartão</Label>
                            <Input
                              id="cardName"
                              placeholder="Nome completo"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
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
                                onChange={(e) => setCardExpiry(e.target.value)}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="cardCvc">CVC</Label>
                              <Input
                                id="cardCvc"
                                placeholder="123"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
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
