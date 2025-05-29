import { createApiHandler, createErrorResponse, createSuccessResponse } from "@/lib/api-handler"
import { validateRequiredFields, validateCardData } from "@/lib/validation"
import { NextResponse } from "next/server"
import PaymentMethod from "@/models/PaymentMethod"

export const GET = createApiHandler(async ({ userId }) => {
  const paymentMethods = await PaymentMethod.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(paymentMethods || [])
}, { requireAuth: true })

export const POST = createApiHandler(async ({ req, userId }) => {
  let requestData
  try {
    requestData = await req.json()
  } catch (parseError) {
    return createErrorResponse("Dados inválidos no corpo da requisição", 400)
  }
  
  const { cardNumber, cardName, cardExpiry, type } = requestData

  // Validate required fields
  const fieldsValidation = validateRequiredFields(requestData, ['cardNumber', 'cardName', 'cardExpiry', 'type'])
  if (!fieldsValidation.valid) {
    return fieldsValidation.error!
  }

  // Validate card data
  const cardValidation = validateCardData({ cardNumber, cardExpiry, type })
  if (!cardValidation.valid) {
    return cardValidation.error!
  }

  const lastFourDigits = cardNumber.slice(-4)

  // Check for duplicate card
  const existingCard = await PaymentMethod.findOne({
    user: userId,
    lastFourDigits,
    type
  })

  if (existingCard) {
    return createErrorResponse("Já existe um cartão cadastrado com esses dados", 400)
  }

  // Create payment method
  const paymentMethod = await PaymentMethod.create({
    user: userId,
    type,
    lastFourDigits,
    cardholderName: cardName.trim(),
    isDefault: false
  })

  if (!paymentMethod) {
    throw new Error('Falha ao criar método de pagamento')
  }

  return createSuccessResponse({
    paymentMethod: {
      _id: paymentMethod._id,
      type: paymentMethod.type,
      lastFourDigits: paymentMethod.lastFourDigits,
      cardholderName: paymentMethod.cardholderName,
      isDefault: paymentMethod.isDefault,
      createdAt: paymentMethod.createdAt
    }
  }, "Método de pagamento adicionado com sucesso", 201)
}, { requireAuth: true })