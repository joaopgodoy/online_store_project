"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
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

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [orderCode, setOrderCode] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simular processamento de pagamento
    setTimeout(() => {
      // Gerar código de 4 dígitos
      const code = Math.floor(1000 + Math.random() * 9000).toString()
      setOrderCode(code)
      setIsProcessing(false)

      // Limpar carrinho
      clearCart()

      // Mostrar mensagem de sucesso
      toast({
        title: "Compra finalizada com sucesso!",
        description: `Seu código de retirada é: ${code}`,
      })
    }, 1500)
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
                    src={item.imagem || "/placeholder.svg?height=80&width=80"}
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

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        {!orderCode ? (
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCheckout}>
              <DialogHeader>
                <DialogTitle>Finalizar Compra</DialogTitle>
                <DialogDescription>Preencha os dados do seu cartão para finalizar a compra.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Número do Cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardName">name no Cartão</Label>
                  <Input
                    id="cardName"
                    placeholder="name completo"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
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
              <DialogFooter>
                <Button type="submit" disabled={isProcessing}>
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
                <p className="text-muted-foreground">Total: R$ {total.toFixed(2)}</p>
                <p className="text-muted-foreground">Data: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setCheckoutOpen(false)
                  router.push("/")
                }}
                className="w-full"
              >
                Voltar para a Loja
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCheckoutOpen(false)
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
