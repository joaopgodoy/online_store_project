import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Produto } from "@/lib/types"

interface ProductCardProps {
  produto: Produto
}

export default function ProductCard({ produto }: ProductCardProps) {
  // Função helper para pegar o valor correto independente do formato - CORRIGIDO: priorizar campos do database (em inglês)
  const getName = () => {
    console.log('ProductCard - Produto:', produto) // Debug
    return produto.name || produto.name || "Produto sem name"
  }
  const getDescription = () => produto.description || produto.descricao || ""
  const getPrice = () => produto.price || produto.preco || 0
  const getCategory = () => produto.category || produto.categoria || ""
  const getImage = () => produto.image || produto.imagem || "/placeholder.jpg?height=300&width=300"
  const getAvailability = () => produto.inStock !== undefined ? produto.inStock : produto.disponivel !== undefined ? produto.disponivel : true

  return (
    <Link href={`/produtos/${produto.id}`} className="group">
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
