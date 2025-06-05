export interface Produto {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  inStock: boolean
  availableQuantity: number
  sold: number
}

export interface Usuario {
  id: string
  name: string
  email: string
  apartamento: string
}
