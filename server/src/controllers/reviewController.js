import { Review } from '../models/Review.js'
import { createHttpError } from '../utils/httpError.js'

function serializeReview(review) {
  return {
    id: review._id,
    name: review.name,
    role: review.role,
    quote: review.quote,
    rating: review.rating,
    status: review.status,
    sortOrder: review.sortOrder,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  }
}

export async function listReviews(_req, res, next) {
  try {
    const reviews = await Review.find({ status: 'published' }).sort({ sortOrder: 1, createdAt: -1 })
    res.json({ ok: true, data: reviews.map(serializeReview) })
  } catch (error) {
    next(error)
  }
}

export async function listAdminReviews(_req, res, next) {
  try {
    const reviews = await Review.find().sort({ sortOrder: 1, createdAt: -1 })
    res.json({ ok: true, data: reviews.map(serializeReview) })
  } catch (error) {
    next(error)
  }
}

export async function createAdminReview(req, res, next) {
  try {
    const body = req.body || {}
    if (!body.name || !body.quote) {
      return next(createHttpError(400, 'Name and review are required'))
    }

    const review = await Review.create({
      name: body.name,
      role: body.role || 'Customer',
      quote: body.quote,
      rating: Number(body.rating || 5),
      status: body.status || 'published',
      sortOrder: Number(body.sortOrder || 0),
    })

    res.status(201).json({ ok: true, data: serializeReview(review) })
  } catch (error) {
    next(error)
  }
}

export async function updateAdminReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return next(createHttpError(404, 'Review not found'))

    const body = req.body || {}
    review.name = body.name ?? review.name
    review.role = body.role ?? review.role
    review.quote = body.quote ?? review.quote
    review.rating = body.rating === undefined ? review.rating : Number(body.rating)
    review.status = body.status ?? review.status
    review.sortOrder = body.sortOrder === undefined ? review.sortOrder : Number(body.sortOrder)

    await review.save()
    res.json({ ok: true, data: serializeReview(review) })
  } catch (error) {
    next(error)
  }
}

export async function deleteAdminReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) return next(createHttpError(404, 'Review not found'))

    await review.deleteOne()
    res.json({ ok: true, data: serializeReview(review) })
  } catch (error) {
    next(error)
  }
}
