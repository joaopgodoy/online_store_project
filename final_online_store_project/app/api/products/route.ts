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
      disponivel: product.inStock && product.availableQuantity > 0, // Verificar estoque também
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

export async function POST(request: Request) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { name, description, price, image, category, inStock, availableQuantity } = body

    // Validar campos obrigatórios
    if (!name || !description || price === undefined || !category || availableQuantity === undefined) {
      return NextResponse.json(
        { message: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    // Verificar se já existe um produto com esse nome
    const existingProduct = await Product.findOne({ name })
    if (existingProduct) {
      return NextResponse.json(
        { message: 'Já existe um produto com esse nome' },
        { status: 400 }
      )
    }

    // Determinar status baseado no estoque - SE ESTOQUE FOR 0, PRODUTO FICA INDISPONÍVEL
    const finalInStock = Number(availableQuantity) > 0 ? (inStock !== undefined ? inStock : true) : false

    // Criar novo produto
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      image: image || "/placeholder.svg?height=300&width=300",
      category,
      inStock: finalInStock, // Usar o status calculado
      availableQuantity: Number(availableQuantity),
      sold: 0
    })

    const savedProduct = await newProduct.save()

    return NextResponse.json({
      message: 'Produto criado com sucesso',
      product: {
        id: savedProduct._id.toString(),
        name: savedProduct.name,
        description: savedProduct.description,
        price: savedProduct.price,
        image: savedProduct.image,
        category: savedProduct.category,
        inStock: savedProduct.inStock,
        availableQuantity: savedProduct.availableQuantity,
        sold: savedProduct.sold
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}