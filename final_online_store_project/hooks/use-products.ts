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
        cache: 'no-store' // Ensure always fetches updated data
      })
      
      if (!response.ok) {
        throw new Error('Error loading products')
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  // Function to update a specific product without reloading the entire list
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
      console.error('Error updating product:', err)
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