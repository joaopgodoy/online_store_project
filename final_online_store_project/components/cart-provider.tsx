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

export function CartProvider({ children, onProductUpdate }: { children: ReactNode; onProductUpdate?: () => void }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()

  // Carregar carrinho quando o componente montar
  useEffect(() => {
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
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isAuthenticated])

  const loadCartFromLocalStorage = () => {
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
          descricao: item.product.description,
          preco: item.product.price,
          categoria: item.product.category,
          imagem: item.product.image,
          disponivel: item.product.inStock,
          quantidade: item.quantity
        }))
        setItems(cartItems)
      }
    } catch (error) {
      // Silent error handling - cart will remain in current state
    }
  }

  const saveToDatabase = async (productId: string, quantity: number, isUpdate = false) => {
    try {
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
        return false
      }

      return true
    } catch (error) {
      // Re-throw para que possa ser capturado pelo addItem e mostrado ao usuário
      if (error instanceof Error && error.message.includes('Estoque')) {
        throw error
      }
      return false
    }
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

      // Atualizar na database (remover do carrinho)
      await saveToDatabase(produtoId, 0, true)

      // Remover do carrinho local
      setItems((prevItems) => prevItems.filter((item) => item.id !== produtoId))
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

      // Tentar atualizar na database (que fará a validação de estoque)
      try {
        const success = await saveToDatabase(produtoId, novaQuantidade, true)
        if (!success) {
          // Se falhou, não atualizar o carrinho local
          return
        }
      } catch (stockError) {
        // Se é erro de estoque, não atualizar e possivelmente notificar
        console.warn('Erro de estoque ao atualizar quantidade:', stockError)
        return
      }

      // Atualizar quantidade no carrinho local
      setItems((prevItems) => 
        prevItems.map((item) => 
          item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
        )
      )
    } catch (error) {
      // Silent error handling
      // Em caso de erro, não atualizar para evitar inconsistências
    }
  }

  const cancelCart = async () => {
    try {
      // Verificar se o usuário está autenticado
      if (!isAuthenticated) {
        return
      }

      // Limpar carrinho na database
      const token = localStorage.getItem('token')
      if (token) {
        await fetch('/api/users/me/cart', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      // Silent error handling
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

      // Limpar carrinho na database
      const token = localStorage.getItem('token')
      if (token) {
        await fetch('/api/users/me/cart', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      // Silent error handling
    } finally {
      // Limpar carrinho local mesmo se houver erro na API
      setItems([])
    }
  }

  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
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
