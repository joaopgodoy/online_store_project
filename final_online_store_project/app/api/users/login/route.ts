// app/api/users/login/route.ts

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

export async function POST(req: Request) {
  await connectDB()
  const { email, password } = await req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ message: "Email não encontrado" }, { status: 401 })
  }

  const senhaOk = await bcrypt.compare(password, user.password)
  if (!senhaOk) {
    return NextResponse.json({ message: "Senha incorreta" }, { status: 401 })
  }

  // remove senha do usuário
  const userObj = user.toObject()
  delete userObj.password

  // gera o token (JWS)
  const token = jwt.sign(
    { sub: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "2h" }
  )

  return NextResponse.json({ user: userObj, token })
}
