import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminPill, AdminShell } from './shared.jsx'

const initialForm = {
  title: '',
  slug: '',
  category: 'Wellness',
  excerpt: '',
  content: '',
  author: 'Admin',
  status: 'draft',
  coverImage: null,
}

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') {
    return image.url || image.src || image.secureUrl || image.path || ''
  }
  return ''
}

export function AdminBlogPostPage({ pathname, search, onNavigate }) {
  const [form, setForm] = useState(initialForm)
  const [posts, setPosts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [searchFilter, setSearchFilter] = useState('')

  const loadPosts = async () => {
    try {
      setListLoading(true)
      const response = await adminRequest('/admin/posts')
      const items = response.data || []
      setPosts(items)

      // Check if an ID was passed via search query param
      const queryId = new URLSearchParams(search || (typeof window !== 'undefined' ? window.location.search : '')).get('id')
      if (queryId) {
        const found = items.find((p) => String(p.id) === String(queryId) || String(p._id) === String(queryId))
        if (found) {
          startEdit(found)
        }
      }
    } catch (requestError) {
      setError(requestError.message || 'Failed to load blog posts')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [search])

  const updateField = (field) => (event) => {
    const val = event.target.value
    setForm((current) => {
      const next = { ...current, [field]: val }
      // Auto-generate slug from title if slug is untouched
      if (field === 'title' && (!current.slug || current.slug === slugify(current.title))) {
        next.slug = slugify(val)
      }
      return next
    })
  }

  const slugify = (text) => {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const resetForm = () => {
    setForm(initialForm)
    setSelectedId(null)
    setMessage('')
    setError('')
  }

  const startEdit = (post) => {
    setSelectedId(post.id || post._id)
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Wellness',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'Admin',
      status: post.status || 'draft',
      coverImage: post.coverImage || null,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file, file.name)
      const response = await adminRequest('/admin/uploads/image', {
        method: 'POST',
        body: formData,
      })
      setForm((current) => ({ ...current, coverImage: response.data || null }))
      setMessage('Cover image uploaded successfully.')
    } catch (requestError) {
      setError(requestError.message || 'Failed to upload cover image')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleRemoveImage = () => {
    setForm((current) => ({ ...current, coverImage: null }))
  }

  const handleSubmit = async (event) => {
    if (event) event.preventDefault()
    if (!form.title.trim()) {
      setError('Article title is required.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        ...form,
        slug: form.slug.trim() || slugify(form.title),
      }

      if (selectedId) {
        await adminRequest(`/admin/posts/${selectedId}`, {
          method: 'PUT',
          body: payload,
        })
        setMessage('Blog post updated successfully.')
      } else {
        await adminRequest('/admin/posts', {
          method: 'POST',
          body: payload,
        })
        setMessage('Blog post created and published.')
      }

      resetForm()
      await loadPosts()
    } catch (requestError) {
      setError(requestError.message || 'Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete article "${title || 'this post'}"?`)) return

    setError('')
    setMessage('')
    try {
      await adminRequest(`/admin/posts/${id}`, { method: 'DELETE' })
      if (selectedId === id) {
        resetForm()
      }
      await loadPosts()
      setMessage('Blog post deleted.')
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete blog post')
    }
  }

  const filteredPosts = posts.filter((p) => {
    if (!searchFilter) return true
    const q = searchFilter.toLowerCase()
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.author && p.author.toLowerCase().includes(q)) ||
      (p.status && p.status.toLowerCase().includes(q))
    )
  })

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        backLabel="← Operations Dashboard"
        onBack={() => onNavigate('/admin')}
        title={selectedId ? 'Edit Self-Care Article' : 'Publish Self-Care Article'}
        subtitle="Manage wellness guides, herbal recipes, scientific research notes, and educational podcasts."
        actions={
          <div style={{ display: 'flex', gap: '10px' }}>
            {selectedId ? (
              <button type="button" className="admin-secondary-button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
            <button
              type="button"
              className="admin-primary-button"
              disabled={loading || uploading}
              onClick={handleSubmit}
            >
              {loading ? 'Saving...' : selectedId ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        }
      />

      {message ? (
        <div style={{ padding: '12px 18px', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: '8px', marginBottom: '20px', fontWeight: 500 }}>
          ✓ {message}
        </div>
      ) : null}

      {error ? (
        <div style={{ padding: '12px 18px', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '20px', fontWeight: 500 }}>
          ✕ {error}
        </div>
      ) : null}

      <form className="admin-form-layout" onSubmit={handleSubmit}>
        <div className="admin-form-layout__main">
          <AdminCard title="Article Content" subtitle="Draft your educational guide or herbal wellness post.">
            <div className="admin-form-grid admin-form-grid--single">
              <label>
                Article Title *
                <input
                  value={form.title}
                  onChange={updateField('title')}
                  type="text"
                  placeholder="e.g. The Future of Medicine: Herbal, Holistic and High-tech"
                  required
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <label>
                  URL Slug
                  <input
                    value={form.slug}
                    onChange={updateField('slug')}
                    type="text"
                    placeholder="e.g. future-of-medicine"
                  />
                </label>
                <label>
                  Category
                  <select value={form.category} onChange={updateField('category')}>
                    <option value="Wellness">General Wellness</option>
                    <option value="Articles">Articles & Research</option>
                    <option value="Recipes">Herbal Recipes</option>
                    <option value="Videos & Media">Videos & Media</option>
                    <option value="Podcasts">Podcasts</option>
                  </select>
                </label>
              </div>

              <label>
                Key Excerpt / Highlight Summary
                <textarea
                  value={form.excerpt}
                  onChange={updateField('excerpt')}
                  placeholder="Brief summary shown on homepage cards and article header..."
                  rows={3}
                />
              </label>

              <label>
                Full Article Body *
                <textarea
                  value={form.content}
                  onChange={updateField('content')}
                  placeholder="Write the full content of the post here. Paragraphs separated by new lines will format with readable typography..."
                  rows={14}
                  required
                />
              </label>
            </div>
          </AdminCard>
        </div>

        <aside className="admin-form-layout__side">
          <AdminCard title="Cover Picture" subtitle="Featured photo attached to this article.">
            <div className="admin-form-grid admin-form-grid--single">
              <label>
                Upload Photo (Cloudinary CDN)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>

              {uploading ? (
                <div style={{ textAlign: 'center', padding: '16px', color: '#16a34a', fontWeight: 600 }}>
                  Uploading photo to CDN...
                </div>
              ) : null}

              {getImageUrl(form.coverImage) ? (
                <div style={{ position: 'relative', marginTop: '8px' }}>
                  <img
                    src={getImageUrl(form.coverImage)}
                    alt={form.title || 'Blog cover'}
                    style={{
                      width: '100%',
                      maxHeight: '220px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      display: 'block',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: '#dc2626',
                      background: '#fee2e2',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Remove Photo
                  </button>
                </div>
              ) : (
                <div style={{ padding: '24px 16px', background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '8px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                  No cover photo selected. Choose an image file above.
                </div>
              )}

              <label>
                Author Byline
                <input
                  value={form.author}
                  onChange={updateField('author')}
                  type="text"
                  placeholder="e.g. Dr. Alex Mfoniso / Admin"
                />
              </label>

              <label>
                Publication Status
                <select value={form.status} onChange={updateField('status')}>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Live on site)</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="admin-primary-button"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={loading || uploading}
            >
              {uploading ? 'Uploading...' : loading ? 'Saving...' : selectedId ? 'Update Article' : 'Publish Article'}
            </button>
          </AdminCard>
        </aside>
      </form>

      {/* EXISTING BLOG POSTS ARCHIVE TABLE */}
      <AdminCard
        title="Published & Draft Articles"
        subtitle="All self-care articles currently saved in the Greenrut database."
        actions={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Filter by title..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="admin-search-input"
              style={{ width: '180px', padding: '6px 12px', fontSize: '13px' }}
            />
          </div>
        }
      >
        {listLoading ? <p className="admin-card-loading">Loading articles...</p> : null}
        {!listLoading && filteredPosts.length === 0 ? (
          <div className="admin-table__empty">No articles found in the database.</div>
        ) : null}

        <div className="admin-table-container">
          <div className="admin-table">
            <div className="admin-table__head admin-table__head--blog">
              <span>PHOTO & ARTICLE TITLE</span>
              <span>AUTHOR</span>
              <span>STATUS</span>
              <span>DATE</span>
              <span>ACTIONS</span>
            </div>
            <div className="admin-table__body">
              {filteredPosts.map((post) => {
                const imgUrl = getImageUrl(post.coverImage)
                return (
                  <div key={post.id || post._id || post.title} className="admin-table__row admin-table__row--blog">
                    <div className="admin-table__product">
                      <div className="admin-table__product-thumb">
                        {imgUrl ? (
                          <img src={imgUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span>{(post.title?.[0] || 'A').toUpperCase()}</span>
                        )}
                      </div>
                      <div className="admin-table__product-info">
                        <strong>{post.title}</strong>
                        {post.slug && <span>/{post.slug}</span>}
                      </div>
                    </div>
                    <span>{post.author || 'Admin'}</span>
                    <span>
                      {post.status === 'published' ? (
                        <AdminPill tone="green">Published</AdminPill>
                      ) : (
                        <AdminPill tone="amber">Draft</AdminPill>
                      )}
                    </span>
                    <span>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-action-btn"
                        title="Edit Article"
                        onClick={() => startEdit(post)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="admin-action-btn admin-action-btn--danger"
                        title="Delete Article"
                        onClick={() => handleDelete(post.id || post._id, post.title)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  )
}
