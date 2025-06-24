"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { 
  calculateAvailableQuantity, 
  formatAvailableText, 
  formatCartQuantityText,
  formatPrice,
  getProductImage
} from "@/lib/product-utils"
import type { Produto } from "@/lib/types"

interface CompactProductCardProps {
  product: Produto
  onProductClick?: () => void
}

export default function CompactProductCard({ product, onProductClick }: CompactProductCardProps) {
  const { items } = useCart()

  // Calculate available quantity considering items already in cart
  const availableQuantity = calculateAvailableQuantity(product, items)
  const quantityInCart = items.find(item => item.id === product.id)?.quantidade || 0

  if (!product) {
    return null
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent p-3">
      <Link href={`/produtos/${product.id}`} onClick={onProductClick}>
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={getProductImage(product)}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="text-xs mb-1">
                  {product.category}
                </Badge>
                <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {product.description}
                </p>
              </div>
              
              {/* Price and Stock */}
              <div className="flex flex-col items-end gap-1">
                <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                <Badge 
                  variant={product.inStock ? "default" : "destructive"}
                  className="text-xs"
                >
                  {product.inStock ? "Disponível" : "Indisponível"}
                </Badge>
              </div>
            </div>
            
            {/* Stock Info */}
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">
                {formatAvailableText(availableQuantity)}
                {quantityInCart > 0 && (
                  <span className="ml-1 text-orange-600">
                    {formatCartQuantityText(quantityInCart)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
