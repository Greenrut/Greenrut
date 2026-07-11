import { Product } from '../models/Product.js'

export async function listCategories(_req, res, next) {
  try {
    const results = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    const data = results
}
