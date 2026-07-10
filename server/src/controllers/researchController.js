import { ResearchItem } from '../models/ResearchItem.js'
import { createHttpError } from '../utils/httpError.js'

function serializeResearchItem(item) {
  return {
    id: item._id,
    title: item.title,
    slug: item.slug,
    phase: item.phase,
    status: item.status,
    excerpt: item.excerpt,
    content: item.content,
    image: item.image || null,
    linkedProductId: item.linkedProductId || '',
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function normalizeSlug(title, slug) {
  const source = String(slug || title || 'research-item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return source || 'research-item'
}

export async function listResearchItems(_req, res, next) {
  try {
    const items = await ResearchItem.find({ status: 'published' }).sort({ createdAt: -1 })
    res.json({ ok: true, data: items.map(serializeResearchItem) })
  } catch (error) {
    next(error)
  }
}

export async function listAdminResearchItems(_req, res, next) {
  try {
    const items = await ResearchItem.find().sort({ createdAt: -1 })
    res.json({ ok: true, data: items.map(serializeResearchItem) })
  } catch (error) {
    next(error)
  }
}

export async function createAdminResearchItem(req, res, next) {
  try {
    const body = req.body || {}
    const item = await ResearchItem.create({
      title: body.title || 'Untitled Research',
      slug: normalizeSlug(body.title, body.slug),
      phase: body.phase || 'ongoing',
      status: body.status || 'published',
      excerpt: body.excerpt || '',
      content: body.content || '',
      image: body.image || null,
      linkedProductId: body.linkedProductId || '',
    })

    res.status(201).json({ ok: true, data: serializeResearchItem(item) })
  } catch (error) {
    next(error)
  }
}

export async function updateAdminResearchItem(req, res, next) {
  try {
    const item = await ResearchItem.findById(req.params.id)
    if (!item) return next(createHttpError(404, 'Research item not found'))

    const body = req.body || {}
    item.title = body.title ?? item.title
    item.slug = body.slug ?? item.slug
    item.phase = body.phase ?? item.phase
    item.status = body.status ?? item.status
    item.excerpt = body.excerpt ?? item.excerpt
    item.content = body.content ?? item.content
    if (body.image) item.image = body.image
    item.linkedProductId = body.linkedProductId ?? item.linkedProductId

    await item.save()
    res.json({ ok: true, data: serializeResearchItem(item) })
  } catch (error) {
    next(error)
  }
}

export async function deleteAdminResearchItem(req, res, next) {
  try {
    const item = await ResearchItem.findById(req.params.id)
    if (!item) return next(createHttpError(404, 'Research item not found'))

    await item.deleteOne()
    res.json({ ok: true, data: serializeResearchItem(item) })
  } catch (error) {
    next(error)
  }
}
