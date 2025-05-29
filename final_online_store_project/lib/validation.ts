import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

export function validateObjectId(id: string, entityName: string = 'ID'): { valid: boolean; error?: NextResponse } {
  // Allow special admin ID
  if (id === 'admin_hardcoded') {
    return { valid: true }
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      valid: false,
      error: NextResponse.json(
        { message: `${entityName} inválido` },
        { status: 400 }
      )
    }
  }
  return { valid: true }
}

export function validateRequiredFields(data: Record<string, any>, requiredFields: string[]): { valid: boolean; error?: NextResponse } {
  const missingFields = requiredFields.filter(field => !data[field] && data[field] !== 0)
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      error: NextResponse.json(
        { message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }
  }
  
  return { valid: true }
}

export function validateEmail(email: string): { valid: boolean; error?: NextResponse } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: NextResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      )
    }
  }
  
  return { valid: true }
}

export function validateCardData(cardData: { cardNumber: string; cardExpiry: string; type: string }): { valid: boolean; error?: NextResponse } {
  const { cardNumber, cardExpiry, type } = cardData
  
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return {
      valid: false,
      error: NextResponse.json(
        { message: 'Número do cartão inválido' },
        { status: 400 }
      )
    }
  }
  
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
    return {
      valid: false,
      error: NextResponse.json(
        { message: 'Data de validade deve estar no formato MM/AA' },
        { status: 400 }
      )
    }
  }
  
  if (!['credit', 'debit'].includes(type)) {
    return {
      valid: false,
      error: NextResponse.json(
        { message: 'Tipo de cartão inválido' },
        { status: 400 }
      )
    }
  }
  
  return { valid: true }
}
