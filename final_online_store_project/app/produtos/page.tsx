'use client'

import ProductCard from "@/components/product-card"
import { useProducts } from "@/hooks/use-products"

export default function AllProductsPage() {
  const { products, loading, error } = useProducts()

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando produtos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2 text-red-600">Erro ao carregar produtos</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos os Produtos</h1>
        <p className="text-muted-foreground">Confira todos os produtos disponíveis em nossa loja.</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((produto) => (
            <ProductCard key={produto.id} product={produto} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Nenhum produto encontrado</h2>
          <p className="text-muted-foreground">Não há produtos disponíveis no momento.</p>
        </div>
      )}
    </div>
  )
}