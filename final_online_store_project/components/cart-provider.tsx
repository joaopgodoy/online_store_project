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
  total: number
  totalFixed: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()

  // Carregar carrinho quando o componente montar
  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromDatabase()
    } else {
      loadCartFromLocalStorage()
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
        console.error("Erro ao carregar carrinho:", error)
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
      console.error('Erro ao carregar carrinho da database:', error)
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

      return response.ok
    } catch (error) {
      console.error('Erro ao salvar no banco:', error)
      return false
    }
  }

  const addItem = async (produto: Produto, quantidade: number = 1): Promise<boolean> => {
    try {
      // Verificar se o item já existe no carrinho
      const existingItem = items.find(item => item.id === produto.id)
      
      // Usar a API PUT para atualizar o estoque
      const response = await fetch(`/api/products/${produto.id}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          quantity: quantidade,
          action: 'add'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao atualizar estoque')
      }

      // Se usuário está autenticado, salvar na database
      if (isAuthenticated) {
        const saved = await saveToDatabase(produto.id, quantidade)
        if (!saved) {
          console.warn('Erro ao salvar na database, continuando com localStorage')
        }
      }

      // Atualizar carrinho local
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

      return true
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error)
      return false
    }
  }

  const removeItem = async (produtoId: string) => {
    try {
      // Encontrar o item que será removido
      const itemToRemove = items.find(item => item.id === produtoId)
      
      if (itemToRemove) {
        // Usar a API PUT para reverter o estoque
        await fetch(`/api/products/${produtoId}/stock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            quantity: itemToRemove.quantidade,
            action: 'remove'
          }),
        })

        // Se usuário está autenticado, atualizar na database
        if (isAuthenticated) {
          await saveToDatabase(produtoId, 0, true)
        }
      }

      // Remover do carrinho local
      setItems((prevItems) => prevItems.filter((item) => item.id !== produtoId))
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error)
      // Mesmo com erro na API, remove do carrinho local para não travar a UX
      setItems((prevItems) => prevItems.filter((item) => item.id !== produtoId))
    }
  }

  const updateQuantity = async (produtoId: string, novaQuantidade: number) => {
    if (novaQuantidade <= 0) {
      removeItem(produtoId)
      return
    }

    try {
      // Encontrar o item atual
      const currentItem = items.find(item => item.id === produtoId)
      
      if (currentItem) {
        const quantityDifference = novaQuantidade - currentItem.quantidade
        
        if (quantityDifference !== 0) {
          // Usar a API PUT para atualizar o estoque
          await fetch(`/api/products/${produtoId}/stock`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              quantity: Math.abs(quantityDifference),
              action: quantityDifference > 0 ? 'add' : 'remove'
            }),
          })

          // Se usuário está autenticado, atualizar na database
          if (isAuthenticated) {
            await saveToDatabase(produtoId, novaQuantidade, true)
          }
        }
      }

      // Atualizar quantidade no carrinho local
      setItems((prevItems) => 
        prevItems.map((item) => 
          item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error)
      // Em caso de erro, ainda atualiza localmente para não travar a UX
      setItems((prevItems) => 
        prevItems.map((item) => 
          item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
        )
      )
    }
  }

  const clearCart = async () => {
    try {
      // Reverter estoque de todos os itens
      const promises = items.map(item => 
        fetch(`/api/products/${item.id}/stock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            quantity: item.quantidade,
            action: 'remove'
          }),
        })
      )

      await Promise.all(promises)

      // Se usuário está autenticado, limpar carrinho na database
      if (isAuthenticated) {
        const token = localStorage.getItem('token')
        if (token) {
          await fetch('/api/users/me/cart', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        }
      }
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
    } finally {
      // Limpar carrinho local mesmo se houver erro na API
      setItems([])
      // Limpar localStorage também
      localStorage.removeItem("cart")
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
        total,
        totalFixed,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
