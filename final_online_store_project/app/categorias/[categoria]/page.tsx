import { notFound } from "next/navigation"

import { produtos } from "@/lib/data"
import ProductCard from "@/components/product-card"

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
  const categoriaSlug = params.categoria

  // Verificar se a categoria existe
  if (!Object.keys(categoriaInfo).includes(categoriaSlug)) {
    notFound()
  }

  const categoria = categoriaInfo[categoriaSlug as keyof typeof categoriaInfo]

  // Mapear os slugs de categoria para os nomes de categoria no data.ts
  const categoriaMapeada = {
    "alimentos-bebidas": "Alimentos e Bebidas",
    "higiene-cuidados": "Higiene e Cuidados Pessoais",
    limpeza: "Limpeza",
    "farmacia-bem-estar": "Farmácia e Bem-estar",
  }

  // Filtrar produtos por categoria usando o mapeamento
  const produtosFiltrados = produtos.filter((produto) => {
    const categoriaNome = categoriaMapeada[categoriaSlug as keyof typeof categoriaMapeada]
    return produto.categoria === categoriaNome
  })

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
