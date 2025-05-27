import mongoose, { Schema, model, models } from 'mongoose'

const PaymentMethodSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['credit', 'debit']
  },
  lastFourDigits: {
    type: String,
    required: true,
    length: 4
  },
  cardholderName: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

const PaymentMethod = models.PaymentMethod || model('PaymentMethod', PaymentMethodSchema)

export default PaymentMethod