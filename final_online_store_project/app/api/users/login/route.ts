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

  // Check for hardcoded admin account
  if (email === "admin@email.com" && password === "admin123@") {
    // Gerar token JWT para admin hardcoded
    const token = jwt.sign(
      { sub: "admin_hardcoded" },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    )

    // Retornar dados do admin hardcoded
    const userData = {
      _id: "admin_hardcoded",
      name: "admin",
      email: "admin@email.com",
      apartment: "00",
      admin: true
    }

    return createSuccessResponse({
      user: userData,
      token
    }, "Login realizado com sucesso")
  }

  // Buscar usuário regular
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

  // Retornar dados do usuário (sem a senha) - sempre admin: false para usuários regulares
  const userData = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    apartment: user.apartment,
    admin: false // Sempre false para usuários regulares
  }

  return createSuccessResponse({
    user: userData,
    token
  }, "Login realizado com sucesso")
})
