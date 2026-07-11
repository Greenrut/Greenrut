import { Product } from '../models/Product.js'

export async function listCategories(_req, res, next) {
  try {
    const results = await Product.aggregate([
}
