import { LibraryItem } from '../models/LibraryItem.js'
import { createHttpError } from '../utils/httpError.js'

function serializeLibraryItem(item) {
  return {
    id: item._id,
    title: item.title,
    slug: item.slug,
    section: item.section,
    type: item.type,
    status: item.status,
    excerpt: item.excerpt,
    image: item.image || null,
    linkedProductId: item.linkedProductId || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function normalizeSlug(title, slug) {
  const source = String(slug || title || 'library-item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return source || 'library-item'
}

export async function listLibraryItems(_req, res, next) {
  try {
    const items = await LibraryItem.find({ status: 'published' }).sort({ createdAt: -1 })
    res.json({ ok: true, data: items.map(serializeLibraryItem) })
  } catch (error) {
    next(error)
  }
}

export async function listAdminLibraryItems(_req, res, next) {
  try {
    const items = await LibraryItem.find().sort({ createdAt: -1 })
    res.json({ ok: true, data: items.map(serializeLibraryItem) })
  } catch (error) {
    next(error)
  }
}

export async function createAdminLibraryItem(req, res, next) {
  try {
    const body = req.body || {}
    const item = await LibraryItem.create({
      title: body.title || 'Untitled Library Item',
      slug: normalizeSlug(body.title, body.slug),
      section: body.section || 'General',
      type: body.type || '',
      status: body.status || 'published',
      excerpt: body.excerpt || '',
      image: body.image || null,
      linkedProductId: body.linkedProductId || '',
    })

    res.status(201).json({ ok: true, data: serializeLibraryItem(item) })
  } catch (error) {
    next(error)
  }
}

export async function updateAdminLibraryItem(req, res, next) {
  try {
    const item = await LibraryItem.findById(req.params.id)
    if (!item) return next(createHttpError(404, 'Library item not found'))

    const body = req.body || {}
    item.title = body.title ?? item.title
    item.slug = body.slug ?? item.slug
    item.section = body.section ?? item.section
    item.type = body.type ?? item.type
    item.status = body.status ?? item.status
    item.excerpt = body.excerpt ?? item.excerpt
    if (body.image) item.image = body.image
    item.linkedProductId = body.linkedProductId ?? item.linkedProductId

    await item.save()
    res.json({ ok: true, data: serializeLibraryItem(item) })
  } catch (error) {
    next(error)
  }
}

export async function deleteAdminLibraryItem(req, res, next) {
  try {
    const item = await LibraryItem.findById(req.params.id)
    if (!item) return next(createHttpError(404, 'Library item not found'))

    await item.deleteOne()
    res.json({ ok: true, data: serializeLibraryItem(item) })
  } catch (error) {
    next(error)
  }
}
