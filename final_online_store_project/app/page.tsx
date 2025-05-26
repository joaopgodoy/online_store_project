"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { useProducts } from "@/hooks/use-products"

export default function Home() {
  const { products, loading, error } = useProducts()
  const produtosDestacados = products.slice(0, 8)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="/placeholder.svg?height=500&width=1200"
          alt="Near Market"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">Near Market</h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
            O seu mercado em casa!
          </p>
          <Button asChild size="lg">
            <Link href="/produtos">Ver Produtos</Link>
          </Button>
        </div>
      </div>

      {/* Produtos Mais Procurados */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Produtos Mais Procurados</h2>
        
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando produtos...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2 text-red-600">Erro ao carregar produtos</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {produtosDestacados.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button asChild size="lg">
                <Link href="/produtos">Ver Todos os Produtos</Link>
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Categorias */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Nossas Categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/categorias/alimentos-bebidas"
              className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Alimentos e Bebidas</h3>
              <p className="text-muted-foreground">Lanches, bebidas, produtos básicos e mais</p>
            </Link>
            <Link
              href="/categorias/higiene-cuidados"
              className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Higiene e Cuidados</h3>
              <p className="text-muted-foreground">Produtos para cuidados diários</p>
            </Link>
            <Link
              href="/categorias/limpeza"
              className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Limpeza</h3>
              <p className="text-muted-foreground">Produtos para manter sua casa limpa</p>
            </Link>
            <Link
              href="/categorias/farmacia-bem-estar"
              className="bg-background p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Farmácia e Bem-estar</h3>
              <p className="text-muted-foreground">Medicamentos e produtos para seu bem-estar</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
