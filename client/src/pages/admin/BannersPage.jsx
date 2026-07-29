import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminShell } from './shared.jsx'

export function AdminBannersPage({ pathname, onNavigate }) {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadBanners = async () => {
    try {
      setLoading(true)
      const response = await adminRequest('/admin/banners')
      setBanners(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const handleDeleteBanner = async (id) => {
    if (!id || !window.confirm('Delete this banner?')) return
    try {
      await adminRequest(`/admin/banners/${id}`, { method: 'DELETE' })
      await loadBanners()
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete banner')
    }
  }

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title="Banners"
        subtitle="Manage your homepage carousel banners."
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <AdminCard
        title="Banners"
        actions={
          <button
            type="button"
            className="admin-primary-button"
            onClick={() => onNavigate('/admin/banners/new')}
          >
            <span className="admin-inline-icon">+</span> Add Banner
          </button>
        }
      >
        <div className="admin-table">
          <div className="admin-table__head">
            <span>TITLE</span>
            <span>STATUS</span>
            <span>POSITION</span>
            <span>ACTIONS</span>
          </div>
          {loading ? (
            <p className="text-sm text-gray-600 p-4">Loading banners...</p>
          ) : banners.length === 0 ? (
            <p className="text-sm text-gray-600 p-4">No banners yet.</p>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="admin-table__row">
                <span className="admin-table__cell">
                  <strong>{banner.title}</strong>
                </span>
                <span className="admin-table__cell">
                  <span className={`admin-pill admin-pill--${banner.status === 'published' ? 'green' : 'gray'}`}>
                    {banner.status}
                  </span>
                </span>
                <span className="admin-table__cell">{banner.position}</span>
                <span className="admin-table__cell">
                  <button
                    type="button"
                    className="admin-table__button admin-table__button--edit"
                    onClick={() => onNavigate(`/admin/banners/${banner.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="admin-table__button admin-table__button--delete"
                    onClick={() => handleDeleteBanner(banner.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </AdminCard>
    </AdminShell>
  )
}
