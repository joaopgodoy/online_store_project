import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

export async function GET() {
  await connectDB()
  // lista todos os usuários (sem expor senha)
  const users = await User.find().select('-password')
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  await connectDB()
  const { name, email, apartment, password, admin = false } = await req.json()

  // não permitir email duplicado
  if (await User.findOne({ email })) {
    return NextResponse.json(
      { message: 'Email já cadastrado' },
      { status: 409 }
    )
  }

  // hash da senha
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)

  // cria o usuário
  const newUser = await User.create({
    name,
    email,
    apartment,
    password: hashed,
    admin: Boolean(admin),
  })

  // remove senha do objeto de resposta
  const obj = newUser.toObject()
  delete obj.password

  return NextResponse.json(obj, { status: 201 })
}
