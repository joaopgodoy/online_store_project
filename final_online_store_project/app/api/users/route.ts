import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createApiHandler, createErrorResponse, createSuccessResponse } from "@/lib/api-handler"
import { validateRequiredFields, validateEmail } from "@/lib/validation"
import User from "@/models/User"

// GET endpoint to fetch all users
export const GET = createApiHandler(async () => {
  const users = await User.find({}).select('-password')
  return NextResponse.json(users)
}, { requireAuth: true, requireAdmin: true })

// POST endpoint to create a new user
export const POST = createApiHandler(async ({ req, userId, isAdmin }) => {
  const data = await req.json()
  const { name, email, apartment, password, admin } = data

  // Validate required fields
  const fieldsValidation = validateRequiredFields(data, ['name', 'email', 'apartment', 'password'])
  if (!fieldsValidation.valid) {
    return fieldsValidation.error!
  }

  // Validate email format
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) {
    return emailValidation.error!
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return createErrorResponse("Email já está sendo usado", 400)
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 12)
  
  // Determine admin status
  let isUserAdmin = false
  if (userId && isAdmin) {
    isUserAdmin = admin === true
  }
  
  const user = await User.create({
    name,
    email,
    apartment,
    password: hashedPassword,
    admin: isUserAdmin,
    paymentMethod: null,
    orders: [],
    cart: []
  })

  // Remove password before returning
  const userObj = user.toObject()
  delete userObj.password

  return createSuccessResponse({ user: userObj }, "Usuário criado com sucesso", 201)
})
