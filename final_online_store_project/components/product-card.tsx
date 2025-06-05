import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Produto } from "@/lib/types"

interface ProductCardProps {
  product: Produto
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) {
    return null
  }

  return (
    <Link href={`/produtos/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>
          <h3 className="font-medium">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold">R$ {product.price.toFixed(2)}</span>
            <Badge variant={product.inStock ? "default" : "destructive"}>
              {product.inStock ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}
