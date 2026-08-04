import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true, index: true },
    category: { type: String, trim: true, default: 'Uncategorized' },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    description: { type: String, default: '' },
    benefits: { type: String, default: '' },
    ingredients: { type: String, default: '' },
    scientificValidation: { type: String, default: '' },
    directions: { type: String, default: '' },
    warnings: { type: String, default: '' },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
  },
  { timestamps: true }
)

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
