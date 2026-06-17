import { users } from '../data/mockDb.js'

export function listUsers(_req, res) {
  res.json({ ok: true, data: users })
}
