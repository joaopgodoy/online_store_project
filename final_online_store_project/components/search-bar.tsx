"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CompactProductCard from '@/components/compact-product-card'
import type { Produto } from '@/lib/types'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Produto[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced search function
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        // Get only the first 4 results
        setSearchResults(data.slice(0, 4))
        setShowResults(true)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setSearchResults([])
      setShowResults(false)
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounce search queries
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        searchProducts(query)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, searchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/pesquisa?q=${encodeURIComponent(query)}`)
      setQuery('')
      onClose()
    }
  }

  const handleClose = () => {
    setQuery('')
    setSearchResults([])
    setShowResults(false)
    onClose()
  }

  // Focus input when search bar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle Escape key and clicks outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      ref={searchContainerRef}
      className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm z-50 animate-in slide-in-from-top-0 duration-150"
    >
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Pesquisar produtos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button type="submit" size="sm" disabled={!query.trim()}>
            Pesquisar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </form>
        
        {/* Search Results Dropdown */}
        {showResults && (
          <div className="mt-4 bg-background border rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">
                Pesquisando...
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="p-3 border-b bg-muted/50">
                  <h3 className="font-medium text-sm">Melhores resultados</h3>
                </div>
                <div className="space-y-1 p-2">
                  {searchResults.map((product) => (
                    <CompactProductCard 
                      key={product.id}
                      product={product} 
                      onProductClick={handleClose}
                    />
                  ))}
                </div>
                {query.trim() && (
                  <div className="p-3 border-t bg-muted/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        router.push(`/pesquisa?q=${encodeURIComponent(query)}`)
                        handleClose()
                      }}
                      className="w-full"
                    >
                      Ver todos os resultados para "{query}"
                    </Button>
                  </div>
                )}
              </>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum produto encontrado
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
