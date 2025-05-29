import bcrypt from 'bcryptjs'
import { createApiHandler, createErrorResponse, createSuccessResponse } from '@/lib/api-handler'
import { validateRequiredFields, validateEmail } from '@/lib/validation'
import User from '@/models/User'

// PUT endpoint to update a user
export const PUT = createApiHandler(async ({ req, params }) => {
  const data = await req.json()
  const { name, email, apartment, password } = data
  
  // Validate required fields (password is optional for updates)
  const fieldsValidation = validateRequiredFields(data, ['name', 'email', 'apartment'])
  if (!fieldsValidation.valid) {
    return fieldsValidation.error!
  }

  // Validate email format
  const emailValidation = validateEmail(email)
  if (!emailValidation.valid) {
    return emailValidation.error!
  }

  // Check for duplicate email (excluding current user)
  const existingUser = await User.findOne({ 
    email, 
    _id: { $ne: params!.id } 
  })
  if (existingUser) {
    return createErrorResponse('Já existe um usuário com esse email', 400)
  }
  
  // Prepare update data - admin is always false for regular users
  const updateData: any = { name, email, apartment, admin: false }

  // Hash password if provided
  if (password && password.trim() !== '') {
    updateData.password = await bcrypt.hash(password, 12)
  }
  
  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    params!.id,
    updateData,
    { new: true, runValidators: true }
  )
  
  if (!updatedUser) {
    return createErrorResponse("Usuário não encontrado", 404)
  }
  
  // Remove password before returning
  const userObj = updatedUser.toObject()
  delete userObj.password
  
  return createSuccessResponse({ user: userObj }, 'Usuário atualizado com sucesso')
}, { validateId: true })

// DELETE endpoint to delete a user
export const DELETE = createApiHandler(async ({ params }) => {
  const result = await User.findByIdAndDelete(params!.id)
  
  if (!result) {
    return createErrorResponse("Usuário não encontrado", 404)
  }
  
  return createSuccessResponse(undefined, "Usuário excluído com sucesso")
}, { validateId: true })