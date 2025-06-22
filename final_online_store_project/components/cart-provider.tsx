"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Produto } from '@/lib/types'
import { useAuth } from '@/components/auth-provider'

interface CartItem extends Produto {
  quantidade: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (produto: Produto, quantidade?: number) => Promise<boolean>
  removeItem: (produtoId: string) => void
  updateQuantity: (produtoId: string, quantidade: number) => void
  clearCart: () => void
  cancelCart: () => void
  total: number
  totalFixed: number
  onProductUpdate?: () => void // Callback para refresh de produtos
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Utility function to retry cart operations that might encounter version conflicts
async function retryCartOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 100
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      // If it's a version error or connection error, retry
      const isRetryableError = 
        error.message?.includes('Version') ||
        error.message?.includes('version') ||
        error.message?.includes('conflict') ||
        error.status === 503 ||
        error.status === 502 ||
        (attempt < maxRetries && !error.message?.includes('Estoque'))
      
      if (isRetryableError && attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 100
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}

export function CartProvider({ children, onProductUpdate }: { children: ReactNode; onProductUpdate?: () => void }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()
  
  // Debounce para sincronização com backend
  const [syncTimeouts, setSyncTimeouts] = useState<Record<string, NodeJS.Timeout>>({})

  // Carregar carrinho quando o componente montar
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    if (isAuthenticated) {
      loadCartFromDatabase()
    } else {
      // Limpar carrinho local quando não estiver autenticado
      setItems([])
      localStorage.removeItem("cart")
    }
  }, [isAuthenticated])

  // Salvar carrinho no localStorage quando mudar (apenas para usuários não autenticados)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isAuthenticated])

  // Limpar timeouts quando o componente for desmontado
  useEffect(() => {
    return () => {
      Object.values(syncTimeouts).forEach(timeout => clearTimeout(timeout))
    }
  }, [syncTimeouts])

  const loadCartFromLocalStorage = () => {
    if (typeof window === 'undefined') {
      return
    }

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        // Silent error handling - user will see empty cart if load fails
      }
    }
  }

  const loadCartFromDatabase = async () => {
    try {
      if (typeof window === 'undefined') {
        return
      }

      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/users/me/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Converter formato da database para o formato do carrinho local
        const cartItems = data.cart.map((item: any) => ({
          id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          category: item.product.category,
          image: item.product.image, // A API já deve retornar a URL correta
          inStock: item.product.inStock,
          availableQuantity: item.product.availableQuantity,
          sold: item.product.sold,
          quantidade: item.quantity
        }))
        setItems(cartItems)
      }
    } catch (error) {
      // Silent error handling - cart will remain in current state
    }
  }

  // Função para sincronizar com backend usando debounce
  const debouncedSync = (productId: string, quantity: number, isUpdate = false, delay = 500) => {
    // Cancelar timeout anterior se existir
    if (syncTimeouts[productId]) {
      clearTimeout(syncTimeouts[productId])
    }

    // Criar novo timeout
    const newTimeout = setTimeout(async () => {
      try {
        await saveToDatabase(productId, quantity, isUpdate)
        // Limpar timeout do state após execução
        setSyncTimeouts(prev => {
          const newTimeouts = { ...prev }
          delete newTimeouts[productId]
          return newTimeouts
        })
      } catch (error) {
        console.warn('Erro na sincronização com backend:', error)
      }
    }, delay)

    // Salvar timeout no state
    setSyncTimeouts(prev => ({
      ...prev,
      [productId]: newTimeout
    }))
  }

  const saveToDatabase = async (productId: string, quantity: number, isUpdate = false) => {
    return await retryCartOperation(async () => {
      if (typeof window === 'undefined') {
        return false
      }

      const token = localStorage.getItem('token')
      if (!token) return false

      const endpoint = '/api/users/me/cart'
      const method = isUpdate ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      })

      if (!response.ok) {
        const errorData = await response.json()
        // Se é erro de estoque, mostrar mensagem específica
        if (response.status === 400 && errorData.message?.includes('Estoque')) {
          throw new Error(errorData.message)
        }
        
        // Para outros erros, incluir status para retry logic
        const error = new Error(errorData.message || 'Erro na operação')
        ;(error as any).status = response.status
        throw error
      }

      return true
    })
  }

  const addItem = async (produto: Produto, quantidade: number = 1): Promise<boolean> => {
    try {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated) {
        return false
      }

      // Verificar se o item já existe no carrinho
      const existingItem = items.find(item => item.id === produto.id)
      
      // Primeiro tentar salvar no banco de dados (que fará a validação de estoque)
      try {
        const saved = await saveToDatabase(produto.id, quantidade)
        if (!saved) {
          return false
        }
      } catch (stockError) {
        // Se é erro de estoque, re-throw para que seja tratado pela UI
        throw stockError
      }

      // Se salvou com sucesso no banco, atualizar carrinho local
      setItems((prevItems) => {
        if (existingItem) {
          return prevItems.map((item) => 
            item.id === produto.id 
              ? { ...item, quantidade: item.quantidade + quantidade } 
              : item
          )
        } else {
          return [...prevItems, { ...produto, quantidade }]
        }
      })

      // Chamar callback para refresh de produtos se fornecido
      if (onProductUpdate) {
        onProductUpdate()
      }

      return true
    } catch (error) {
      // Error already handled - return false to indicate failure
      // Re-throw errors relacionados a estoque para que possam ser tratados pela UI
      if (error instanceof Error && error.message.includes('Estoque')) {
        throw error
      }
      return false
    }
  }

  const removeItem = async (produtoId: string) => {
    try {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated) {
        return
      }

      // REMOÇÃO INSTANTÂNEA NO FRONTEND
      setItems((prevItems) => prevItems.filter((item) => item.id !== produtoId))

      // Sincronizar com backend com retry logic
      try {
        await retryCartOperation(async () => {
          await saveToDatabase(produtoId, 0, true)
        })
      } catch (error) {
        console.warn('Erro ao remover item do backend:', error)
        // Não fazer rollback para remoções, pois é preferível manter removido localmente
      }
    } catch (error) {
      // Silent error handling
      // Mesmo com erro na API, remove do carrinho local para não travar a UX
      setItems((prevItems) => prevItems.filter((item) => item.id !== produtoId))
    }
  }

  const updateQuantity = async (produtoId: string, novaQuantidade: number) => {
    try {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated) {
        return
      }

      if (novaQuantidade <= 0) {
        await removeItem(produtoId)
        return
      }

      // Encontrar o item atual
      const currentItem = items.find(item => item.id === produtoId)
      if (!currentItem) return

      // ATUALIZAÇÃO INSTANTÂNEA NO FRONTEND
      setItems((prevItems) => 
        prevItems.map((item) => 
          item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
        )
      )

      // Sincronizar com backend usando debounce (500ms de delay)
      debouncedSync(produtoId, novaQuantidade, true)

    } catch (error) {
      // Silent error handling
    }
  }

  const cancelCart = async () => {
    try {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated) {
        return
      }

      // Limpar carrinho na database com retry logic
      await retryCartOperation(async () => {
        if (typeof window === 'undefined') {
          return
        }

        const token = localStorage.getItem('token')
        if (token) {
          const response = await fetch('/api/users/me/cart', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (!response.ok) {
            const error = new Error('Erro ao cancelar carrinho')
            ;(error as any).status = response.status
            throw error
          }
        }
      })
    } catch (error) {
      console.warn('Erro ao cancelar carrinho:', error)
    } finally {
      // Limpar carrinho local mesmo se houver erro na API
      setItems([])
    }
  }

  const clearCart = async () => {
    try {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated) {
        return
      }

      // Quando finalizar compra, decrementar estoque de todos os itens
      const promises = items.map(item => 
        fetch(`/api/products/${item.id}`, {
          method: 'PATCH', // Usar PATCH para operação de compra final
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            quantity: item.quantidade
          }),
        })
      )

      await Promise.all(promises)

      // Limpar carrinho na database com retry logic
      await retryCartOperation(async () => {
        if (typeof window === 'undefined') {
          return
        }

        const token = localStorage.getItem('token')
        if (token) {
          const response = await fetch('/api/users/me/cart', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (!response.ok) {
            const error = new Error('Erro ao limpar carrinho')
            ;(error as any).status = response.status
            throw error
          }
        }
      })
    } catch (error) {
      console.warn('Erro ao limpar carrinho:', error)
    } finally {
      // Limpar carrinho local mesmo se houver erro na API
      setItems([])
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantidade, 0)
  const totalFixed = parseFloat(total.toFixed(2))

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cancelCart,
        total,
        totalFixed,
        onProductUpdate
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}
