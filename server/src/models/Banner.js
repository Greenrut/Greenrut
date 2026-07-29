import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    text: { type: String, default: "" },
    primaryLabel: { type: String, default: "Learn More" },
    primaryPath: { type: String, default: "/product" },
    secondaryLabel: { type: String, default: "" },
    secondaryPath: { type: String, default: "" },
    image: {
      url: String,
      publicId: String,
    },
    alt: { type: String, default: "Banner image" },
    position: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  { timestamps: true },
);

export const Banner =
  mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
