import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

// PUT endpoint to update a user
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const { name, email, apartment, admin, password } = await req.json()
    
    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de usuário inválido' },
        { status: 400 }
      )
    }

    // Verificar se existe outro usuário com o mesmo email (exceto o atual)
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: id } 
    })
    if (existingUser) {
      return NextResponse.json(
        { message: 'Já existe um usuário com esse email' },
        { status: 400 }
      )
    }
    
    // Preparar dados para atualização
    const updateData: any = {
      name,
      email,
      apartment,
      admin
    }

    // Se uma nova senha foi fornecida, fazer hash dela
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 12)
    }
    
    // Atualizar usuário
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      )
    }
    
    // Remove password before returning
    const userObj = updatedUser.toObject()
    delete userObj.password
    
    return NextResponse.json({
      message: 'Usuário atualizado com sucesso',
      user: userObj
    })
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { message: "Erro ao atualizar usuário" },
      { status: 500 }
    )
  }
}

// DELETE endpoint to delete a user
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    
    // Validar se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'ID de usuário inválido' },
        { status: 400 }
      )
    }
    
    const result = await User.findByIdAndDelete(id)
    
    if (!result) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: "Usuário excluído com sucesso" }
    )
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
    return NextResponse.json(
      { message: "Erro ao excluir usuário" },
      { status: 500 }
    )
  }
}