import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ message: 'Nenhum arquivo enviado' }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    // Validar tamanho do arquivo (5MB máximo)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const filename = `product_${timestamp}${extension}`

    // Criar diretório se não existir
    const uploadDir = path.join(process.cwd(), 'public', 'products')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Diretório já existe
    }

    // Salvar arquivo
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Retornar URL do arquivo
    const fileUrl = `/products/${filename}`

    return NextResponse.json({
      message: 'Arquivo enviado com sucesso',
      url: fileUrl,
      filename
    })

  } catch (error) {
    console.error('Erro ao fazer upload:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}