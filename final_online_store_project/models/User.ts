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
    type: {
      type: String,
      enum: ['credit', 'debit']
    },
    lastFourDigits: String,
    cardholderName: String,
    createdAt: String
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true
})

// evita redefinir o model no hot-reload do Next.js
const User = models.User || model('User', UserSchema)
export default User