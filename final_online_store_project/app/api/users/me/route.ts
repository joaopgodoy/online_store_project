import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/mongoose"
import User from "@/models/User"

export async function GET(req: Request) {
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

    // busca o usuário no banco (sem senha)
    const user = await User.findById(payload.sub).select("-password")
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json(
      { message: "Token expirado ou inválido" },
      { status: 401 }
    )
  }
}