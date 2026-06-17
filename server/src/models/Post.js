import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    author: { type: String, default: 'Admin' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true }
)

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema)
