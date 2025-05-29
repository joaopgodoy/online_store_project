import { createApiHandler, createErrorResponse, createSuccessResponse } from '@/lib/api-handler'
import Product from '@/models/Product'

const transformProduct = (product: any) => ({
  id: product._id.toString(),
  name: product.name,
  description: product.description,
  price: product.price,
  image: product.image,
  category: product.category,
  inStock: product.inStock && product.availableQuantity > 0,
  availableQuantity: product.availableQuantity,
  sold: product.sold,
  // Campos compatíveis com interface antiga
  descricao: product.description,
  preco: product.price,
  categoria: product.category,
  imagem: product.image,
  disponivel: product.inStock && product.availableQuantity > 0,
  estoque: product.availableQuantity,
  vendidos: product.sold
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
  
  // Validar campos obrigatórios
  if (!name || !description || price === undefined || !category || availableQuantity === undefined) {
    return createErrorResponse('Todos os campos obrigatórios devem ser preenchidos', 400)
  }
  
  // Verificar duplicatas
  const existingProduct = await Product.findOne({ name, _id: { $ne: params!.id } })
  if (existingProduct) {
    return createErrorResponse('Já existe um produto com esse nome', 400)
  }
  
  // Determinar status baseado no estoque
  const finalInStock = Number(availableQuantity) > 0 ? (inStock !== undefined ? inStock : true) : false
  
  const updateData = {
    name,
    description,
    price: Number(price),
    image: image || "/placeholder.jpg?height=300&width=300",
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
  const result = await Product.findByIdAndDelete(params!.id)
  
  if (!result) {
    return createErrorResponse('Produto não encontrado', 404)
  }
  
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