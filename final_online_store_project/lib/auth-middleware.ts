import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongoose'

export interface AuthenticatedRequest {
  userId: string
  isAdmin?: boolean
}

export async function authenticateRequest(request: Request): Promise<{ success: boolean; userId?: string; error?: NextResponse }> {
  try {
    await connectDB()
    
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        success: false,
        error: NextResponse.json(
          { message: 'Token ausente ou mal formado' },
          { status: 401 }
        )
      }
    }

    const token = authHeader.split(' ')[1]
    
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { sub: string }

      return {
        success: true,
        userId: payload.sub
      }
    } catch (jwtError) {
      return {
        success: false,
        error: NextResponse.json(
          { message: 'Token expirado ou inválido' },
          { status: 401 }
        )
      }
    }
  } catch (error) {
    return {
      success: false,
      error: NextResponse.json(
        { message: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }
}

export function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json({ message }, { status })
}

export function createSuccessResponse(data?: any, message?: string, status: number = 200) {
  const response: any = {}
  if (message) response.message = message
  if (data) Object.assign(response, data)
  
  return NextResponse.json(response, { status })
}
