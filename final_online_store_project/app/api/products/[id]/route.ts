import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Product from '@/models/Product'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params

    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de produto inválido' },
        { status: 400 }
      )
    }

    // Buscar produto por ID
    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Transformar dados para o formato esperado pela aplicação
    const transformedProduct = {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      inStock: product.inStock && product.availableQuantity > 0,
      availableQuantity: product.availableQuantity,
      sold: product.sold,
      // Campos compatíveis com interface antiga
      descricao: product.description,
      preco: product.price,
      categoria: product.category,
      imagem: product.image,
      disponivel: product.inStock && product.availableQuantity > 0,
      estoque: product.availableQuantity,
      vendidos: product.sold
    }

    return NextResponse.json(transformedProduct)

  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const body = await request.json()
    const { name, description, price, image, category, inStock, availableQuantity } = body

    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de produto inválido' },
        { status: 400 }
      )
    }

    // Validar campos obrigatórios
    if (!name || !description || price === undefined || !category || availableQuantity === undefined) {
      return NextResponse.json(
        { message: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      )
    }

    // Verificar se existe outro produto com o mesmo nome (exceto o atual)
    const existingProduct = await Product.findOne({ 
      name, 
      _id: { $ne: id } 
    })
    if (existingProduct) {
      return NextResponse.json(
        { message: 'Já existe um produto com esse nome' },
        { status: 400 }
      )
    }

    // Determinar status baseado no estoque - SE ESTOQUE FOR 0, PRODUTO FICA INDISPONÍVEL
    const finalInStock = Number(availableQuantity) > 0 ? (inStock !== undefined ? inStock : true) : false

    // Atualizar produto
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price: Number(price),
        image: image || "/placeholder.jpg?height=300&width=300",
        category,
        inStock: finalInStock, // Usar o status calculado
        availableQuantity: Number(availableQuantity)
      },
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Produto atualizado com sucesso',
      product: {
        id: updatedProduct._id.toString(),
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        image: updatedProduct.image,
        category: updatedProduct.category,
        inStock: updatedProduct.inStock,
        availableQuantity: updatedProduct.availableQuantity,
        sold: updatedProduct.sold
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params

    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de produto inválido' },
        { status: 400 }
      )
    }

    // Deletar produto
    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Produto excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}