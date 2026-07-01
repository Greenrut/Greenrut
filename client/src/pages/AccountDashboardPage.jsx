import { useEffect, useState } from 'react'
import { AccountPageShell } from './account/shared.jsx'
import { accountRequest } from '../lib/accountApi.js'
import { clearUserAuth } from '../lib/auth.js'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}

export function AccountDashboardPage({ pathname, onNavigate }) {
  const [form, setForm] = useState(initialForm)
  const [totals, setTotals] = useState({ addresses: 0, wishlist: 0, inbox: 0, orders: 0 })
  const [activeSection, setActiveSection] = useState('account-info')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAccount() {
      try {
        setLoading(true)
        const response = await accountRequest('/account')
        if (cancelled) return

        setForm({
          firstName: response.data.profile.firstName || '',
          lastName: response.data.profile.lastName || '',
          email: response.data.profile.email || '',
          phone: response.data.profile.phone || '',
        })
        setTotals(response.data.totals || { addresses: 0, wishlist: 0, inbox: 0, orders: 0 })
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load account')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAccount()
    return () => {
      cancelled = true
    }
  }, [])

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)

    try {
      const response = await accountRequest('/account/profile', {
        method: 'PATCH',
        body: form,
      })

      setForm({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
      })
      setMessage('Account information saved.')
    } catch (requestError) {
      setError(requestError.message || 'Failed to save account')
    } finally {
      setSaving(false)
    }
  }

  const updatePasswordField = (field) => (event) => {
    setPasswordForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError('Please enter your current password and a new password.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    setPasswordSaving(true)
    try {
      await accountRequest('/auth/password', {
        method: 'PATCH',
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordMessage('Password updated successfully.')
    } catch (requestError) {
      setPasswordError(requestError.message || 'Failed to update password')
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <AccountPageShell pathname={pathname} onNavigate={onNavigate} title="MY ACCOUNT" breadcrumb="Home  /  My Account">
      <div className="account-dashboard">
        <div className="account-dashboard__summary">
          <div>
            <p className="account-subtitle">TOTALS</p>
            <strong>{loading ? 'Loading...' : `${totals.addresses} addresses`}</strong>
          </div>
          <div>
            <strong>{totals.wishlist} wishlist items</strong>
          </div>
          <div>
            <strong>{totals.orders} orders</strong>
          </div>
        </div>

        <form className={`account-accordion__item ${activeSection === 'account-info' ? 'is-open' : ''}`} onSubmit={handleSubmit}>
          <button
            type="button"
            className="account-accordion__heading"
            aria-expanded={activeSection === 'account-info'}
            onClick={() => setActiveSection(activeSection === 'account-info' ? '' : 'account-info')}
          >
            <span className="account-accordion__index">1</span>
            <h3>EDIT YOUR ACCOUNT INFORMATION</h3>
            <span className="account-accordion__caret">{activeSection === 'account-info' ? '^' : 'v'}</span>
          </button>
          <div className="account-accordion__body">
            <p className="account-subtitle">MY ACCOUNT INFORMATION</p>
            <p className="account-subtitle account-subtitle--secondary">Your Personal Details</p>
            <div className="account-divider" />
            <div className="account-form-grid">
              <label>
                First Name
                <input value={form.firstName} onChange={updateField('firstName')} type="text" />
              </label>
              <label>
                Last Name
                <input value={form.lastName} onChange={updateField('lastName')} type="text" />
              </label>
              <label className="account-form-grid__wide">
                Email Address
                <input value={form.email} onChange={updateField('email')} type="email" />
              </label>
              <label>
                Telephone
                <input value={form.phone} onChange={updateField('phone')} type="text" />
              </label>
              <label>
                Fax
                <input type="text" placeholder="Optional" disabled />
              </label>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-green-700">{message}</p> : null}
            <div className="account-actions">
              <button type="button" className="account-back-link" onClick={() => setActiveSection('account-info')}>
                BACK
              </button>
              <button type="submit" className="account-primary-button" disabled={saving}>
                {saving ? 'SAVING' : 'CONTINUE'}
              </button>
            </div>
          </div>
        </form>

        <div className={`account-accordion__item ${activeSection === 'password' ? 'is-open' : ''}`}>
          <button
            type="button"
            className="account-accordion__heading"
            aria-expanded={activeSection === 'password'}
            onClick={() => setActiveSection(activeSection === 'password' ? '' : 'password')}
          >
            <span className="account-accordion__index">2</span>
            <h3>CHANGE YOUR PASSWORD</h3>
            <span className="account-accordion__caret">{activeSection === 'password' ? '^' : 'v'}</span>
          </button>
          <div className="account-accordion__body">
            <p className="account-subtitle">PASSWORD SETTINGS</p>
            <p className="account-subtitle account-subtitle--secondary">Use your current password to set a new one.</p>
            <div className="account-divider" />
            <form className="account-form-grid" onSubmit={handlePasswordSubmit}>
              <label className="account-form-grid__wide">
                Current Password
                <input value={passwordForm.currentPassword} onChange={updatePasswordField('currentPassword')} type="password" autoComplete="current-password" />
              </label>
              <label>
                New Password
                <input value={passwordForm.newPassword} onChange={updatePasswordField('newPassword')} type="password" autoComplete="new-password" />
              </label>
              <label>
                Confirm New Password
                <input value={passwordForm.confirmPassword} onChange={updatePasswordField('confirmPassword')} type="password" autoComplete="new-password" />
              </label>

              {passwordError ? <p className="text-sm text-red-600 account-form-grid__wide">{passwordError}</p> : null}
              {passwordMessage ? <p className="text-sm text-green-700 account-form-grid__wide">{passwordMessage}</p> : null}

              <div className="account-actions account-form-grid__wide">
                <button
                  type="button"
                  className="account-back-link"
                  onClick={() => {
                    clearUserAuth()
                    onNavigate?.('/login')
                  }}
                >
                  Logout
                </button>
                <button type="submit" className="account-primary-button" disabled={passwordSaving}>
                  {passwordSaving ? 'SAVING' : 'UPDATE PASSWORD'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className={`account-accordion__item ${activeSection === 'address-book' ? 'is-open' : ''}`}>
          <button
            type="button"
            className="account-accordion__heading"
            aria-expanded={activeSection === 'address-book'}
            onClick={() => setActiveSection(activeSection === 'address-book' ? '' : 'address-book')}
          >
            <span className="account-accordion__index">3</span>
            <h3>MODIFY YOUR ADDRESS BOOK ENTRIES</h3>
            <span className="account-accordion__caret">{activeSection === 'address-book' ? '^' : 'v'}</span>
          </button>
          <div className="account-accordion__body">
            <p className="account-subtitle">ADDRESS BOOK</p>
            <p className="account-subtitle account-subtitle--secondary">View, edit, and add delivery addresses.</p>
            <div className="account-actions">
              <button type="button" className="account-back-link" onClick={() => onNavigate?.('/account/address-book')}>
                Open Address Book
              </button>
            </div>
          </div>
        </div>

        <div className={`account-accordion__item ${activeSection === 'wishlist' ? 'is-open' : ''}`}>
          <button
            type="button"
            className="account-accordion__heading"
            aria-expanded={activeSection === 'wishlist'}
            onClick={() => setActiveSection(activeSection === 'wishlist' ? '' : 'wishlist')}
          >
            <span className="account-accordion__index">4</span>
            <h3>MODIFY YOUR WISH LIST</h3>
            <span className="account-accordion__caret">{activeSection === 'wishlist' ? '^' : 'v'}</span>
          </button>
          <div className="account-accordion__body">
            <p className="account-subtitle">WISHLIST</p>
            <p className="account-subtitle account-subtitle--secondary">Manage saved items or move them to cart.</p>
            <div className="account-actions">
              <button type="button" className="account-back-link" onClick={() => onNavigate?.('/account/wishlist')}>
                Open Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </AccountPageShell>
  )
}
