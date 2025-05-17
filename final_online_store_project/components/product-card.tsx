import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Produto } from "@/lib/types"

interface ProductCardProps {
  produto: Produto
}

export default function ProductCard({ produto }: ProductCardProps) {
  return (
    <Link href={`/produtos/${produto.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg border bg-background transition-colors hover:bg-accent">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={produto.imagem || "/placeholder.svg?height=300&width=300"}
            alt={produto.nome}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <Badge variant="outline" className="mb-2">
            {produto.categoria}
          </Badge>
          <h3 className="font-medium">{produto.nome}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{produto.descricao}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-semibold">R$ {produto.preco.toFixed(2)}</span>
            <Badge variant={produto.disponivel ? "default" : "destructive"}>
              {produto.disponivel ? "Disponível" : "Indisponível"}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}
