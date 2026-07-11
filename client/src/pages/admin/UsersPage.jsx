import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminPill, AdminShell } from './shared.jsx'

function Avatar({ label }) {
  return <div className="admin-avatar">{label}</div>
}

export function AdminUsersPage({ pathname, onNavigate }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Viewer' })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'Viewer' })

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminRequest('/admin/users')
      setUsers(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const startEditUser = (user) => {
    setEditingId(user.id)
    setEditForm({ name: user.name || '', email: user.email || '', role: user.role || 'Viewer' })
  }

  const cancelEditUser = () => {
    setEditingId(null)
  }

  const updateEditField = (field) => (event) => {
    setEditForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSaveUser = async (id) => {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      await adminRequest(`/admin/users/${id}`, { method: 'PUT', body: editForm })
      setMessage('User updated.')
      setEditingId(null)
      await loadUsers()
    } catch (requestError) {
      setError(requestError.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    setMessage('')
    setError('')
    try {
      await adminRequest(`/admin/users/${id}`, { method: 'DELETE' })
      setMessage('User deleted.')
      await loadUsers()
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete user')
    }
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      await adminRequest('/admin/users', {
        method: 'POST',
        body: form,
      })
      setMessage('User created.')
      setForm({ name: '', email: '', password: '', role: 'Viewer' })
      setCreating(false)
      const response = await adminRequest('/admin/users')
      setUsers(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to create user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader
        title="Users"
        subtitle="Manage all users who have access to the admin panel."
        actions={
          <button type="button" className="admin-primary-button" onClick={() => setCreating((current) => !current)}>
            <span className="admin-inline-icon">+</span> Add User
          </button>
        }
      />

      <AdminCard>
        {creating ? (
          <form className="admin-user-create" onSubmit={handleCreateUser}>
            <div className="admin-form-grid">
              <label>
                Name
                <input value={form.name} onChange={updateField('name')} type="text" placeholder="Full name" />
              </label>
              <label>
                Email
                <input value={form.email} onChange={updateField('email')} type="email" placeholder="user@example.com" />
              </label>
              <label>
                Password
                <input value={form.password} onChange={updateField('password')} type="password" placeholder="Temporary password" />
              </label>
              <label>
                Role
                <select value={form.role} onChange={updateField('role')}>
                  <option value="Viewer">Viewer</option>
                  <option value="Author">Author</option>
                  <option value="Editor">Editor</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </label>
            </div>
            <div className="account-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setCreating(false)}>
                Cancel
              </button>
              <button type="submit" className="admin-primary-button" disabled={saving}>
                {saving ? 'Saving...' : 'Create User'}
              </button>
            </div>
          </form>
        ) : null}

        <div className="admin-toolbar">
          <div className="admin-search">
            <input type="search" placeholder="Search users..." />
            <span aria-hidden="true">Search</span>
          </div>
          <button type="button" className="admin-secondary-button">
            Filter <span className="admin-inline-icon">v</span>
          </button>
        </div>

        {message ? <p className="text-sm text-green-700">{message}</p> : null}
        {loading ? <p>Loading users...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="admin-table">
          <div className="admin-table__head admin-table__head--users">
            <span>USER</span>
            <span>EMAIL</span>
            <span>ROLE</span>
            <span>STATUS</span>
            <span>LAST ACTIVE</span>
            <span>ACTIONS</span>
          </div>
          <div className="admin-table__body">
            {users.map((user) => (
              <div key={user.id || user.email} className="admin-table__row admin-table__row--users">
                {editingId === user.id ? (
                  <>
                    <div className="admin-user-cell">
                      <Avatar label={user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)} />
                      <input value={editForm.name} onChange={updateEditField('name')} type="text" placeholder="Name" />
                    </div>
                    <input value={editForm.email} onChange={updateEditField('email')} type="email" placeholder="Email" />
                    <select value={editForm.role} onChange={updateEditField('role')}>
                      <option value="Viewer">Viewer</option>
                      <option value="Author">Author</option>
                      <option value="Editor">Editor</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                    <span>
                      <AdminPill tone={user.status === 'active' ? 'green' : 'gray'}>{user.status}</AdminPill>
                    </span>
                    <span>{user.lastActive ? new Date(user.lastActive).toLocaleString() : ''}</span>
                    <div className="admin-actions">
                      <button type="button" onClick={() => handleSaveUser(user.id)} disabled={saving}>
                        <span className="admin-action-icon">save</span>
                      </button>
                      <button type="button" onClick={cancelEditUser}>
                        <span className="admin-action-icon">cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="admin-user-cell">
                      <Avatar label={user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)} />
                      <div>
                        <strong>{user.name}</strong>
                        {user.email === 'admin@shop.com' || user.role === 'Administrator' ? <span className="admin-self-tag">You</span> : null}
                      </div>
                    </div>
                    <span>{user.email}</span>
                    <span>
                      <AdminPill tone={user.role === 'Administrator' ? 'purple' : user.role === 'Editor' ? 'blue' : 'amber'}>{user.role}</AdminPill>
                    </span>
                    <span>
                      <AdminPill tone={user.status === 'active' ? 'green' : 'gray'}>{user.status}</AdminPill>
                    </span>
                    <span>{user.lastActive ? new Date(user.lastActive).toLocaleString() : ''}</span>
                    <div className="admin-actions">
                      <button type="button" aria-label="Edit" onClick={() => startEditUser(user)}>
                        <span className="admin-action-icon">edit</span>
                      </button>
                      <button type="button" aria-label="Delete" onClick={() => handleDeleteUser(user.id)}>
                        <span className="admin-action-icon admin-action-icon--danger">del</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="admin-table__footer">
            <span>Showing {users.length} users</span>
            <div className="admin-pagination">
              <button type="button">&lt;</button>
              <button type="button" className="is-active">1</button>
              <button type="button">&gt;</button>
            </div>
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  )
}
