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
import { useAuth } from '@/components/auth-provider'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addItem, items } = useCart()
  const { products, loading, error, updateProduct } = useProducts()
  const { isAuthenticated } = useAuth()
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
  const getImage = () => produto.image || produto.imagem || "/placeholder.jpg?height=300&width=300"
  const getAvailability = () => produto.inStock !== undefined ? produto.inStock : produto.disponivel !== undefined ? produto.disponivel : true
  const getAvailableQuantity = () => (produto as any)?.availableQuantity ?? (produto as any)?.estoque ?? 0

  const incrementarQuantidade = () => {
    const itemNoCarrinho = items.find(item => item.id === produto.id)
    const quantidadeJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0
    const maxQuantity = getAvailableQuantity() - quantidadeJaNoCarrinho
    setQuantidade((prev) => (prev < maxQuantity ? prev + 1 : prev))
  }

  const decrementarQuantidade = () => {
    setQuantidade((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar produtos ao carrinho.",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    if (!getAvailability() || getAvailableQuantity() === 0) return

    // Verificar se já tem este produto no carrinho
    const itemNoCarrinho = items.find(item => item.id === produto.id)
    const quantidadeJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0
    const quantidadeTotalDesejada = quantidadeJaNoCarrinho + quantidade

    // Verificar se a quantidade total não excede o estoque disponível
    if (quantidadeTotalDesejada > getAvailableQuantity()) {
      toast({
        title: "Estoque insuficiente",
        description: `Você já tem ${quantidadeJaNoCarrinho} unidade(s) no carrinho. Máximo disponível: ${getAvailableQuantity()}`,
        variant: "destructive"
      })
      return
    }

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

    try {
      // Tentar adicionar ao carrinho com a quantidade selecionada
      const success = await addItem(produtoNormalizado, quantidade)

      if (success) {
        // Atualizar o produto específico para refletir a mudança no estoque em tempo real
        await updateProduct(produto.id)
        
        toast({
          title: "Produto adicionado ao carrinho",
          description: `${quantidade}x ${getName()} foi adicionado ao seu carrinho.`,
        })
        
        // Resetar quantidade para 1 após adicionar
        setQuantidade(1)
      } else {
        toast({
          title: "Erro ao adicionar produto",
          description: "Não foi possível adicionar o produto ao carrinho. Verifique o estoque disponível.",
          variant: "destructive"
        })
      }
    } catch (error) {
      // Capturar erros específicos de estoque
      if (error instanceof Error && error.message.includes('Estoque')) {
        toast({
          title: "Estoque insuficiente",
          description: error.message,
          variant: "destructive"
        })
        // Atualizar produto para refletir estoque atual
        await updateProduct(produto.id)
      } else {
        toast({
          title: "Erro ao adicionar produto",
          description: "Não foi possível adicionar o produto ao carrinho. Tente novamente.",
          variant: "destructive"
        })
      }
    }
  }

  // Verificar se o produto está disponível e tem estoque
  const isOutOfStock = !getAvailability() || getAvailableQuantity() === 0
  const availableQty = getAvailableQuantity()
  
  // Verificar quantidade já no carrinho
  const itemNoCarrinho = items.find(item => item.id === produto.id)
  const quantidadeJaNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0
  const quantidadeDisponivel = availableQty - quantidadeJaNoCarrinho

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

          {/* Mostrar quantidade disponível */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Estoque disponível:</span>
            <Badge variant={availableQty > 0 ? "outline" : "destructive"}>
              {availableQty} {availableQty === 1 ? "unidade" : "unidades"}
            </Badge>
          </div>

          {/* Mostrar quantidade no carrinho se houver */}
          {quantidadeJaNoCarrinho > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Já no carrinho:</span>
              <Badge variant="secondary">
                {quantidadeJaNoCarrinho} {quantidadeJaNoCarrinho === 1 ? "unidade" : "unidades"}
              </Badge>
            </div>
          )}

          {!isOutOfStock && quantidadeDisponivel > 0 ? (
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
                    disabled={quantidade >= quantidadeDisponivel}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
                {quantidade >= quantidadeDisponivel && quantidadeDisponivel > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Máximo disponível atingido!
                  </span>
                )}
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full"
                size="lg"
                disabled={isOutOfStock || quantidadeDisponivel === 0}
              >
                🛒 Adicionar ao Carrinho
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive font-medium">
                  {getAvailability() 
                    ? (quantidadeJaNoCarrinho > 0 
                        ? "Quantidade máxima já está no carrinho" 
                        : "Produto sem estoque")
                    : "Produto indisponível"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {quantidadeJaNoCarrinho > 0 
                    ? "Você já adicionou toda a quantidade disponível deste produto ao carrinho."
                    : "Este produto não está disponível para compra no momento."}
                </p>
              </div>
              <Button
                disabled
                className="w-full"
                size="lg"
              >
                {quantidadeJaNoCarrinho > 0 ? "Quantidade Máxima no Carrinho" : "Produto Indisponível"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
