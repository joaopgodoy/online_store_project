"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Produto } from '@/lib/types'

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

  // Carregar carrinho do localStorage quando o componente montar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error)
      }
    }
  }, [])

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

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

      // Se a atualização do estoque foi bem-sucedida, adicionar ao carrinho local
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
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
    } finally {
      // Limpar carrinho local mesmo se houver erro na API
      setItems([])
    }
  }

  const total = items.reduce((sum, item) => sum + item.preco * item.quantidade, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
