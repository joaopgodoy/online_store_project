import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "@/models/User"

export const POST = createApiHandler(async ({ req }) => {
  const { email, password } = await req.json()

  // Validar dados
  if (!email || !password) {
    return createErrorResponse("Email e senha são obrigatórios", 400)
  }

  // Buscar usuário
  const user = await User.findOne({ email })
  if (!user) {
    return createErrorResponse("Credenciais inválidas", 401)
  }

  // Verificar senha
  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    return createErrorResponse("Credenciais inválidas", 401)
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

  return createSuccessResponse({
    user: userData,
    token
  }, "Login realizado com sucesso")
})
