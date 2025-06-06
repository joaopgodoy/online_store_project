import mongoose, { Schema, model, models } from 'mongoose'

const CartItem = new Schema({
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

const CartItemModel = models.CartItem || model('CartItem', CartItem)
export default CartItemModel
export { CartItem }