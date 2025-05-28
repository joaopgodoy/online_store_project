'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Produto } from '@/lib/types'

export function useProducts() {
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products', {
        cache: 'no-store' // Garantir que sempre busque dados atualizados
      })
      
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  // Função para atualizar um produto específico sem recarregar toda a lista
  const updateProduct = useCallback(async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        cache: 'no-store'
      })
      
      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(prev => prev.map(product => 
          product.id === productId ? updatedProduct : product
        ))
      }
    } catch (err) {
      console.error('Erro ao atualizar produto:', err)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchProducts,
    updateProduct
  }
}