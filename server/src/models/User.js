import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    resetPasswordTokenHash: { type: String, select: false, default: '' },
    resetPasswordExpires: { type: Date, select: false, default: null },
    role: {
      type: String,
      enum: ['Administrator', 'Editor', 'Author', 'Viewer'],
      default: 'Viewer',
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', userSchema)
