import { Product } from '../models/Product.js'
import { createHttpError } from '../utils/httpError.js'

function serializeProduct(product) {
  return {
    id: product._id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: product.price,
    stock: product.stock,
    status: product.status,
    description: product.description,
    images: product.images || [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }
}

export async function listProducts(_req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json({ ok: true, data: products.map(serializeProduct) })
  } catch (error) {
    next(error)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(createHttpError(404, 'Product not found'))

    res.json({ ok: true, data: serializeProduct(product) })
  } catch (error) {
    next(error)
  }
}

export async function createProduct(req, res, next) {
  try {
    const body = req.body || {}
    const product = await Product.create({
      name: body.name || 'Untitled Product',
      sku: body.sku || '',
      category: body.category || 'Uncategorized',
      price: Number(body.price || 0),
      stock: Number(body.stock || 0),
      status: body.status || 'draft',
      description: body.description || '',
      images: Array.isArray(body.images) ? body.images : [],
    })

    res.status(201).json({ ok: true, data: serializeProduct(product) })
  } catch (error) {
    next(error)
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(createHttpError(404, 'Product not found'))

    const body = req.body || {}
    product.name = body.name ?? product.name
    product.sku = body.sku ?? product.sku
    product.category = body.category ?? product.category
    product.price = body.price ?? product.price
    product.stock = body.stock ?? product.stock
    product.status = body.status ?? product.status
    product.description = body.description ?? product.description
    if (Array.isArray(body.images)) {
      product.images = body.images
    }

    await product.save()
    res.json({ ok: true, data: serializeProduct(product) })
  } catch (error) {
    next(error)
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(createHttpError(404, 'Product not found'))

    await product.deleteOne()
    res.json({ ok: true, data: serializeProduct(product) })
  } catch (error) {
    next(error)
  }
}
