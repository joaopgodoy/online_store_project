"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import type { Produto } from "@/lib/types"

interface ProductCardProps {
  product: Produto
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, items } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  // Calculate available quantity considering items already in cart
  const itemInCart = items.find(item => item.id === product.id)
  const quantityInCart = itemInCart?.quantidade || 0
  const availableQuantity = Math.max(0, product.availableQuantity - quantityInCart)

  if (!product) {
    return null
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product detail page
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive"
      })
      return
    }

    if (!product.inStock || availableQuantity < quantity) {
      toast({
        title: "Produto indisponível",
        description: "Não há estoque suficiente para a quantidade solicitada",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)
    try {
      const success = await addItem(product, quantity)
      if (success) {
        toast({
          title: "Produto adicionado ao carrinho",
          description: `${quantity}x ${product.name} foi adicionado ao seu carrinho.`,
        })
        setQuantity(1) // Reset quantity after successful add
      } else {
        toast({
          title: "Erro ao adicionar produto",
          description: "Não foi possível adicionar o produto ao carrinho. Verifique o estoque disponível.",
          variant: "destructive",
        })
      }
    } catch (error) {
      // Capture specific stock errors
      if (error instanceof Error && error.message.includes('Estoque')) {
        toast({
          title: "Estoque insuficiente",
          description: error.message,
          variant: "destructive"
        })
      } else {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
        toast({
          title: "Erro ao adicionar produto",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity < availableQuantity) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent">
      <Link href={`/produtos/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/produtos/${product.id}`}>
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          <h3 className="font-medium hover:text-primary transition-colors">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 h-10 overflow-hidden text-ellipsis">{product.description}</p>
        </Link>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">R$ {product.price.toFixed(2)}</span>
            <Badge variant={product.inStock ? "default" : "destructive"}>
              {product.inStock ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
          
          {/* Stock Information */}
          <div className="text-sm text-muted-foreground">
            Estoque: {availableQuantity} {availableQuantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}
            {quantityInCart > 0 && (
              <span className="ml-2 text-xs text-orange-600">
                ({quantityInCart} no carrinho)
              </span>
            )}
          </div>
        </div>

        {product.inStock && (
          <div className="mt-4 space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantidade:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium min-w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={incrementQuantity}
                  disabled={quantity >= availableQuantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || !product.inStock || availableQuantity === 0}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isAdding ? "Adicionando..." : availableQuantity === 0 ? "Sem Estoque" : "Adicionar ao Carrinho"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
