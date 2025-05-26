'use client'

import { useState, useEffect } from 'react'
import type { Produto } from '@/lib/types'

export function useProducts() {
  const [products, setProducts] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
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
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, error, refetch: fetchProducts }
}