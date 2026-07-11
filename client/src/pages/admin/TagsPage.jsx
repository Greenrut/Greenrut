import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminShell } from './shared.jsx'

export function AdminTagsPage({ pathname, onNavigate }) {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadTags() {
      try {
        setLoading(true)
        const response = await adminRequest('/admin/tags')
        if (!cancelled) setTags(response.data || [])
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Failed to load tags')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadTags()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader title="Tags" subtitle="Manage the tags used to label products and content." />

      <AdminCard>
        {loading ? <p>Loading tags...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error && tags.length === 0 ? (
          <p className="admin-help-text">
            Tagging isn&apos;t wired up on products yet, so there&apos;s nothing to show here. Once product tags are
            saved on the backend, they will be listed on this page automatically.
          </p>
        ) : null}

        {tags.length ? (
          <div className="admin-tag-cloud">
            {tags.map((tag) => (
              <span key={tag.name || tag} className="admin-pill">
                {tag.name || tag}
              </span>
            ))}
          </div>
        ) : null}
      </AdminCard>
    </AdminShell>
  )
}
