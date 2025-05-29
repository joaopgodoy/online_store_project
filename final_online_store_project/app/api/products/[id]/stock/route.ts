import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongoose'
import Product from '@/models/Product'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const { quantity } = await request.json()

    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de produto inválido' },
        { status: 400 }
      )
    }

    // Buscar o produto atual
    const product = await Product.findById(id)
    
    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há estoque suficiente
    if (product.availableQuantity < quantity) {
      return NextResponse.json(
        { message: 'Estoque insuficiente' },
        { status: 400 }
      )
    }

    // Atualizar o estoque
    const newQuantity = product.availableQuantity - quantity
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        availableQuantity: newQuantity,
        inStock: newQuantity > 0,
        sold: product.sold + quantity
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      message: 'Estoque atualizado com sucesso',
      product: {
        id: updatedProduct._id.toString(),
        availableQuantity: updatedProduct.availableQuantity,
        inStock: updatedProduct.inStock,
        sold: updatedProduct.sold
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar estoque:', error)
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
    const { quantity, action } = await request.json() // action: 'add' ou 'remove'

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de produto inválido' },
        { status: 400 }
      )
    }

    const product = await Product.findById(id)
    
    if (!product) {
      return NextResponse.json(
        { message: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    let newQuantity, newSold

    if (action === 'remove') {
      // Reverter estoque quando item é removido do carrinho
      newQuantity = product.availableQuantity + quantity
      newSold = Math.max(0, product.sold - quantity)
    } else {
      // Reduzir estoque quando item é adicionado ao carrinho
      if (product.availableQuantity < quantity) {
        return NextResponse.json(
          { message: 'Estoque insuficiente' },
          { status: 400 }
        )
      }
      newQuantity = product.availableQuantity - quantity
      newSold = product.sold + quantity
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        availableQuantity: newQuantity,
        inStock: newQuantity > 0,
        sold: newSold
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      message: 'Estoque atualizado com sucesso',
      product: {
        id: updatedProduct._id.toString(),
        availableQuantity: updatedProduct.availableQuantity,
        inStock: updatedProduct.inStock,
        sold: updatedProduct.sold
      }
    })

  } catch (error) {
    console.error('Erro ao atualizar estoque:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}