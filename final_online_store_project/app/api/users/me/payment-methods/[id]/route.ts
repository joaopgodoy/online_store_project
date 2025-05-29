import { createApiHandler, createErrorResponse, createSuccessResponse } from '@/lib/api-handler'
import PaymentMethod from '@/models/PaymentMethod'

export const PATCH = createApiHandler(async ({ req, params, userId }) => {
  const { isDefault } = await req.json()

  if (isDefault) {
    // Remove default from all other cards
    await PaymentMethod.updateMany(
      { user: userId },
      { isDefault: false }
    )
  }

  // Update specific card
  const updatedMethod = await PaymentMethod.findOneAndUpdate(
    { _id: params!.id, user: userId },
    { isDefault },
    { new: true }
  )

  if (!updatedMethod) {
    return createErrorResponse("Método de pagamento não encontrado", 404)
  }

  return createSuccessResponse({ paymentMethod: updatedMethod }, "Método de pagamento atualizado com sucesso")
}, { requireAuth: true, validateId: true })

export const DELETE = createApiHandler(async ({ params, userId }) => {
  const resource = await PaymentMethod.findOneAndDelete({
    _id: params!.id,
    user: userId
  })
  if (!resource) {
    return createErrorResponse("Método de pagamento não encontrado", 404)
  }
  return createSuccessResponse(undefined, "Método de pagamento excluído com sucesso")
}, { requireAuth: true, validateId: true })