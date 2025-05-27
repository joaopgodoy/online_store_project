import mongoose, { Schema, model, models } from 'mongoose'

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
    enum: ['processing', 'completed', 'cancelled'],
    default: 'processing'
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  pickupCode: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
})

const Order = models.Order || model('Order', OrderSchema)
export default Order