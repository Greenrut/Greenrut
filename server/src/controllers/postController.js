import { Post } from '../models/Post.js'
import { createHttpError } from '../utils/httpError.js'

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

export async function listPosts(_req, res, next) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.json({ ok: true, data: posts.map(serializePost) })
  } catch (error) {
    next(error)
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return next(createHttpError(404, 'Post not found'))

    res.json({ ok: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}

export async function createPost(req, res, next) {
  try {
    const body = req.body || {}
    const post = await Post.create({
      title: body.title || 'Untitled Post',
      slug:
        body.slug ||
        (body.title || 'untitled-post')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
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

export async function updatePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return next(createHttpError(404, 'Post not found'))

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

export async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return next(createHttpError(404, 'Post not found'))

    await post.deleteOne()
    res.json({ ok: true, data: serializePost(post) })
  } catch (error) {
    next(error)
  }
}
