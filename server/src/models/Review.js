import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: 'Customer', trim: true },
    quote: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)
