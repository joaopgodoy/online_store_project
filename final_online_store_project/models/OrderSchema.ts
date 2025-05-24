import mongoose, { Schema, model, models } from 'mongoose'

const OrderSchema = new Schema({
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'PAID', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true
  },
}, {
  timestamps: true
})

const Order = models.Order || model('Order', OrderSchema)
export default Order
export { OrderSchema }