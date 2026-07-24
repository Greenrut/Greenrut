import { Product } from '../models/Product.js'
import { ProductReview } from '../models/ProductReview.js'
import { createHttpError } from '../utils/httpError.js'

function serializeReview(review) {
  return {
    id: review._id,
    productId: review.productId,
    name: review.name,
    email: review.email,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }
}

export async function listProductReviews(req, res, next) {
  try {
    const reviews = await ProductReview.find({
      productId: req.params.productId,
      status: 'published',
    }).sort({ createdAt: -1 })

    res.json({ ok: true, data: reviews.map(serializeReview) })
  } catch (error) {
    next(error)
  }
}

export async function createProductReview(req, res, next) {
  try {
    const product = await Product.findById(req.params.productId)
    if (!product) return next(createHttpError(404, 'Product not found'))

    const body = req.body || {}
    if (!body.name || !body.comment) {
      return next(createHttpError(400, 'Name and review are required'))
    }

    const review = await ProductReview.create({
      productId: product._id,
      name: body.name,
      email: body.email || '',
      rating: Number(body.rating || 5),
      comment: body.comment,
      status: 'published',
    })

    res.status(201).json({ ok: true, data: serializeReview(review) })
  } catch (error) {
    next(error)
  }
}
