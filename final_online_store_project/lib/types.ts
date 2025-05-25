export interface Produto {
  id: string
  name: string 
  descricao: string
  preco: number
  categoria: string
  imagem: string
  disponivel: boolean
  description?: string
  price?: number
  category?: string
  image?: string
  inStock?: boolean
}

export interface Usuario {
  id: string
  name: string
  email: string
  apartamento: string
}
