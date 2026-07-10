import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminPill, AdminShell } from './shared.jsx'

const initialForm = {
  title: '',
  slug: '',
  phase: 'ongoing',
  status: 'published',
  excerpt: '',
  content: '',
  linkedProductId: '',
  image: null,
}

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

export function AdminResearchPage({ pathname, onNavigate }) {
  const [form, setForm] = useState(initialForm)
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadItems = async () => {
    try {
      setListLoading(true)
      const response = await adminRequest('/admin/research-items')
      setItems(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load research items')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setSelectedId(null)
  }

  const startEdit = (item) => {
    setSelectedId(item.id)
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      phase: item.phase || 'ongoing',
      status: item.status || 'published',
      excerpt: item.excerpt || '',
      content: item.content || '',
      linkedProductId: item.linkedProductId || '',
      image: item.image || null,
    })
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
      const response = await adminRequest('/admin/uploads/image', { method: 'POST', body: formData })
      setForm((current) => ({ ...current, image: response.data || null }))
      setMessage('Image uploaded.')
    } catch (requestError) {
      setError(requestError.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const payload = { ...form }
      if (selectedId) {
        await adminRequest(`/admin/research-items/${selectedId}`, { method: 'PUT', body: payload })
        setMessage('Research item updated.')
      } else {
        await adminRequest('/admin/research-items', { method: 'POST', body: payload })
        setMessage('Research item created.')
      }

      resetForm()
      await loadItems()
    } catch (requestError) {
      setError(requestError.message || 'Failed to save research item')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this research item?')) return

    setError('')
    setMessage('')
    try {
      await adminRequest(`/admin/research-items/${id}`, { method: 'DELETE' })
      if (selectedId === id) resetForm()
      await loadItems()
      setMessage('Research item deleted.')
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete research item')
    }
  }

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        backLabel="<- Back to Dashboard"
        onBack={() => onNavigate('/admin')}
        title={selectedId ? 'Edit Research Item' : 'Add Research Item'}
        subtitle="Create research content for the public research page."
        actions={
          <button type="button" className="admin-primary-button" onClick={handleSubmit}>
            {loading ? 'Saving...' : selectedId ? 'Update Item' : 'Publish Item'}
          </button>
        }
      />

      {message ? <p className="mb-3 text-sm text-[#5f8e1d]">{message}</p> : null}
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <form className="admin-form-layout" onSubmit={handleSubmit}>
        <div className="admin-form-layout__main">
          <AdminCard>
            <div className="admin-form-grid admin-form-grid--single">
              <label>
                Title
                <input value={form.title} onChange={updateField('title')} type="text" placeholder="Enter research title" />
              </label>
              <label>
                Slug
                <input value={form.slug} onChange={updateField('slug')} type="text" placeholder="enter-research-slug" />
              </label>
              <label>
                Phase
                <select value={form.phase} onChange={updateField('phase')}>
                  <option value="ongoing">Ongoing</option>
                  <option value="concluded">Concluded</option>
                  <option value="future">Future</option>
                </select>
              </label>
              <label>
                Linked Product ID
                <input value={form.linkedProductId} onChange={updateField('linkedProductId')} type="text" placeholder="Optional product id" />
              </label>
              <label>
                Excerpt
                <textarea value={form.excerpt} onChange={updateField('excerpt')} placeholder="Short summary for the card" rows={4} />
              </label>
              <label>
                Content
                <textarea value={form.content} onChange={updateField('content')} placeholder="Add research notes or detail here" rows={10} />
              </label>
            </div>
          </AdminCard>
        </div>

        <aside className="admin-form-layout__side">
          <AdminCard title="Image & Publish">
            <div className="admin-form-grid admin-form-grid--single">
              <label>
                Research Image
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
              {form.image ? <img src={getImageUrl(form.image)} alt={form.title || 'Research item'} style={{ width: '100%', borderRadius: '8px' }} /> : null}
              <label>
                Status
                <select value={form.status} onChange={updateField('status')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <button type="submit" className="admin-primary-button" disabled={loading || uploading}>
                {loading ? 'Saving...' : selectedId ? 'Update Research Item' : 'Save Research Item'}
              </button>
              {selectedId ? (
                <button type="button" className="admin-secondary-button" onClick={resetForm}>
                  Cancel Edit
                </button>
              ) : null}
            </div>
          </AdminCard>
        </aside>
      </form>

      <AdminCard title="Existing Research Items" subtitle="Edit or delete items from the admin API.">
        {listLoading ? <p>Loading research items...</p> : null}
        {!listLoading && items.length === 0 ? <p>No research items yet.</p> : null}
        <div className="admin-table">
          <div className="admin-table__head admin-table__head--products">
            <span>Title</span>
            <span>Phase</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="admin-table__body">
            {items.map((item) => (
              <div key={item.id || item.slug || item.title} className="admin-table__row admin-table__row--products">
                <div className="admin-table__product">
                  {item.image?.url ? <img src={item.image.url} alt={item.title} className="admin-thumb" /> : <div className="admin-thumb" />}
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.excerpt}</p>
                  </div>
                </div>
                <div><AdminPill tone="muted">{item.phase}</AdminPill></div>
                <div><AdminPill tone={item.status === 'published' ? 'success' : 'warning'}>{item.status}</AdminPill></div>
                <div className="admin-actions">
                  <button type="button" onClick={() => startEdit(item)}><span className="admin-action-icon">edit</span></button>
                  <button type="button" onClick={() => handleDelete(item.id)}><span className="admin-action-icon admin-action-icon--danger">del</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  )
}
