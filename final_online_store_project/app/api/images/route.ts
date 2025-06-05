import { createApiHandler, createSuccessResponse, createErrorResponse } from '@/lib/api-handler'
import { listImagesFromGridFS, deleteImageFromGridFS } from '@/lib/gridfs'

// GET - List all images in GridFS
export const GET = createApiHandler(async () => {
  try {
    const images = await listImagesFromGridFS()
    
    const transformedImages = images.map(image => ({
      id: image._id.toString(),
      filename: image.filename,
      contentType: image.contentType,
      uploadDate: image.uploadDate,
      size: image.length,
      url: `/api/images/${image._id.toString()}`
    }))
    
    return createSuccessResponse({
      images: transformedImages,
      count: transformedImages.length
    })
  } catch (error) {
    console.error('Error listing images:', error)
    return createErrorResponse('Erro ao listar imagens', 500)
  }
}, { requireAuth: true, requireAdmin: true })

// DELETE - Delete an image from GridFS
export const DELETE = createApiHandler(async ({ req }) => {
  const { searchParams } = new URL(req.url)
  const fileId = searchParams.get('fileId')
  
  if (!fileId) {
    return createErrorResponse('ID do arquivo é obrigatório', 400)
  }
  
  try {
    const success = await deleteImageFromGridFS(fileId)
    
    if (!success) {
      return createErrorResponse('Arquivo não encontrado ou erro ao deletar', 404)
    }
    
    return createSuccessResponse(undefined, 'Imagem deletada com sucesso')
  } catch (error) {
    console.error('Error deleting image:', error)
    return createErrorResponse('Erro ao deletar imagem', 500)
  }
}, { requireAuth: true, requireAdmin: true })
