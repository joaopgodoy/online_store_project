import { NextRequest, NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api-handler'
import Product from '@/models/Product'

export const GET = createApiHandler(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const categoria = searchParams.get('categoria')
  
  if (!query || query.trim().length === 0) {
    return NextResponse.json([])
  }

  // Build search filter
  const searchFilter: any = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } }
    ]
  }

  // Add category filter if provided
  if (categoria && categoria !== 'todas') {
    searchFilter.category = { $regex: categoria, $options: 'i' }
  }

  // Search products in MongoDB
  const products = await Product.find(searchFilter)
    .sort({ name: 1 })
    .limit(20) // Limit results to 20 products

  // Transform data to expected format
  const transformedProducts = products.map(product => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image ? `/api/images/${product.image}` : '/placeholder.jpg?height=300&width=300',
    inStock: product.inStock && product.availableQuantity > 0,
    availableQuantity: product.availableQuantity,
    sold: product.sold
  }))

  return NextResponse.json(transformedProducts)
})
