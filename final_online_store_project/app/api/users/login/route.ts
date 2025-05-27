// app/api/users/login/route.ts

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    // Validar dados
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      )
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      )
    }

    // Gerar token JWT
    const token = jwt.sign(
      { sub: user._id.toString() },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    // Retornar dados do usuário (sem a senha)
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      apartment: user.apartment,
      admin: user.admin || false
    }

    return NextResponse.json({
      message: "Login realizado com sucesso",
      user: userData,
      token
    })

  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
