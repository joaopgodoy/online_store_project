"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import QuantityControls from "@/components/ui/quantity-controls"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useCommonToasts } from "@/lib/toast-utils"
import { 
  calculateAvailableQuantity, 
  formatStockText, 
  formatCartQuantityText,
  formatPrice,
  getProductImage,
  isProductOutOfStock
} from "@/lib/product-utils"
import type { Produto } from "@/lib/types"

interface ProductCardProps {
  product: Produto
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem, items } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const toasts = useCommonToasts()

  // Calculate available quantity considering items already in cart
  const availableQuantity = calculateAvailableQuantity(product, items)

  if (!product) {
    return null
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product detail page
    e.stopPropagation()

    if (!isAuthenticated) {
      toasts.loginRequired()
      router.push('/login')
      return
    }

    if (isProductOutOfStock(product, availableQuantity) || availableQuantity < quantity) {
      toasts.productUnavailable("Não há estoque suficiente para a quantidade solicitada")
      return
    }

    setIsAdding(true)
    try {
      const success = await addItem(product, quantity)
      if (success) {
        toasts.productAdded(quantity, product.name)
        setQuantity(1) // Reset quantity after successful add
      } else {
        toasts.addToCartError("Não foi possível adicionar o produto ao carrinho. Verifique o estoque disponível.")
      }
    } catch (error) {
      // Capture specific stock errors
      if (error instanceof Error && error.message.includes('Estoque')) {
        toasts.stockInsufficient(error.message)
      } else {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
        toasts.addToCartError(errorMessage)
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
            src={getProductImage(product)}
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
            <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
            <Badge variant={product.inStock ? "default" : "destructive"}>
              {product.inStock ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
          
          {/* Stock Information */}
          <div className="text-sm text-muted-foreground">
            Estoque: {formatStockText(availableQuantity)}
            {items.find(item => item.id === product.id) && (
              <span className="ml-2 text-xs text-orange-600">
                {formatCartQuantityText(items.find(item => item.id === product.id)?.quantidade || 0)}
              </span>
            )}
          </div>
        </div>

        {product.inStock && (
          <div className="mt-4 space-y-3">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quantidade:</span>
              <QuantityControls
                quantity={quantity}
                onIncrement={incrementQuantity}
                onDecrement={decrementQuantity}
                maxQuantity={availableQuantity}
                size="sm"
              />
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
