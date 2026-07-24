import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
)

const researchItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    phase: {
      type: String,
      enum: ['ongoing', 'concluded', 'future'],
      default: 'ongoing',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
    },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    researchArea: { type: String, default: '' },
    methodology: { type: String, default: '' },
    keyFindings: { type: String, default: '' },
    publicationUrl: { type: String, default: '' },
    image: imageSchema,
    linkedProductId: { type: String, default: '' },
  },
  { timestamps: true }
)

export const ResearchItem = mongoose.models.ResearchItem || mongoose.model('ResearchItem', researchItemSchema)
