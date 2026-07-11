import { useEffect, useState } from 'react'
import { adminRequest } from '../../lib/adminApi.js'
import { AdminCard, AdminPageHeader, AdminShell } from './shared.jsx'

export function AdminSettingsPage({ pathname, onNavigate }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      try {
        setLoading(true)
        const response = await adminRequest('/admin/auth/me')
        if (!cancelled) setProfile(response.data || response.user || null)
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || 'Failed to load admin profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      cancelled = true
    }
  }, [])

  const updatePasswordField = (field) => (event) => {
    setPasswordForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleChangePassword = async (event) => {
    event.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    setSavingPassword(true)
    try {
      await adminRequest('/auth/password', {
        method: 'PATCH',
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      })
      setPasswordMessage('Password updated.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (requestError) {
      setPasswordError(requestError.message || 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <AdminShell pathname={pathname} onNavigate={onNavigate}>
      <AdminPageHeader title="Settings" subtitle="Manage your admin account settings." />

      <AdminCard title="Admin Profile">
        {loading ? <p>Loading profile...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error && profile ? (
          <div className="admin-form-grid">
            <label>
              Name
              <input type="text" value={profile.name || ''} readOnly />
            </label>
            <label>
              Email
              <input type="email" value={profile.email || ''} readOnly />
            </label>
            <label>
              Role
              <input type="text" value={profile.role || 'Administrator'} readOnly />
            </label>
          </div>
        ) : null}
      </AdminCard>

      <AdminCard title="Change Password" subtitle="Update the password used to sign in to the admin panel.">
        <form className="admin-form-grid" onSubmit={handleChangePassword}>
          <label>
            Current Password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={updatePasswordField('currentPassword')}
              placeholder="Current password"
            />
          </label>
          <label>
            New Password
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={updatePasswordField('newPassword')}
              placeholder="New password"
            />
          </label>
          <label>
            Confirm New Password
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={updatePasswordField('confirmPassword')}
              placeholder="Confirm new password"
            />
          </label>

          <div className="admin-form-grid__full account-actions">
            {passwordMessage ? <p className="text-sm text-green-700">{passwordMessage}</p> : null}
            {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
            <button type="submit" className="admin-primary-button" disabled={savingPassword}>
              {savingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </div>
        </form>
      </AdminCard>
    </AdminShell>
  )
}
