import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminShell } from './shared.jsx'

export function AdminCategoriesPage({ pathname, onNavigate }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        setLoading(true)
        const response = await adminRequest('/admin/categories')
        if (!cancelled) setCategories(response.data || [])
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Failed to load categories')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title="Categories"
        subtitle="Categories are derived automatically from the categories assigned to your products."
        actions={
          <button type="button" className="admin-primary-button" onClick={() => onNavigate('/admin/products/new')}>
            <span className="admin-inline-icon">+</span> Add Product
          </button>
        }
      />

      <AdminCard>
        {loading ? <p>Loading categories...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error && categories.length === 0 ? (
          <p className="admin-help-text">
            No categories yet. Categories appear here as soon as you assign one to a product on the Products page.
          </p>
        ) : null}

        {categories.length ? (
          <div className="admin-table">
            <div className="admin-table__head">
              <span>CATEGORY</span>
              <span>PRODUCTS</span>
            </div>
            <div className="admin-table__body">
              {categories.map((category) => (
                <div key={category.name} className="admin-table__row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <span>{category.name}</span>
                  <span>{category.productCount}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </AdminCard>
    </AdminShell>
  )
}
