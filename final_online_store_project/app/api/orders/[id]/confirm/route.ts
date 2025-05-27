import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongoose"
import Order from "@/models/Order"
import mongoose from "mongoose"

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const { id } = params

    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de pedido inválido' },
        { status: 400 }
      )
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      // Buscar o pedido e verificar se pertence ao usuário
      const order = await Order.findOne({
        _id: id,
        user: payload.sub
      })

      if (!order) {
        return NextResponse.json(
          { message: "Pedido não encontrado" },
          { status: 404 }
        )
      }

      // Verificar se o pedido pode ser confirmado (não está já concluído)
      if (order.status === 'completed') {
        return NextResponse.json(
          { message: "Pedido já foi concluído" },
          { status: 400 }
        )
      }

      // Atualizar status para concluído
      order.status = 'completed'
      order.completedAt = new Date()
      await order.save()

      return NextResponse.json({
        message: "Pedido confirmado como retirado com sucesso",
        order: {
          _id: order._id,
          status: order.status,
          completedAt: order.completedAt
        }
      })

    } catch (jwtError) {
      return NextResponse.json(
        { message: "Token expirado ou inválido" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao confirmar retirada do pedido:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}