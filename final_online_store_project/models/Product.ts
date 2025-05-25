import mongoose, { Schema, model, models } from 'mongoose'

const ProductSchema = new Schema({
  name: {  // Mudança: 'name' para 'name' para compatibilidade com o BD
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,  // URL da imagem
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Alimentos e Bebidas', 'Higiene e Cuidados', 'Limpeza', 'Farmácia e Bem-estar'] // Adapte as categorias conforme necessário
  },
  inStock: {
    type: Boolean,
    default: true
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  sold: {
    type: Number,
    default: 0,
    min: 0
  },
}, {
  timestamps: true
})

const Product = models.Product || model('Product', ProductSchema)
export default Product
export { ProductSchema }