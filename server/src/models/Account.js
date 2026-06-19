import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    line1: { type: String, required: true, trim: true },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    phone: { type: String, default: '' },
    default: { type: Boolean, default: false },
  },
  { _id: true }
)

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    profile: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    addresses: [addressSchema],
    wishlist: [
      {
        name: String,
        price: Number,
        oldPrice: Number,
        stock: String,
      },
    ],
    inbox: [
      {
        subject: String,
        message: String,
        createdAt: Date,
      },
    ],
    orders: [
      {
        orderNumber: Number,
        product: String,
        date: Date,
        status: String,
        total: Number,
        paymentReference: String,
        paymentGateway: String,
        currency: String,
        customerEmail: String,
        paidAt: Date,
        items: [
          {
            name: String,
            quantity: Number,
            price: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
)

export const Account = mongoose.models.Account || mongoose.model('Account', accountSchema)
