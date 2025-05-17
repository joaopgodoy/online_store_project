import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { produtos } from "@/lib/data"

export default function Home() {
  const produtosDestacados = produtos.slice(0, 8)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="/placeholder.svg?height=500&width=1200"
          alt="Loja de Condomínio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center">Loja do Condomínio</h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
            Tudo o que você precisa sem sair do condomínio. Entrega rápida e prática!
          </p>
          <Button asChild size="lg">
            <Link href="/produtos">Ver Produtos</Link>
          </Button>
        </div>
      </div>

      {/* Produtos Mais Procurados */}
      <section className="container mx-auto py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Produtos Mais Procurados</h2>
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
      </section>

      {/* Categorias */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Nossas Categorias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/categorias/alimentos-bebidas"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Alimentos e Bebidas</h3>
              <p className="text-muted-foreground">Lanches, bebidas, produtos básicos e mais</p>
            </Link>
            <Link
              href="/categorias/higiene-cuidados"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Higiene e Cuidados Pessoais</h3>
              <p className="text-muted-foreground">Produtos para cuidados diários</p>
            </Link>
            <Link
              href="/categorias/limpeza"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">Limpeza</h3>
              <p className="text-muted-foreground">Produtos para manter sua casa limpa</p>
            </Link>
            <Link
              href="/categorias/farmacia-bem-estar"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
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
