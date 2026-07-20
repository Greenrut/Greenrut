import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminPill, AdminShell } from './shared.jsx'

const initialForm = {
  name: '',
  role: 'Customer',
  quote: '',
  rating: 5,
  status: 'published',
  sortOrder: 0,
}

export function AdminReviewsPage({ pathname, onNavigate }) {
  const [form, setForm] = useState(initialForm)
  const [reviews, setReviews] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadReviews = async () => {
    try {
      setListLoading(true)
      const response = await adminRequest('/admin/reviews')
      setReviews(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load reviews')
    } finally {
      setListLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const resetForm = () => {
    setForm(initialForm)
    setSelectedId(null)
  }

  const startEdit = (review) => {
    setSelectedId(review.id)
    setForm({
      name: review.name || '',
      role: review.role || 'Customer',
      quote: review.quote || '',
      rating: review.rating || 5,
      status: review.status || 'published',
      sortOrder: review.sortOrder || 0,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        ...form,
        rating: Number(form.rating || 5),
        sortOrder: Number(form.sortOrder || 0),
      }

      if (selectedId) {
        await adminRequest(`/admin/reviews/${selectedId}`, { method: 'PUT', body: payload })
        setMessage('Review updated.')
      } else {
        await adminRequest('/admin/reviews', { method: 'POST', body: payload })
        setMessage('Review created.')
      }

      resetForm()
      await loadReviews()
    } catch (requestError) {
      setError(requestError.message || 'Failed to save review')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return

    setMessage('')
    setError('')
    try {
      await adminRequest(`/admin/reviews/${id}`, { method: 'DELETE' })
      if (selectedId === id) resetForm()
      await loadReviews()
      setMessage('Review deleted.')
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete review')
    }
  }

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        backLabel="<- Back to Dashboard"
        onBack={() => onNavigate('/admin')}
        title={selectedId ? 'Edit Review' : 'Add Review'}
        subtitle="Create customer reviews that appear on the homepage."
        actions={
          <button type="button" className="admin-primary-button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : selectedId ? 'Update Review' : 'Publish Review'}
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
                Customer Name
                <input value={form.name} onChange={updateField('name')} type="text" placeholder="Customer name" required />
              </label>
              <label>
                Review
                <textarea value={form.quote} onChange={updateField('quote')} placeholder="Write the review" rows={7} required />
              </label>
            </div>
          </AdminCard>
        </div>

        <aside className="admin-form-layout__side">
          <AdminCard title="Publish Settings">
            <div className="admin-form-grid admin-form-grid--single">
              <label>
                Role
                <input value={form.role} onChange={updateField('role')} type="text" placeholder="Customer" />
              </label>
              <label>
                Rating
                <select value={form.rating} onChange={updateField('rating')}>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </label>
              <label>
                Sort Order
                <input value={form.sortOrder} onChange={updateField('sortOrder')} type="number" />
              </label>
              <label>
                Status
                <select value={form.status} onChange={updateField('status')}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </label>
              <button type="submit" className="admin-primary-button" disabled={loading}>
                {loading ? 'Saving...' : selectedId ? 'Update Review' : 'Save Review'}
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

      <AdminCard title="Existing Reviews" subtitle="Published reviews show on the homepage.">
        {listLoading ? <p>Loading reviews...</p> : null}
        {!listLoading && reviews.length === 0 ? <p>No reviews yet.</p> : null}
        <div className="admin-table">
          <div className="admin-table__head admin-table__head--products">
            <span>Name</span>
            <span>Rating</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="admin-table__body">
            {reviews.map((review) => (
              <div key={review.id || review.name} className="admin-table__row admin-table__row--products">
                <div>
                  <strong>{review.name}</strong>
                  <p>{review.quote}</p>
                </div>
                <div>{review.rating}/5</div>
                <div><AdminPill tone={review.status === 'published' ? 'success' : 'warning'}>{review.status}</AdminPill></div>
                <div className="admin-actions">
                  <button type="button" onClick={() => startEdit(review)}><span className="admin-action-icon">edit</span></button>
                  <button type="button" onClick={() => handleDelete(review.id)}><span className="admin-action-icon admin-action-icon--danger">del</span></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  )
}
