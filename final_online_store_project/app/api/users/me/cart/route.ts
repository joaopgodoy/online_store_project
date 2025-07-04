import { NextResponse } from 'next/server'
import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import User from '@/models/User'
import Product from '@/models/Product'

// Utility function to retry operations that might encounter version conflicts
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 100
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      // Check if it's a version error
      if (error.name === 'VersionError' && attempt < maxRetries) {
        // Exponential backoff with jitter
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 100
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}

export const GET = createApiHandler(async ({ userId }) => {
  const user = await User.findById(userId).populate('cart.product')
  if (!user) {
    return createErrorResponse('Usuário não encontrado', 404)
  }

  // Transform cart items to ensure image URLs are correctly formatted
  const transformedCart = user.cart.map((item: any) => ({
    ...item.toObject(),
    product: {
      ...item.product.toObject(),
      image: item.product.image ? `/api/images/${item.product.image}` : '/placeholder.jpg?height=300&width=300'
    }
  }))

  return createSuccessResponse({ cart: transformedCart })
}, { requireAuth: true })

export const POST = createApiHandler(async ({ req, userId }) => {
  const { productId, quantity = 1 } = await req.json()
  
  // Retry the entire operation to handle version conflicts
  return await retryWithBackoff(async () => {
    const user = await User.findById(userId)
    if (!user) {
      return createErrorResponse('Usuário não encontrado', 404)
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId)
    if (!product) {
      return createErrorResponse('Produto não encontrado', 404)
    }

    if (!product.inStock) {
      return createErrorResponse('Produto indisponível', 400)
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex((item: any) => 
      item.product.toString() === productId
    )

    const currentCartQuantity = existingItemIndex > -1 ? user.cart[existingItemIndex].quantity : 0
    const totalDesiredQuantity = currentCartQuantity + quantity

    // Check if there's sufficient stock
    if (product.availableQuantity < totalDesiredQuantity) {
      return NextResponse.json({ 
        message: `Estoque insuficiente. Disponível: ${product.availableQuantity}, já no carrinho: ${currentCartQuantity}`,
        availableQuantity: product.availableQuantity,
        currentCartQuantity
      }, { status: 400 })
    }

    if (existingItemIndex > -1) {
      user.cart[existingItemIndex].quantity += quantity
    } else {
      user.cart.push({ product: productId, quantity })
    }

    await user.save()
    return createSuccessResponse({ cart: user.cart }, 'Item adicionado ao carrinho')
  })
}, { requireAuth: true })

export const PUT = createApiHandler(async ({ req, userId }) => {
  const { productId, quantity } = await req.json()
  
  // Retry the entire operation to handle version conflicts
  return await retryWithBackoff(async () => {
    const user = await User.findById(userId)
    if (!user) {
      return createErrorResponse('Usuário não encontrado', 404)
    }

    // Check stock only if quantity > 0
    if (quantity > 0) {
      const product = await Product.findById(productId)
      if (!product) {
        return createErrorResponse('Produto não encontrado', 404)
      }

      if (!product.inStock) {
        return createErrorResponse('Produto indisponível', 400)
      }

      if (product.availableQuantity < quantity) {
        return NextResponse.json({ 
          message: `Estoque insuficiente. Disponível: ${product.availableQuantity}`,
          availableQuantity: product.availableQuantity
        }, { status: 400 })
      }
    }

    if (quantity <= 0) {
      // Remove item from cart
      user.cart = user.cart.filter((item: any) => 
        item.product.toString() !== productId
      )
    } else {
      // Update quantity
      const itemIndex = user.cart.findIndex((item: any) => 
        item.product.toString() === productId
      )
      
      if (itemIndex > -1) {
        user.cart[itemIndex].quantity = quantity
      }
    }

    await user.save()
    return createSuccessResponse({ cart: user.cart }, 'Carrinho atualizado')
  })
}, { requireAuth: true })

export const DELETE = createApiHandler(async ({ userId }) => {
  // Retry the entire operation to handle version conflicts
  return await retryWithBackoff(async () => {
    const user = await User.findById(userId)
    if (!user) {
      return createErrorResponse('Usuário não encontrado', 404)
    }

    user.cart = []
    await user.save()
    
    return createSuccessResponse(undefined, 'Carrinho esvaziado')
  })
}, { requireAuth: true })