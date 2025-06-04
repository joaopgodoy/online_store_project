import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Produto } from "@/lib/types"

interface ProductCardProps {
  product?: Produto
  produto?: Produto
}

export default function ProductCard({ product, produto }: ProductCardProps) {
  // Use product or produto (for backward compatibility)
  const prod = product || produto
  
  if (!prod) {
    return null
  }

  // Função helper para pegar o valor correto independente do formato - CORRIGIDO: priorizar campos do database (em inglês)
  const getName = () => {
    console.log('ProductCard - Produto:', prod) // Debug
    return prod.name || "Produto sem nome"
  }
  const getDescription = () => prod.description || prod.descricao || ""
  const getPrice = () => prod.price || prod.preco || 0
  const getCategory = () => prod.category || prod.categoria || ""
  const getImage = () => prod.image || prod.imagem || "/placeholder.jpg?height=300&width=300"
  const getAvailability = () => prod.inStock !== undefined ? prod.inStock : prod.disponivel !== undefined ? prod.disponivel : true

  return (
    <Link href={`/produtos/${prod.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={getImage()}
            alt={getName()}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <Badge variant="outline" className="mb-2">
            {getCategory()}
          </Badge>
          <h3 className="font-medium">{getName()}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{getDescription()}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold">R$ {getPrice().toFixed(2)}</span>
            <Badge variant={getAvailability() ? "default" : "destructive"}>
              {getAvailability() ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}
