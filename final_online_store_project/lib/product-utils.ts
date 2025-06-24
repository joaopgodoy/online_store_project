import type { Produto } from '@/lib/types'

// Calculate available quantity considering items already in cart
export function calculateAvailableQuantity(
  product: Produto, 
  cartItems: Array<{ id: string; quantidade: number }>
): number {
  const itemInCart = cartItems.find(item => item.id === product.id)
  const quantityInCart = itemInCart?.quantidade || 0
  return Math.max(0, product.availableQuantity - quantityInCart)
}

// Format stock display text
export function formatStockText(quantity: number): string {
  return `${quantity} ${quantity === 1 ? 'unidade disponível' : 'unidades disponíveis'}`
}

// Format available quantity display for compact view
export function formatAvailableText(quantity: number): string {
  return `${quantity} disponíve${quantity !== 1 ? 'is' : 'l'}`
}

// Generalized unit text formatter (can replace formatStockText if needed)
export function formatUnitText(quantity: number, unit: string = 'unidade', unitPlural?: string): string {
  const plural = unitPlural || `${unit}s`
  return `${quantity} ${quantity === 1 ? unit : plural}`
}

// Format cart quantity display
export function formatCartQuantityText(quantity: number): string {
  return `(${quantity} no carrinho)`
}

// Check if product is out of stock
export function isProductOutOfStock(product: Produto, availableQuantity?: number): boolean {
  const qty = availableQuantity ?? product.availableQuantity
  return !product.inStock || qty === 0
}

// Format price with currency
export function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2)}`
}

// Get product image with fallback
export function getProductImage(product: Produto): string {
  return product.image || "/placeholder.jpg?height=300&width=300"
}

// Format search results text
export function formatSearchResultsText(count: number, query: string): string {
  const resultText = count !== 1 ? 'resultados encontrados' : 'resultado encontrado'
  return `${count} ${resultText} para "${query}"`
}

// Card formatting utilities
export function formatCardNumber(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  // Adiciona espaços a cada 4 dígitos
  return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function formatCardExpiry(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  // Adiciona barra após 2 dígitos
  if (numbers.length >= 2) {
    return numbers.slice(0, 2) + '/' + numbers.slice(2, 4)
  }
  return numbers
}

export function formatCardCvc(value: string): string {
  // Remove tudo que não é número e limita a 4 dígitos
  return value.replace(/\D/g, '').slice(0, 4)
}
