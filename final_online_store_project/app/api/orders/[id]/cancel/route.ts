import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import Order from "@/models/Order"
import Product from "@/models/Product"

export const PUT = createApiHandler(async ({ params, userId }) => {
  // Buscar o pedido e verificar se pertence ao usuário
  const order = await Order.findOne({
    _id: params!.id,
    user: userId
  }).populate('items.product')

  if (!order) {
    return createErrorResponse("Pedido não encontrado", 404)
  }

  // Verificar se o pedido pode ser cancelado
  if (order.status !== 'processing') {
    return createErrorResponse("Apenas pedidos em processamento podem ser cancelados", 400)
  }

  // Devolver produtos ao estoque
  const stockUpdates = order.items.map(async (item: any) => {
    const product = await Product.findById(item.product._id)
    if (product) {
      // Adicionar quantidade de volta ao estoque
      product.availableQuantity += item.quantity
      // Remover da quantidade vendida
      product.sold = Math.max(0, product.sold - item.quantity)
      // Atualizar status de disponibilidade
      product.inStock = product.availableQuantity > 0
      await product.save()
    }
  })

  // Aguardar todas as atualizações de estoque
  await Promise.all(stockUpdates)

  // Atualizar status do pedido para cancelado
  order.status = 'cancelled'
  await order.save()

  return createSuccessResponse({
    order: {
      _id: order._id,
      status: order.status
    }
  }, "Pedido cancelado com sucesso. Produtos devolvidos ao estoque.")
}, { requireAuth: true, validateId: true })
