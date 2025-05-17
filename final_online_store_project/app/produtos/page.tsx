import { produtos } from "@/lib/data"
import ProductCard from "@/components/product-card"

export default function AllProductsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos os Produtos</h1>
        <p className="text-muted-foreground">Confira todos os produtos disponíveis em nossa loja.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  )
}
