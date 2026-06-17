import { useEffect, useMemo, useState } from 'react'
import { AccountPageShell } from './account/shared.jsx'
import { accountRequest } from '../lib/accountApi.js'

function getAddressId() {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

const emptyForm = {
  name: '',
  line1: '',
  line2: '',
  city: '',
  phone: '',
  default: false,
}

export function AccountAddressEditPage({ pathname, onNavigate }) {
  const addressId = useMemo(() => getAddressId(), [])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(Boolean(addressId))
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAddress() {
      if (!addressId) {
        setLoading(false)
        return
      }

      try {
        const response = await accountRequest(`/account/addresses/${addressId}`)
        if (cancelled) return
        setForm({
          name: response.data.name || '',
          line1: response.data.line1 || '',
          line2: response.data.line2 || '',
          city: response.data.city || '',
          phone: response.data.phone || '',
          default: Boolean(response.data.default),
        })
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load address')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAddress()
    return () => {
      cancelled = true
    }
  }, [addressId])

  const updateField = (field) => (event) => {
    const value = field === 'default' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const endpoint = addressId ? `/account/addresses/${addressId}` : '/account/addresses'
      await accountRequest(endpoint, {
        method: addressId ? 'PUT' : 'POST',
        body: form,
      })
      setMessage('Address saved.')
      onNavigate?.('/account/address-book')
    } catch (requestError) {
      setError(requestError.message || 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AccountPageShell pathname={pathname} onNavigate={onNavigate} title="ADDRESS BOOK" breadcrumb="Home  /  Edit Address">
      <div className="account-page-toolbar account-page-toolbar--edit">
        <button type="button" className="account-page-toolbar__back" onClick={() => onNavigate?.('/account/address-book')}>
          &larr;
        </button>
        <h2>{addressId ? 'Edit Address' : 'Add Address'}</h2>
      </div>

      {loading ? <p>Loading address...</p> : null}
      <form className="account-edit-address" onSubmit={handleSubmit}>
        <div className="account-edit-address__grid">
          <label>
            Name
            <input type="text" value={form.name} onChange={updateField('name')} />
          </label>
          <label>
            City
            <input type="text" value={form.city} onChange={updateField('city')} />
          </label>
          <label>
            Telephone
            <input type="text" value={form.phone} onChange={updateField('phone')} />
          </label>
          <label className="account-edit-address__wide">
            Address 1
            <input type="text" value={form.line1} onChange={updateField('line1')} />
          </label>
          <label className="account-edit-address__wide">
            Address 2
            <input type="text" value={form.line2} onChange={updateField('line2')} />
          </label>
          <label className="account-edit-address__wide">
            <input type="checkbox" checked={form.default} onChange={updateField('default')} />
            Set as default address
          </label>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-green-700">{message}</p> : null}
        <div className="account-edit-address__actions">
          <button type="button" className="account-back-link" onClick={() => onNavigate?.('/account/address-book')}>
            Back
          </button>
          <button type="submit" className="account-primary-button" disabled={saving}>
            {saving ? 'Saving' : 'Save'}
          </button>
        </div>
      </form>
    </AccountPageShell>
  )
}
