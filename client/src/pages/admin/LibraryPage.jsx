import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminPill, AdminShell } from './shared.jsx'

const initialForm = {
  title: '',
  slug: '',
  section: 'Product Guides',
  type: '',
  status: 'published',
  excerpt: '',
  localName: '',
  therapeuticUse: '',
  preparationMethod: '',
  dosage: '',
  constituents: '',
  resourceUrl: '',
  linkedProductId: '',
  image: null,
}

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

export function AdminLibraryPage({ pathname, onNavigate }) {
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
      const response = await adminRequest('/admin/library-items')
      setItems(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load library items')
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
      section: item.section || 'General',
      type: item.type || '',
      status: item.status || 'published',
      excerpt: item.excerpt || '',
      localName: item.localName || '',
      therapeuticUse: item.therapeuticUse || '',
      preparationMethod: item.preparationMethod || '',
      dosage: item.dosage || '',
      constituents: item.constituents || '',
      resourceUrl: item.resourceUrl || '',
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
        await adminRequest(`/admin/library-items/${selectedId}`, { method: 'PUT', body: payload })
        setMessage('Library item updated.')
      } else {
        await adminRequest('/admin/library-items', { method: 'POST', body: payload })
        setMessage('Library item created.')
      }

      resetForm()
      await loadItems()
    } catch (requestError) {
      setError(requestError.message || 'Failed to save library item')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this library item?')) return

    setError('')
    setMessage('')
    try {
      await adminRequest(`/admin/library-items/${id}`, { method: 'DELETE' })
      if (selectedId === id) resetForm()
      await loadItems()
      setMessage('Library item deleted.')
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete library item')
    }
  }

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        backLabel="<- Back to Dashboard"
        onBack={() => onNavigate('/admin')}
        title={selectedId ? 'Edit Library Item' : 'Add Library Item'}
        subtitle="Create content for the public library page."
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
                <input value={form.title} onChange={updateField('title')} type="text" placeholder="Enter resource title" />
              </label>
              <label>
                Slug
                <input value={form.slug} onChange={updateField('slug')} type="text" placeholder="enter-resource-slug" />
              </label>
              <label>
                Section
                <input value={form.section} onChange={updateField('section')} type="text" placeholder="Product Guides" />
              </label>
              <label>
                Type
                <input value={form.type} onChange={updateField('type')} type="text" placeholder="Guide, Paper, Notes" />
              </label>
              <label>
                Linked Product ID
                <input value={form.linkedProductId} onChange={updateField('linkedProductId')} type="text" placeholder="Optional product id" />
              </label>
              <label>
                Excerpt
                <textarea value={form.excerpt} onChange={updateField('excerpt')} placeholder="Short summary for the card" rows={5} />
              </label>
              <label>
                Local Name
                <input value={form.localName} onChange={updateField('localName')} type="text" placeholder="Example: Ewe Moringa" />
              </label>
              <label>
                Therapeutic Use
                <input value={form.therapeuticUse} onChange={updateField('therapeuticUse')} type="text" placeholder="Example: Immunity, digestion, blood sugar support" />
              </label>
              <label>
                Preparation Method
                <textarea value={form.preparationMethod} onChange={updateField('preparationMethod')} placeholder="How this herb or material is prepared" rows={4} />
              </label>
              <label>
                Dosage
                <textarea value={form.dosage} onChange={updateField('dosage')} placeholder="Suggested dosage or usage notes" rows={3} />
              </label>
              <label>
                Active Constituents
                <textarea value={form.constituents} onChange={updateField('constituents')} placeholder="Key active compounds or phytochemicals" rows={3} />
              </label>
              <label>
                Resource URL
                <input value={form.resourceUrl} onChange={updateField('resourceUrl')} type="url" placeholder="https://example.com/resource-or-paper" />
              </label>
            </div>
          </AdminCard>
        </div>

        <aside className="admin-form-layout__side">
          <AdminCard title="Image & Publish">
            <div className="admin-form-grid admin-form-grid--single">
              <label>
                Resource Image
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
              {form.image ? <img src={getImageUrl(form.image)} alt={form.title || 'Library item'} style={{ width: '100%', borderRadius: '8px' }} /> : null}
              <label>
                Status
                <select value={form.status} onChange={updateField('status')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <button type="submit" className="admin-primary-button" disabled={loading || uploading}>
                {loading ? 'Saving...' : selectedId ? 'Update Library Item' : 'Save Library Item'}
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

      <AdminCard title="Existing Library Items" subtitle="Edit or delete items from the admin API.">
        {listLoading ? <p>Loading library items...</p> : null}
        {!listLoading && items.length === 0 ? <p>No library items yet.</p> : null}
        <div className="admin-table">
          <div className="admin-table__head admin-table__head--products">
            <span>Title</span>
            <span>Section</span>
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
                <div><AdminPill tone="muted">{item.section}</AdminPill></div>
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
