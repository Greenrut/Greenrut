import { categories } from '../data/mockDb.js'

export function listCategories(_req, res) {
  res.json({ ok: true, data: categories })
}
