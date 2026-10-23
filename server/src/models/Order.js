import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: '' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true, default: 0 },
    image: { type: String, default: '' },
  },
  { _id: true }
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
    customerName: { type: String, default: '' },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String, default: '' },
    shippingAddress: {
      name: { type: String, default: '' },
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      city: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    items: [orderItemSchema],
    productSummary: { type: String, default: '' },
    total: { type: Number, required: true, default: 0 },
    currency: { type: String, default: 'NGN' },
    paymentReference: { type: String, default: '', index: true },
    paymentGateway: { type: String, default: 'Paystack' },
    status: {
      type: String,
      enum: ['Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Paid',
      index: true,
    },
    notes: { type: String, default: '' },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
