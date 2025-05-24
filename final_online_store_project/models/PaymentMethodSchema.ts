import mongoose, { Schema, model, models } from 'mongoose'

const PaymentMethodSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['CREDIT_CARD', 'DEBIT_CARD'],
  },
  cardholderName: {
    type: String,
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  expirationDate: {
    type: String,
    required: true
  },
  cvv: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

const PaymentMethod = models.PaymentMethod || model('PaymentMethod', PaymentMethodSchema)
export default PaymentMethod
export { PaymentMethodSchema }