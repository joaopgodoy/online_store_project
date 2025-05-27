import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"
import PaymentMethod from "@/models/PaymentMethod"

export async function GET(req: Request) {
  try {
    await connectDB()

    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token ausente ou mal formado" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      // Buscar todos os métodos de pagamento do usuário
      const paymentMethods = await PaymentMethod.find({ user: payload.sub })
        .sort({ createdAt: -1 }) // Mais recentes primeiro
        .lean() // Para melhor performance

      // Retornar array vazio se não houver métodos
      return NextResponse.json(paymentMethods || [])
    } catch (err) {
      return NextResponse.json(
        { message: "Token expirado ou inválido" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao buscar formas de pagamento:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token ausente ou mal formado" },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]
    
    let requestData
    try {
      requestData = await req.json()
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError)
      return NextResponse.json(
        { message: "Dados inválidos no corpo da requisição" },
        { status: 400 }
      )
    }
    
    const { cardNumber, cardName, cardExpiry, type } = requestData

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      // Validar dados do cartão
      if (!cardNumber || !cardName || !cardExpiry || !type) {
        return NextResponse.json(
          { message: "Todos os campos são obrigatórios" },
          { status: 400 }
        )
      }

      if (cardNumber.length < 13 || cardNumber.length > 19) {
        return NextResponse.json(
          { message: "Número do cartão inválido" },
          { status: 400 }
        )
      }

      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        return NextResponse.json(
          { message: "Data de validade deve estar no formato MM/AA" },
          { status: 400 }
        )
      }

      if (!['credit', 'debit'].includes(type)) {
        return NextResponse.json(
          { message: "Tipo de cartão inválido" },
          { status: 400 }
        )
      }

      const lastFourDigits = cardNumber.slice(-4)

      // Verificar se já existe um cartão com os mesmos últimos 4 dígitos
      const existingCard = await PaymentMethod.findOne({
        user: payload.sub,
        lastFourDigits,
        type
      })

      if (existingCard) {
        return NextResponse.json(
          { message: "Já existe um cartão cadastrado com esses dados" },
          { status: 400 }
        )
      }

      // Criar novo método de pagamento
      const paymentMethod = await PaymentMethod.create({
        user: payload.sub,
        type,
        lastFourDigits,
        cardholderName: cardName.trim(),
        isDefault: false // Novo cartão não é padrão automaticamente
      })

      // Verificar se o documento foi criado
      if (!paymentMethod) {
        throw new Error('Falha ao criar método de pagamento')
      }

      return NextResponse.json({
        message: "Método de pagamento adicionado com sucesso",
        paymentMethod: {
          _id: paymentMethod._id,
          type: paymentMethod.type,
          lastFourDigits: paymentMethod.lastFourDigits,
          cardholderName: paymentMethod.cardholderName,
          isDefault: paymentMethod.isDefault,
          createdAt: paymentMethod.createdAt
        }
      })

    } catch (jwtError) {
      console.error('Erro JWT:', jwtError)
      return NextResponse.json(
        { message: "Token expirado ou inválido" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao salvar método de pagamento:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}