import { Account } from '../models/Account.js'
import { Post } from '../models/Post.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { categories, tags } from '../data/mockDb.js'
import { tags } from '../data/mockDb.js'
import { createHttpError } from '../utils/httpError.js'
import { hashPassword } from '../utils/auth.js'
import { uploadImage, uploadImages } from '../services/uploadService.js'
import { config } from '../config/env.js'

function parseId(id) {
  if (typeof id !== 'string' || !id.trim()) {
    return null
  }

  return id.trim()
}

function getPublicBaseUrl(req) {
  const forwardedProto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim()
  const protocol = forwardedProto || req.protocol
  return `${protocol}://${req.get('host')}`
}

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

function serializePost(post) {
  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    author: post.author,
    status: post.status,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage || null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastActive: user.lastActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

async function getDashboardStats() {
  const [productsCount, postsCount, usersCount, accountsCount, recentProducts, recentPosts, recentUsers] = await Promise.all([
    Product.countDocuments(),
    Post.countDocuments(),
    User.countDocuments(),
    Account.countDocuments(),
    Product.find().sort({ createdAt: -1 }).limit(5),
    Post.find().sort({ createdAt: -1 }).limit(5),
    User.find().sort({ createdAt: -1 }).limit(5),
  ])

  return {
    stats: {
      blogPosts: postsCount,
      products: productsCount,
      users: usersCount,
      accounts: accountsCount,
    },
    products: recentProducts.map(serializeProduct),
    recentPosts: recentPosts.map(serializePost),
    users: recentUsers.map(serializeUser),
  }
}

export async function getDashboard(_req, res, next) {
  try {
    const payload = await getDashboardStats()
    res.json({ ok: true, ...payload })
  } catch (error) {
    next(error)
  }
}

export async function listAdminProducts(_req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    res.json({ ok: true, data: products.map(serializeProduct) })
  } catch (error) {
    next(error)
  }
}

export async function getAdminProduct(req, res, next) {
  try {
    const id = parseId(req.params.id)
    if (!id) {
      return next(createHttpError(400, 'Product id is required'))
    }

    const product = await Product.findById(id)
    if (!product) {
      return next(createHttpError(404, 'Product not found'))
    }

    res.json({ ok: true, data: serializeProduct(product) })
  } catch (error) {
    next(error)
  }
}

export async function createAdminProduct(req, res, next) {
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

export async function updateAdminProduct(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const product = await Product.findById(id)
    if (!product) {
      return next(createHttpError(404, 'Product not found'))
    }

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

export async function deleteAdminProduct(req, res, next) {
  try {
    const id = parseId(req.params.id)
    const product = await Product.findById(id)
    if (!product) {
      return next(createHttpError(404, 'Product not found'))
    }

    await product.deleteOne()
    res.json({ ok: true, data: serializeProduct(product) })
  } catch (error) {
    next(error)
  }
}

export async function listAdminPosts(_req, res, next) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.json({ ok: true, data: posts.map(serializePost) })
  } catch (error) {
    next(error)
  }
}

export async function getAdminPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return next(createHttpError(404, 'Post not found'))
    }

    res.json({ ok: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function createAdminPost(req, res, next) {
  try {
    const body = req.body || {}
    const post = await Post.create({
      title: body.title || 'Untitled Post',
      slug: body.slug || (body.title || 'untitled-post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      author: body.author || 'Admin',
      status: body.status || 'draft',
      excerpt: body.excerpt || '',
      content: body.content || '',
      coverImage: body.coverImage || null,
    })

    res.status(201).json({ ok: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function updateAdminPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return next(createHttpError(404, 'Post not found'))
    }

    const body = req.body || {}
    post.title = body.title ?? post.title
    post.slug = body.slug ?? post.slug
    post.author = body.author ?? post.author
    post.status = body.status ?? post.status
    post.excerpt = body.excerpt ?? post.excerpt
    post.content = body.content ?? post.content
    if (body.coverImage) {
      post.coverImage = body.coverImage
    }

    await post.save()
    res.json({ ok: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function deleteAdminPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return next(createHttpError(404, 'Post not found'))
    }

    await post.deleteOne()
    res.json({ ok: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function listAdminUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ ok: true, data: users.map(serializeUser) })
  } catch (error) {
    next(error)
  }
}

export async function createAdminUser(req, res, next) {
  try {
    const body = req.body || {}
    if (!body.name || !body.email || !body.password) {
      return next(createHttpError(400, 'Name, email, and password are required'))
    }

    const user = await User.create({
      name: String(body.name).trim(),
      email: String(body.email).trim().toLowerCase(),
      passwordHash: hashPassword(String(body.password)),
      role: body.role || 'Viewer',
      status: body.status || 'active',
      lastActive: body.lastActive || new Date(),
    })

    res.status(201).json({ ok: true, data: serializeUser(user) })
  } catch (error) {
    next(error)
  }
}

export async function updateAdminUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(createHttpError(404, 'User not found'))
    }

    const body = req.body || {}
    user.name = body.name ?? user.name
    user.email = body.email ?? user.email
    user.role = body.role ?? user.role
    user.status = body.status ?? user.status
    if (body.lastActive) {
      user.lastActive = body.lastActive
    }

    await user.save()
    res.json({ ok: true, data: serializeUser(user) })
  } catch (error) {
    next(error)
  }
}

export async function deleteAdminUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(createHttpError(404, 'User not found'))
    }

    await user.deleteOne()
    res.json({ ok: true, data: serializeUser(user) })
  } catch (error) {
    next(error)
  }
}

export async function listAdminCategories(_req, res) {
  res.json({ ok: true, data: categories })
}

export async function listAdminTags(_req, res) {
  res.json({ ok: true, data: tags })
}

export async function uploadAdminImage(req, res, next) {
  try {
    if (!req.file) {
      return next(createHttpError(400, 'Image file is required'))
    }

    const result = await uploadImage(req.file, { folder: config.cloudinary.folder, baseUrl: getPublicBaseUrl(req) })
    res.status(201).json({
      ok: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function uploadAdminImages(req, res, next) {
  try {
    if (!Array.isArray(req.files) || req.files.length === 0) {
      return next(createHttpError(400, 'Image files are required'))
    }

    const results = await uploadImages(req.files, { folder: config.cloudinary.folder, baseUrl: getPublicBaseUrl(req) })

    res.status(201).json({
      ok: true,
      data: results.map((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      })),
    })
  } catch (error) {
    next(error)
  }
}




