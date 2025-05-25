import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Product from '@/models/Product'

export async function GET() {
  try {
    await connectDB()
    
    // Buscar todos os produtos do MongoDB
    const products = await Product.find({}).sort({ createdAt: -1 })
    
    // Transformar os dados para o formato esperado pela aplicação
    const transformedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      descricao: product.description,
      preco: product.price,
      categoria: product.category,
      imagem: product.image,
      disponivel: product.inStock,
      estoque: product.availableQuantity,
      vendidos: product.sold
    }))
    
    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}