import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

// GET endpoint to fetch all users (admin only)
export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}).select('-password')
    return NextResponse.json(users)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST endpoint to create a new user
export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, email, apartment, password, admin = false } = await req.json()

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: "Email já está sendo usado" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar o usuário
    const user = await User.create({
      name,
      email,
      apartment,
      password: hashedPassword,
      admin,
      paymentMethod: null,
      orders: []
    })

    // Remover a senha antes de retornar
    const userObj = user.toObject()
    delete userObj.password

    return NextResponse.json(
      { message: "Usuário criado com sucesso", user: userObj },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
