import { createApiHandler, createErrorResponse } from "@/lib/api-handler"
import { NextResponse } from "next/server"
import User from "@/models/User"

export const GET = createApiHandler(async ({ userId }) => {
  // Handle special admin user
  if (userId === 'admin_hardcoded') {
    return NextResponse.json({
      _id: 'admin_hardcoded',
      name: 'admin',
      email: 'admin@email.com',
      apartment: '00',
      admin: true,
      createdAt: new Date('2023-01-01')
    })
  }

  const user = await User.findById(userId).select("-password")
  if (!user) {
    return createErrorResponse("Usuário não encontrado", 404)
  }
  return NextResponse.json(user)
}, { requireAuth: true })