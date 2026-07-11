import { Product } from '../models/Product.js'

export function listCategories(_req, res) {
  res.json({ ok: true, data: categories })
}
