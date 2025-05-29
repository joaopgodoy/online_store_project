import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongoose'
import PaymentMethod from '@/models/PaymentMethod'
import User from '@/models/User'
import mongoose from 'mongoose'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params
    const { isDefault } = await req.json()

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      if (isDefault) {
        // Remover padrão de todos os outros cartões
        await PaymentMethod.updateMany(
          { user: payload.sub },
          { isDefault: false }
        )
      }

      // Atualizar o cartão específico
      const updatedMethod = await PaymentMethod.findOneAndUpdate(
        { _id: id, user: payload.sub },
        { isDefault },
        { new: true }
      )

      if (!updatedMethod) {
        return NextResponse.json(
          { message: "Método de pagamento não encontrado" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        message: "Método de pagamento atualizado com sucesso",
        paymentMethod: updatedMethod
      })

    } catch (jwtError) {
      return NextResponse.json(
        { message: "Token expirado ou inválido" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao atualizar método de pagamento:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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
    const { id } = await params

    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de método de pagamento inválido' },
        { status: 400 }
      )
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      // Buscar e deletar o método de pagamento
      const paymentMethod = await PaymentMethod.findOneAndDelete({
        _id: id,
        user: payload.sub // Garantir que o usuário só pode deletar seus próprios métodos
      })

      if (!paymentMethod) {
        return NextResponse.json(
          { message: "Método de pagamento não encontrado" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        message: "Método de pagamento excluído com sucesso"
      })

    } catch (jwtError) {
      return NextResponse.json(
        { message: "Token expirado ou inválido" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erro ao excluir método de pagamento:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}