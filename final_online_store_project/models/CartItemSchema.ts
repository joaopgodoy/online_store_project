import mongoose, { Schema, model, models } from 'mongoose'

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
})

const CartItem = models.CartItem || model('CartItem', CartItemSchema)
export default CartItem
export { CartItemSchema }