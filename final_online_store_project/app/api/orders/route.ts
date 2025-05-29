import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongoose"
import Order from "@/models/Order"
import User from "@/models/User"

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
    const { items, total, paymentMethod } = await req.json()

    console.log('Dados recebidos para criar pedido:', { items, total, paymentMethod })

    try {
      // decodifica e valida o token
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      // Validar dados do pedido
      if (!items || !items.length || !total || !paymentMethod) {
        console.log('Dados incompletos:', { 
          hasItems: !!items, 
          itemsLength: items?.length, 
          hasTotal: !!total, 
          hasPaymentMethod: !!paymentMethod 
        })
        return NextResponse.json(
          { message: "Dados do pedido incompletos" },
          { status: 400 }
        )
      }

      // Gerar código de retirada único
      const pickupCode = Math.floor(1000 + Math.random() * 9000).toString()

      // Criar o pedido
      const order = await Order.create({
        user: payload.sub,
        items,
        total,
        paymentMethod,
        pickupCode,
        status: 'processing'
      })

      // Adicionar o pedido ao array de pedidos do usuário
      await User.findByIdAndUpdate(
        payload.sub,
        { $push: { orders: order._id } }
      )

      return NextResponse.json({
        message: "Pedido criado com sucesso",
        order,
        pickupCode
      })

    } catch (err) {
      console.error('Erro JWT:', err)
      return NextResponse.json(
        { message: "Token expirado ou inválido" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}