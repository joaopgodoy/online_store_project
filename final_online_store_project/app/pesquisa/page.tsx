"use client"

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/product-card'
import type { Produto } from '@/lib/types'

function PesquisaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Stable search function to avoid recreation
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setProducts([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)
    
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        console.error('Erro ao buscar produtos')
        setProducts([])
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(query)}`)
      searchProducts(query)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  // Search on initial load and when URL param changes
  useEffect(() => {
    const queryParam = searchParams.get('q')
    if (queryParam) {
      setQuery(queryParam)
      searchProducts(queryParam)
    }
  }, [searchParams, searchProducts])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Pesquisar produtos..."
                value={query}
                onChange={handleInputChange}
                className="pl-10"
                autoFocus
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Pesquisar'
              )}
            </Button>
          </div>
        </form>

        {/* Results */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Pesquisando produtos...</span>
          </div>
        )}

        {!loading && hasSearched && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Resultados da pesquisa
              </h1>
              {query && (
                <p className="text-gray-600 mt-1">
                  {products.length} resultado{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''} para "{query}"
                </p>
              )}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhum produto encontrado
                </h2>
                <p className="text-gray-500">
                  Tente pesquisar com termos diferentes ou navegue pelas categorias
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Pesquisar produtos
            </h2>
            <p className="text-gray-500">
              Digite o nome do produto que você está procurando
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PesquisaPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Carregando...</span>
          </div>
        </div>
      </div>
    }>
      <PesquisaContent />
    </Suspense>
  )
}
