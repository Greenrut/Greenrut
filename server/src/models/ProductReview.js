import mongoose from 'mongoose'

const productReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'published'],
      default: 'published',
    },
  },
  { timestamps: true }
)

export const ProductReview =
  mongoose.models.ProductReview || mongoose.model('ProductReview', productReviewSchema)
