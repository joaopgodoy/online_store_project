import { createApiHandler, createErrorResponse } from "@/lib/api-handler"
import { NextResponse } from "next/server"
import User from "@/models/User"

export const GET = createApiHandler(async ({ userId }) => {
  const user = await User.findById(userId).select("-password")
  if (!user) {
    return createErrorResponse("Usuário não encontrado", 404)
  }
  return NextResponse.json(user)
}, { requireAuth: true })