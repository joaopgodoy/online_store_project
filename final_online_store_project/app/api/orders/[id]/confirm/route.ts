import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import Order from "@/models/Order"

export const PUT = createApiHandler(async ({ params, userId }) => {
  // Handle special admin user
  if (userId === 'admin_hardcoded') {
    return createErrorResponse('Admin não pode confirmar pedidos', 403)
  }

  // Buscar o pedido e verificar se pertence ao usuário
  const order = await Order.findOne({
    _id: params!.id,
    user: userId
  })

  if (!order) {
    return createErrorResponse("Pedido não encontrado", 404)
  }

  // Verificar se o pedido pode ser confirmado
  if (order.status === 'completed') {
    return createErrorResponse("Pedido já foi concluído", 400)
  }

  // Atualizar status para concluído
  order.status = 'completed'
  order.completedAt = new Date()
  await order.save()

  return createSuccessResponse({
    order: {
      _id: order._id,
      status: order.status,
      completedAt: order.completedAt
    }
  }, "Pedido confirmado como retirado com sucesso")
}, { requireAuth: true, validateId: true })