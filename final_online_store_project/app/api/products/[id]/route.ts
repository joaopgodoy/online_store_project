import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Product from '@/models/Product'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params
    const { 
      name, 
      description, 
      price, 
      image, 
      category, 
      inStock, 
      availableQuantity 
    } = await req.json()
    
    // Check if product exists
    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json(
        { message: "Produto não encontrado" },
        { status: 404 }
      )
    }
    
    // Update product fields
    product.name = name
    product.description = description
    product.price = price
    product.image = image
    product.category = category
    product.inStock = inStock
    product.availableQuantity = availableQuantity
    
    await product.save()
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { message: "Erro ao atualizar produto" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    await Product.findByIdAndDelete(params.id)
    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Error deleting product" }, { status: 500 })
  }
}