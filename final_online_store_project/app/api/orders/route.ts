import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import Order from "@/models/Order"
import User from "@/models/User"

export const POST = createApiHandler(async ({ req, userId }) => {
  const { items, total, paymentMethod } = await req.json()

  // Validate order data
  if (!items || !items.length || !total || !paymentMethod) {
    return createErrorResponse("Dados do pedido incompletos", 400)
  }

  // Generate unique pickup code
  const pickupCode = Math.floor(1000 + Math.random() * 9000).toString()

  // Create the order
  const order = await Order.create({
    user: userId,
    items,
    total,
    paymentMethod,
    pickupCode,
    status: 'processing'
  })

  // Add order to user's orders array
  await User.findByIdAndUpdate(
    userId,
    { $push: { orders: order._id } }
  )

  return createSuccessResponse({
    order,
    pickupCode
  }, "Pedido criado com sucesso")
}, { requireAuth: true })