import { createApiHandler, createErrorResponse, createSuccessResponse } from '@/lib/api-handler'
import Product from '@/models/Product'
import { deleteImageFromGridFS } from '@/lib/gridfs'

const transformProduct = (product: any) => ({
  id: product._id.toString(),
  name: product.name,
  description: product.description,
  price: product.price,
  image: product.image ? `/api/images/${product.image}` : '/placeholder.jpg?height=300&width=300',
  category: product.category,
  inStock: product.inStock && product.availableQuantity > 0,
  availableQuantity: product.availableQuantity,
  sold: product.sold
})

export const GET = createApiHandler(async ({ params }) => {
  const product = await Product.findById(params!.id)
  if (!product) {
    return createErrorResponse('Produto não encontrado', 404)
  }
  return createSuccessResponse(transformProduct(product))
}, { validateId: true })

export const PUT = createApiHandler(async ({ req, params }) => {
  const { name, description, price, image, category, inStock, availableQuantity } = await req.json()
  
  // Validate required fields
  if (!name || !description || price === undefined || !category || availableQuantity === undefined) {
    return createErrorResponse('Todos os campos obrigatórios devem ser preenchidos', 400)
  }
  
  // Validate minimum price
  const numPrice = Number(price)
  if (isNaN(numPrice) || numPrice < 0.01) {
    return createErrorResponse('O preço deve ser de pelo menos R$ 0,01', 400)
  }
  
  // Check for duplicates
  const existingProduct = await Product.findOne({ name, _id: { $ne: params!.id } })
  if (existingProduct) {
    return createErrorResponse('Já existe um produto com esse nome', 400)
  }
  
  // Get current product to preserve image if no new image provided
  const currentProduct = await Product.findById(params!.id)
  if (!currentProduct) {
    return createErrorResponse('Produto não encontrado', 404)
  }
  
  // Handle image replacement - delete old image if a new one is provided
  let finalImage = currentProduct.image
  if (image !== undefined && image !== null && image !== '') {
    // New image provided - delete the old one if it exists and is different
    if (currentProduct.image && currentProduct.image !== image) {
      try {
        await deleteImageFromGridFS(currentProduct.image)
        console.log(`Deleted old image: ${currentProduct.image}`)
      } catch (error) {
        console.error('Error deleting old image from GridFS:', error)
        // Continue with update even if image deletion fails
      }
    }
    finalImage = image
  }
  
  // Determine status based on stock
  const finalInStock = Number(availableQuantity) > 0 ? (inStock !== undefined ? inStock : true) : false
  
  const updateData = {
    name,
    description,
    price: Number(price),
    image: finalImage,
    category,
    inStock: finalInStock,
    availableQuantity: Number(availableQuantity)
  }
  
  const updatedProduct = await Product.findByIdAndUpdate(
    params!.id,
    updateData,
    { new: true, runValidators: true }
  )
  
  if (!updatedProduct) {
    return createErrorResponse('Produto não encontrado', 404)
  }
  
  return createSuccessResponse({
    product: transformProduct(updatedProduct)
  }, 'Produto atualizado com sucesso')
}, { validateId: true })

export const DELETE = createApiHandler(async ({ params }) => {
  const product = await Product.findById(params!.id)
  
  if (!product) {
    return createErrorResponse('Produto não encontrado', 404)
  }
  
  // Delete the product image from GridFS if it exists
  if (product.image) {
    try {
      await deleteImageFromGridFS(product.image)
    } catch (error) {
      console.error('Error deleting image from GridFS:', error)
      // Continue with product deletion even if image deletion fails
    }
  }
  
  const result = await Product.findByIdAndDelete(params!.id)
  
  return createSuccessResponse(undefined, 'Produto excluído com sucesso')
}, { validateId: true })

// Stock management operations
export const PATCH = createApiHandler(async ({ req, params }) => {
  const { quantity, action } = await req.json()
  
  // If no action specified, default to reducing stock (original PATCH behavior)
  if (!action) {
    const product = await Product.findById(params!.id)
    if (!product) {
      return createErrorResponse('Produto não encontrado', 404)
    }
    
    if (product.availableQuantity < quantity) {
      return createErrorResponse('Estoque insuficiente', 400)
    }
    
    const newQuantity = product.availableQuantity - quantity
    const updatedProduct = await Product.findByIdAndUpdate(
      params!.id,
      {
        availableQuantity: newQuantity,
        inStock: newQuantity > 0,
        sold: product.sold + quantity
      },
      { new: true, runValidators: true }
    )
    
    return createSuccessResponse({
      product: {
        id: updatedProduct!._id.toString(),
        availableQuantity: updatedProduct!.availableQuantity,
        inStock: updatedProduct!.inStock,
        sold: updatedProduct!.sold
      }
    }, 'Estoque atualizado com sucesso')
  }
  
  // Handle stock adjustments with action parameter
  const product = await Product.findById(params!.id)
  if (!product) {
    return createErrorResponse('Produto não encontrado', 404)
  }
  
  let newQuantity, newSold
  
  if (action === 'remove') {
    newQuantity = product.availableQuantity + quantity
    newSold = Math.max(0, product.sold - quantity)
  } else {
    if (product.availableQuantity < quantity) {
      return createErrorResponse('Estoque insuficiente', 400)
    }
    newQuantity = product.availableQuantity - quantity
    newSold = product.sold + quantity
  }
  
  const updatedProduct = await Product.findByIdAndUpdate(
    params!.id,
    {
      availableQuantity: newQuantity,
      inStock: newQuantity > 0,
      sold: newSold
    },
    { new: true, runValidators: true }
  )
  
  return createSuccessResponse({
    product: {
      id: updatedProduct!._id.toString(),
      availableQuantity: updatedProduct!.availableQuantity,
      inStock: updatedProduct!.inStock,
      sold: updatedProduct!.sold
    }
  }, 'Estoque atualizado com sucesso')
}, { validateId: true })