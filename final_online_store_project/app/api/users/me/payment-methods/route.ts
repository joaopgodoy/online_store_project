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
      // decodifica e valida o token
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      // busca o usuário e sua forma de pagamento
      const user = await User.findById(payload.sub)
        .populate('paymentMethod')
        .select('paymentMethod')

      if (!user) {
        return NextResponse.json(
          { message: "Usuário não encontrado" },
          { status: 404 }
        )
      }

      return NextResponse.json(user.paymentMethod)
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
      // decodifica e valida o token
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

      // Validações adicionais
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

      // Extrair últimos 4 dígitos
      const lastFourDigits = cardNumber.slice(-4)

      // Criar ou atualizar método de pagamento
      const paymentMethod = await PaymentMethod.findOneAndUpdate(
        { user: payload.sub },
        {
          user: payload.sub,
          type,
          lastFourDigits,
          cardholderName: cardName,
          isDefault: true
        },
        { upsert: true, new: true }
      )

      // Atualizar referência no usuário
      await User.findByIdAndUpdate(
        payload.sub,
        { paymentMethod: paymentMethod._id }
      )

      return NextResponse.json({
        message: "Método de pagamento salvo com sucesso",
        paymentMethod: {
          _id: paymentMethod._id,
          type: paymentMethod.type,
          lastFourDigits: paymentMethod.lastFourDigits,
          cardholderName: paymentMethod.cardholderName,
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