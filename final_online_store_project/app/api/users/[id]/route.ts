import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

// PUT endpoint to update a user
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params
    const { name, email, apartment, admin } = await req.json()
    
    // Check if user exists
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      )
    }
    
    // Update user fields
    user.name = name
    user.email = email
    user.apartment = apartment
    user.admin = admin
    
    await user.save()
    
    // Remove password before returning
    const userObj = user.toObject()
    delete userObj.password
    
    return NextResponse.json(userObj)
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params
    
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