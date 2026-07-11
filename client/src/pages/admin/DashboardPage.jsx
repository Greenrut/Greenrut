import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminPill, AdminShell, AdminStatCard } from './shared.jsx'

function Thumb({ label }) {
  return (
    <div className="admin-thumb" aria-hidden="true">
      {label}
    </div>
  )
}

export function AdminDashboardPage({ pathname, onNavigate }) {
  const [stats, setStats] = useState({ blogPosts: 0, products: 0, users: 0, accounts: 0 })
  const [products, setProducts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const response = await adminRequest('/admin/dashboard')
      setStats(response.stats || { blogPosts: 0, products: 0, users: 0, accounts: 0 })
      setProducts(response.products || [])
      setRecentPosts(response.recentPosts || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }


        setStats(response.stats || { blogPosts: 0, products: 0, users: 0, accounts: 0 })
        setProducts(response.products || [])
        setRecentPosts(response.recentPosts || [])
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load dashboard')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader title="Dashboard" subtitle="Manage your blog posts and products." />

      <div className="admin-stats-grid">
        <AdminStatCard title="Blog Posts" value={loading ? '...' : stats.blogPosts} description="Manage your blog content" iconTone="blue" />
        <AdminStatCard title="Products" value={loading ? '...' : stats.products} description="Manage your store products" iconTone="green" />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <AdminCard
        title="Products"
        actions={
          <button type="button" className="admin-primary-button" onClick={() => onNavigate('/admin/products/new')}>
            <span className="admin-inline-icon">+</span> Add Product
          </button>
        }
      >
        <div className="admin-table">
          <div className="admin-table__head admin-table__head--products">
            <span>PRODUCT</span>
            <span>CATEGORY</span>
            <span>PRICE</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>
          <div className="admin-table__body">
            {products.map((item) => (
              <div key={item.id || item.name} className="admin-table__row admin-table__row--products">
                <div className="admin-table__product">
                  <Thumb label={item.name?.[0] || 'P'} />
                  <span>{item.name}</span>
                </div>
                <span>{item.category}</span>
                <span>NGN {item.price?.toLocaleString?.() ?? item.price}</span>
                <span>{item.status === 'published' ? <AdminPill>Published</AdminPill> : <AdminPill tone="amber">Draft</AdminPill>}</span>
                <div className="admin-actions">
                  <button type="button" aria-label="Edit">
                    <span className="admin-action-icon">âœŽ</span>
                  </button>
                  <button type="button" aria-label="Delete">
                    <span className="admin-action-icon admin-action-icon--danger">ðŸ—‘</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AdminCard>

      <AdminCard
        title="Recent Blog Posts"
        actions={
          <button type="button" className="admin-secondary-button" onClick={() => onNavigate('/admin/blog/new')}>
            View All Posts
          </button>
        }
      >
        <div className="admin-table">
          <div className="admin-table__head admin-table__head--blog">
            <span>TITLE</span>
            <span>AUTHOR</span>
            <span>STATUS</span>
            <span>DATE</span>
            <span>ACTIONS</span>
          </div>
          <div className="admin-table__body">
            {recentPosts.map((post) => (
              <div key={post.id || post.title} className="admin-table__row admin-table__row--blog">
                <div className="admin-table__product">
                  <Thumb label={post.title?.[0] || 'B'} />
                  <span>{post.title}</span>
                </div>
                <span>{post.author}</span>
                <span>{post.status === 'published' ? <AdminPill>Published</AdminPill> : <AdminPill tone="amber">Draft</AdminPill>}</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
                <div className="admin-actions">
                  <button type="button" aria-label="Edit">
                    <span className="admin-action-icon">âœŽ</span>
                  </button>
                  <button type="button" aria-label="Delete">
                    <span className="admin-action-icon admin-action-icon--danger">ðŸ—‘</span>
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
