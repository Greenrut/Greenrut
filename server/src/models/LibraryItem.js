import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
)

const libraryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    section: { type: String, required: true, trim: true },
    type: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    excerpt: { type: String, default: '' },
    localName: { type: String, default: '' },
    therapeuticUse: { type: String, default: '' },
    preparationMethod: { type: String, default: '' },
    dosage: { type: String, default: '' },
    constituents: { type: String, default: '' },
    resourceUrl: { type: String, default: '' },
    image: imageSchema,
    linkedProductId: { type: String, default: '' },
  },
  { timestamps: true }
)

export const LibraryItem = mongoose.models.LibraryItem || mongoose.model('LibraryItem', libraryItemSchema)
