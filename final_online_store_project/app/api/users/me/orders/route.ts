import { createApiHandler } from "@/lib/api-handler"
import { NextResponse } from "next/server"
import Order from "@/models/Order"

export const GET = createApiHandler(async ({ userId }) => {
  const orders = await Order.find({ user: userId })
    .populate('items.product', 'name price image')
    .sort({ createdAt: -1 })

  return NextResponse.json(orders || [])
}, { requireAuth: true })