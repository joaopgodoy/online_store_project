import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const POST = createApiHandler(async ({ req }) => {
  const data = await req.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return createErrorResponse('Nenhum arquivo enviado', 400)
  }

  // Validar tipo de arquivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return createErrorResponse('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.', 400)
  }

  // Validar tamanho do arquivo (5MB máximo)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return createErrorResponse('Arquivo muito grande. Tamanho máximo: 5MB', 400)
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

  return createSuccessResponse({
    url: fileUrl,
    filename
  }, 'Arquivo enviado com sucesso')
})