"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Produto } from "@/lib/types"

interface CartItem extends Produto {
  quantidade: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (produto: Produto) => void
  removeItem: (produtoId: string) => void
  updateQuantity: (produtoId: string, quantidade: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

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

  const addItem = (produto: Produto) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === produto.id)

      if (existingItem) {
        return prevItems.map((item) => (item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item))
      } else {
        return [...prevItems, { ...produto, quantidade: 1 }]
      }
    })
  }

  const removeItem = (produtoId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== produtoId))
  }

  const updateQuantity = (produtoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(produtoId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === produtoId ? { ...item, quantidade } : item)))
  }

  const clearCart = () => {
    setItems([])
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

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
