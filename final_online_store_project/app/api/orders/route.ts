import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import Order from "@/models/Order"
import User from "@/models/User"

export const POST = createApiHandler(async ({ req, userId }) => {
  // Handle special admin user
  if (userId === 'admin_hardcoded') {
    return createErrorResponse('Admin não pode criar pedidos', 403)
  }

  const { items, total, paymentMethod } = await req.json()

  // Validar dados do pedido
  if (!items || !items.length || !total || !paymentMethod) {
    return createErrorResponse("Dados do pedido incompletos", 400)
  }

  // Gerar código de retirada único
  const pickupCode = Math.floor(1000 + Math.random() * 9000).toString()

  // Criar o pedido
  const order = await Order.create({
    user: userId,
    items,
    total,
    paymentMethod,
    pickupCode,
    status: 'processing'
  })

  // Adicionar o pedido ao array de pedidos do usuário
  await User.findByIdAndUpdate(
    userId,
    { $push: { orders: order._id } }
  )

  return createSuccessResponse({
    order,
    pickupCode
  }, "Pedido criado com sucesso")
}, { requireAuth: true })