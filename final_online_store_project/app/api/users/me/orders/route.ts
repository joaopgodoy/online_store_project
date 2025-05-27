import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"
import Order from "@/models/Order"

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

      // busca os pedidos do usuário diretamente
      const orders = await Order.find({ user: payload.sub })
        .populate('items.product', 'name price image')
        .sort({ createdAt: -1 }) // mais recentes primeiro

      return NextResponse.json(orders || [])
    } catch (err) {
      return NextResponse.json(
        { message: "Token expirado ou inválido" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}