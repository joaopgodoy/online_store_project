export interface Produto {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  imagem: string
  disponivel: boolean
}

export interface Usuario {
  id: string
  nome: string
  email: string
  apartamento: string
}
