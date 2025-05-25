'use client'

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card"
import { useProducts } from "@/hooks/use-products"

interface CategoryPageProps {
  params: {
    categoria: string
  }
}

const categoriaInfo = {
  "alimentos-bebidas": {
    titulo: "Alimentos e Bebidas",
    descricao: "Lanches, bebidas, produtos básicos e mais para o seu dia a dia.",
  },
  "higiene-cuidados": {
    titulo: "Higiene e Cuidados Pessoais",
    descricao: "Produtos para seus cuidados diários e higiene pessoal.",
  },
  limpeza: {
    titulo: "Limpeza",
    descricao: "Produtos para manter sua casa limpa e organizada.",
  },
  "farmacia-bem-estar": {
    titulo: "Farmácia e Bem-estar",
    descricao: "Medicamentos e produtos para seu bem-estar e saúde.",
  },
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { products, loading, error } = useProducts()
  const [categoriaSlug, setCategoriaSlug] = useState<string | null>(null)
  
  // Resolve params asynchronously
  useEffect(() => {
    // Handle params resolution safely
    const resolveParams = async () => {
      try {
        // Check if params is a Promise
        if (params && typeof (params as any).then === 'function') {
          const resolvedParams = await (params as unknown as Promise<{ categoria: string }>)
          setCategoriaSlug(resolvedParams.categoria)
        } else {
          // If not a Promise, use directly
          setCategoriaSlug(params.categoria)
        }
      } catch (error) {
        console.error("Error resolving params:", error)
      }
    }
    
    resolveParams()
  }, [params])

  // Show loading state while resolving params
  if (!categoriaSlug || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando categoria...</span>
        </div>
      </div>
    )
  }

  // Check if the category exists
  if (!Object.keys(categoriaInfo).includes(categoriaSlug)) {
    notFound()
  }

  const categoria = categoriaInfo[categoriaSlug as keyof typeof categoriaInfo]

  const categoriaMapeada = {
    "alimentos-bebidas": "Alimentos e Bebidas",
    "higiene-cuidados": "Higiene e Cuidados Pessoais",
    limpeza: "Limpeza",
    "farmacia-bem-estar": "Farmácia e Bem-estar",
  }

  const produtosFiltrados = products.filter((produto) => {
    const categoriaName = categoriaMapeada[categoriaSlug as keyof typeof categoriaMapeada]
    return produto.categoria === categoriaName
  })

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{categoria.titulo}</h1>
          <p className="text-muted-foreground">{categoria.descricao}</p>
        </div>
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
        <h1 className="text-3xl font-bold mb-2">{categoria.titulo}</h1>
        <p className="text-muted-foreground">{categoria.descricao}</p>
      </div>

      {produtosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Nenhum produto encontrado</h2>
          <p className="text-muted-foreground">Não encontramos produtos nesta categoria no momento.</p>
        </div>
      )}
    </div>
  )
}
