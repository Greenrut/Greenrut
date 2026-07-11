import { Product } from '../models/Product.js'

export async function listCategories(_req, res, next) {
  try {
    const results = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    const data = results
      .filter((row) => row._id)
      .map((row) => ({ name: row._id, productCount: row.count }))

    res.json({ ok: true, data })
  } catch (error) {
    next(error)
}
