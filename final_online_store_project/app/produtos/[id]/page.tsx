"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { produtos } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()
  const [quantidade, setQuantidade] = useState(1)

  const produto = produtos.find((p) => p.id === params.id)

  if (!produto) {
    notFound()
  }

  const incrementarQuantidade = () => {
    setQuantidade((prev) => prev + 1)
  }

  const decrementarQuantidade = () => {
    setQuantidade((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const adicionarAoCarrinho = () => {
    if (!produto.disponivel) return

    // Adicionar ao carrinho quantidade vezes
    for (let i = 0; i < quantidade; i++) {
      addItem(produto)
    }

    toast({
      title: "Produto adicionado ao carrinho",
      description: `${quantidade}x ${produto.nome} foi adicionado ao seu carrinho.`,
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem do Produto */}
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={produto.imagem || "/placeholder.svg?height=600&width=600"}
            alt={produto.nome}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Detalhes do Produto */}
        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit mb-2">
            {produto.categoria}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{produto.nome}</h1>
          <p className="text-2xl font-semibold mb-4">R$ {produto.preco.toFixed(2)}</p>

          <Badge variant={produto.disponivel ? "default" : "destructive"} className="w-fit mb-6">
            {produto.disponivel ? "Em estoque" : "Indisponível"}
          </Badge>

          <div className="prose max-w-none mb-6">
            <p>{produto.descricao}</p>
          </div>

          {produto.disponivel ? (
            <>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-medium">Quantidade:</span>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" onClick={decrementarQuantidade} disabled={quantidade <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantidade}</span>
                  <Button variant="outline" size="icon" onClick={incrementarQuantidade}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button size="lg" className="w-full md:w-auto" onClick={adicionarAoCarrinho}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </>
          ) : (
            <Button size="lg" className="w-full md:w-auto" disabled>
              Produto Indisponível
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
