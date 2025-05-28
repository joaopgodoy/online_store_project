import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import Product from '@/models/Product'
import jwt from 'jsonwebtoken'

export async function GET(request: Request) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
    
    const user = await User.findById(decoded.sub).populate('cart.product')
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ cart: user.cart })
  } catch (error) {
    console.error('Erro ao buscar carrinho:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
    const { productId, quantity = 1 } = await request.json()
    
    const user = await User.findById(decoded.sub)
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se o produto existe e tem estoque
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 })
    }

    // Verificar se o produto está disponível
    if (!product.inStock) {
      return NextResponse.json({ message: 'Produto indisponível' }, { status: 400 })
    }

    // Verificar se o item já existe no carrinho
    const existingItemIndex = user.cart.findIndex((item: any) => 
      item.product.toString() === productId
    )

    const currentCartQuantity = existingItemIndex > -1 ? user.cart[existingItemIndex].quantity : 0
    const totalDesiredQuantity = currentCartQuantity + quantity

    // Verificar se há estoque suficiente
    if (product.availableQuantity < totalDesiredQuantity) {
      return NextResponse.json({ 
        message: `Estoque insuficiente. Disponível: ${product.availableQuantity}, já no carrinho: ${currentCartQuantity}`,
        availableQuantity: product.availableQuantity,
        currentCartQuantity
      }, { status: 400 })
    }

    if (existingItemIndex > -1) {
      // Atualizar quantidade
      user.cart[existingItemIndex].quantity += quantity
    } else {
      // Adicionar novo item
      user.cart.push({ product: productId, quantity })
    }

    await user.save()
    return NextResponse.json({ message: 'Item adicionado ao carrinho', cart: user.cart })
  } catch (error) {
    console.error('Erro ao adicionar item ao carrinho:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
    const { productId, quantity } = await request.json()
    
    const user = await User.findById(decoded.sub)
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se o produto existe e tem estoque (apenas se quantidade > 0)
    if (quantity > 0) {
      const product = await Product.findById(productId)
      if (!product) {
        return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 })
      }

      if (!product.inStock) {
        return NextResponse.json({ message: 'Produto indisponível' }, { status: 400 })
      }

      // Verificar se há estoque suficiente
      if (product.availableQuantity < quantity) {
        return NextResponse.json({ 
          message: `Estoque insuficiente. Disponível: ${product.availableQuantity}`,
          availableQuantity: product.availableQuantity
        }, { status: 400 })
      }
    }

    if (quantity <= 0) {
      // Remover item do carrinho
      user.cart = user.cart.filter((item: any) => 
        item.product.toString() !== productId
      )
    } else {
      // Atualizar quantidade
      const itemIndex = user.cart.findIndex((item: any) => 
        item.product.toString() === productId
      )
      
      if (itemIndex > -1) {
        user.cart[itemIndex].quantity = quantity
      }
    }

    await user.save()
    return NextResponse.json({ message: 'Carrinho atualizado', cart: user.cart })
  } catch (error) {
    console.error('Erro ao atualizar carrinho:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
    
    const user = await User.findById(decoded.sub)
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    }

    user.cart = []
    await user.save()
    
    return NextResponse.json({ message: 'Carrinho esvaziado' })
  } catch (error) {
    console.error('Erro ao esvaziar carrinho:', error)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}