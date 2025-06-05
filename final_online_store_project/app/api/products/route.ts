import { NextResponse } from 'next/server'
import { createApiHandler, createErrorResponse, createSuccessResponse } from '@/lib/api-handler'
import { validateRequiredFields } from '@/lib/validation'
import Product from '@/models/Product'

export const GET = createApiHandler(async () => {
  // Get all products from MongoDB
  const products = await Product.find({}).sort({ createdAt: -1 })
  
  // Transform data to expected format
  const transformedProducts = products.map(product => ({
    id: product._id.toString(),
    name: product.name,
    descricao: product.description,
    preco: product.price,
    categoria: product.category,
    imagem: product.image ? `/api/images/${product.image}` : '/placeholder.jpg?height=300&width=300',
    disponivel: product.inStock && product.availableQuantity > 0,
    estoque: product.availableQuantity,
    vendidos: product.sold
  }))
  
  return NextResponse.json(transformedProducts)
})

export const POST = createApiHandler(async ({ req }) => {
  const data = await req.json()
  const { name, description, price, image, category, inStock, availableQuantity } = data

  // Validate required fields
  const fieldsValidation = validateRequiredFields(data, ['name', 'description', 'price', 'category', 'availableQuantity'])
  if (!fieldsValidation.valid) {
    return fieldsValidation.error!
  }

  // Validate minimum price
  const numPrice = Number(price)
  if (isNaN(numPrice) || numPrice < 0.01) {
    return createErrorResponse('O preço deve ser de pelo menos R$ 0,01', 400)
  }

  // Check if product with same name already exists
  const existingProduct = await Product.findOne({ name })
  if (existingProduct) {
    return createErrorResponse('Já existe um produto com esse nome', 400)
  }

  // Determine status based on stock - if stock is 0, product becomes unavailable
  const finalInStock = Number(availableQuantity) > 0 ? (inStock !== undefined ? inStock : true) : false

  // Create new product - image now expects a GridFS file ID
  const newProduct = new Product({
    name,
    description,
    price: Number(price),
    image: image || null, // Store GridFS file ID or null
    category,
    inStock: finalInStock,
    availableQuantity: Number(availableQuantity),
    sold: 0
  })

  const savedProduct = await newProduct.save()

  return createSuccessResponse({
    product: {
      id: savedProduct._id.toString(),
      name: savedProduct.name,
      description: savedProduct.description,
      price: savedProduct.price,
      image: savedProduct.image ? `/api/images/${savedProduct.image}` : '/placeholder.jpg?height=300&width=300',
      category: savedProduct.category,
      inStock: savedProduct.inStock,
      availableQuantity: savedProduct.availableQuantity,
      sold: savedProduct.sold
    }
  }, 'Produto criado com sucesso', 201)
})