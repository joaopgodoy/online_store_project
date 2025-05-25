"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/components/ui/use-toast"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem } = useCart()
  const { products, loading, error } = useProducts()
  const [quantidade, setQuantidade] = useState(1)
  const [productId, setProductId] = useState<string | null>(null)

  // Resolver os parâmetros de forma assíncrona
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  if (loading || !productId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando produto...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2 text-red-600">Erro ao carregar produto</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const produto = products.find((p) => p.id === productId)

  if (!produto) {
    notFound()
  }

  const getName = () => {
    return produto.name || "Produto sem nome"
  }
  const getDescription = () => produto.description || produto.descricao || ""
  const getPrice = () => produto.price || produto.preco || 0
  const getCategory = () => produto.category || produto.categoria || ""
  const getImage = () => produto.image || produto.imagem || "/placeholder.svg?height=300&width=300"
  const getAvailability = () => produto.inStock !== undefined ? produto.inStock : produto.disponivel !== undefined ? produto.disponivel : true

  const incrementarQuantidade = () => {
    setQuantidade((prev) => prev + 1)
  }

  const decrementarQuantidade = () => {
    setQuantidade((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const adicionarAoCarrinho = () => {
    if (!getAvailability()) return

    // Normalizar o produto para o formato esperado pelo carrinho
    const produtoNormalizado = {
      id: produto.id,
      name: getName(),
      descricao: getDescription(),
      preco: getPrice(),
      categoria: getCategory(),
      imagem: getImage(),
      disponivel: getAvailability()
    }

    for (let i = 0; i < quantidade; i++) {
      addItem(produtoNormalizado)
    }

    toast({
      title: "Produto adicionado ao carrinho",
      description: `${quantidade}x ${getName()} foi adicionado ao seu carrinho.`,
    })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Imagem do produto */}
        <div className="aspect-square relative overflow-hidden rounded-lg border">
          <Image
            src={getImage()}
            alt={getName()}
            fill
            className="object-cover"
          />
        </div>

        {/* Detalhes do produto */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {getCategory()}
            </Badge>
            <h1 className="text-3xl font-bold">{getName()}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              R$ {getPrice().toFixed(2)}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {getDescription()}
          </p>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={getAvailability() ? "default" : "destructive"}>
              {getAvailability() ? "Disponível" : "Indisponível"}
            </Badge>
          </div>

          {getAvailability() && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementarQuantidade}
                    disabled={quantidade <= 1}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantidade}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementarQuantidade}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={adicionarAoCarrinho}
                className="w-full"
                size="lg"
              >
                🛒 Adicionar ao Carrinho
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
