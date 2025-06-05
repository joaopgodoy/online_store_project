import { createApiHandler } from "@/lib/api-handler"
import { NextResponse } from "next/server"
import Order from "@/models/Order"

export const GET = createApiHandler(async ({ userId }) => {
  const orders = await Order.find({ user: userId })
    .populate('items.product', 'name price image')
    .sort({ createdAt: -1 })

  // Transform the orders to ensure image URLs are properly formatted
  const transformedOrders = orders.map(order => ({
    ...order.toObject(),
    items: order.items.map((item: any) => ({
      ...item.toObject(),
      product: {
        ...item.product.toObject(),
        image: item.product.image ? `/api/images/${item.product.image}` : '/placeholder.jpg?height=300&width=300'
      }
    }))
  }))

  return NextResponse.json(transformedOrders || [])
}, { requireAuth: true })