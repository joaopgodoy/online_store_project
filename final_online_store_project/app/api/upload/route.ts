import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import { uploadImageToGridFS } from '@/lib/gridfs'
import path from 'path'

export const POST = createApiHandler(async ({ req }) => {
  const data = await req.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return createErrorResponse('Nenhum arquivo enviado', 400)
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return createErrorResponse('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.', 400)
  }

  // Validate file size (5MB maximum)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return createErrorResponse('Arquivo muito grande. Tamanho máximo: 5MB', 400)
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate unique filename
  const timestamp = Date.now()
  const extension = path.extname(file.name)
  const filename = `product_${timestamp}${extension}`

  try {
    // Upload to GridFS
    const fileId = await uploadImageToGridFS(buffer, filename, file.type)

    return createSuccessResponse({
      fileId: fileId.toString(),
      filename,
      url: `/api/images/${fileId.toString()}` // URL to serve the image
    }, 'Arquivo enviado com sucesso')
  } catch (error) {
    console.error('Error uploading to GridFS:', error)
    return createErrorResponse('Erro ao fazer upload do arquivo', 500)
  }
}, { requireAuth: true, requireAdmin: true })