import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  apartment: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    default: null
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  cartItems: [{
    type: Schema.Types.ObjectId,
    ref: 'CartItem'
  }]
}, {
  timestamps: true
})

// evita redefinir o model no hot-reload do Next.js
const User = models.User || model('User', UserSchema)
export default User