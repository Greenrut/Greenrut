import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminPill, AdminShell } from './shared.jsx'

const initialForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'Admin',
  status: 'draft',
}

export function AdminBlogPostPage({ pathname, onNavigate }) {
  const [form, setForm] = useState(initialForm)
  const [posts, setPosts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadPosts = async () => {
    try {
      setListLoading(true)
      const response = await adminRequest('/admin/posts')
      setPosts(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load blog posts')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setSelectedId(null)
  }

  const startEdit = (post) => {
    setSelectedId(post.id)
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      author: post.author || 'Admin',
      status: post.status || 'draft',
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (selectedId) {
        await adminRequest(`/admin/posts/${selectedId}`, {
          method: 'PUT',
          body: form,
        })
        setMessage('Blog post updated.')
      } else {
        await adminRequest('/admin/posts', {
          method: 'POST',
          body: form,
        })
        setMessage('Blog post created.')
      }

      resetForm()
      await loadPosts()
    } catch (requestError) {
      setError(requestError.message || 'Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return

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

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        backLabel="<- Back to Blog Posts"
        onBack={() => onNavigate('/admin')}
        title={selectedId ? 'Edit Blog Post' : 'Add New Blog Post'}
        subtitle="Create and publish a new blog post."
        actions={
          <button type="button" className="admin-primary-button" onClick={handleSubmit}>
            {loading ? 'Publishing...' : selectedId ? 'Update Post' : 'Publish'}
          </button>
        }
      />

      <form className="admin-form-layout" onSubmit={handleSubmit}>
        <div className="admin-form-layout__main">
          <AdminCard>
            <div className="admin-form-grid admin-form-grid--single">
              <label>
                Title
                <input value={form.title} onChange={updateField('title')} type="text" placeholder="Enter post title" />
              </label>
              <label>
                Slug
                <input value={form.slug} onChange={updateField('slug')} type="text" placeholder="enter-post-slug" />
              </label>
              <label>
                Excerpt
                <textarea value={form.excerpt} onChange={updateField('excerpt')} placeholder="Write a short excerpt (optional)" rows={4} />
              </label>
              <label>
                Content
                <textarea value={form.content} onChange={updateField('content')} placeholder="Write your content here..." rows={12} />
              </label>
            </div>
          </AdminCard>
        </div>

        <aside className="admin-form-layout__side">
          <AdminCard title="Publish">
            <label>
              Author
              <input value={form.author} onChange={updateField('author')} type="text" />
            </label>
            <label>
              Status
              <select value={form.status} onChange={updateField('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            {message ? <p className="text-sm text-green-700">{message}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button type="submit" className="admin-primary-button" disabled={loading}>
              {loading ? 'Publishing...' : selectedId ? 'Update Post' : 'Save Post'}
            </button>
            {selectedId ? (
              <button type="button" className="admin-secondary-button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </AdminCard>
        </aside>
      </form>

      <AdminCard title="Existing Blog Posts" subtitle="Edit or delete posts from the admin API.">
        {listLoading ? <p>Loading posts...</p> : null}
        {!listLoading && posts.length === 0 ? <p>No blog posts yet.</p> : null}
        <div className="admin-table">
          <div className="admin-table__head admin-table__head--blog">
            <span>TITLE</span>
            <span>AUTHOR</span>
            <span>STATUS</span>
            <span>DATE</span>
            <span>ACTIONS</span>
          </div>
          <div className="admin-table__body">
            {posts.map((post) => (
              <div key={post.id || post.title} className="admin-table__row admin-table__row--blog">
                <div className="admin-table__product">
                  <span>{post.title}</span>
                </div>
                <span>{post.author}</span>
                <span>{post.status === 'published' ? <AdminPill>Published</AdminPill> : <AdminPill tone="amber">Draft</AdminPill>}</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                <div className="admin-actions">
                  <button type="button" aria-label="Edit" onClick={() => startEdit(post)}>
                    <span className="admin-action-icon">edit</span>
                  </button>
                  <button type="button" aria-label="Delete" onClick={() => handleDelete(post.id)}>
                    <span className="admin-action-icon admin-action-icon--danger">del</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  )
}
