import { tags } from '../data/mockDb.js'

export function listTags(_req, res) {
  res.json({ ok: true, data: tags })
}
