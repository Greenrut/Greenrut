import { useEffect, useState } from 'react'
import { AccountPageShell } from './account/shared.jsx'
import { accountRequest } from '../lib/accountApi.js'

function buildAddressText(address) {
  return [address.line1, address.line2].filter(Boolean).join('\n')
}

export function AccountAddressBookPage({ pathname, onNavigate }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAddresses = async () => {
    try {
      setLoading(true)
      const response = await accountRequest('/account/addresses')
      setAddresses(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [])

  const handleDelete = async (id) => {
    await accountRequest(`/account/addresses/${id}`, { method: 'DELETE' })
    await loadAddresses()
  }

  const handleSetDefault = async (address) => {
    await accountRequest(`/account/addresses/${address._id || address.id}`, {
      method: 'PUT',
      body: {
        ...address,
        default: true,
      },
    })
    await loadAddresses()
  }

  return (
    <AccountPageShell pathname={pathname} onNavigate={onNavigate} title="ADDRESS BOOK" breadcrumb="Home  /  Address Book">
      <div className="account-page-toolbar">
        <h2>Addresses ({addresses.length})</h2>
        <button type="button" className="account-primary-button" onClick={() => onNavigate?.('/account/address-book/edit')}>
          Add new address
        </button>
      </div>
      {loading ? <p>Loading addresses...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="account-address-grid">
        {addresses.map((item) => (
          <article key={item._id || item.id || item.phone} className={`account-address-card account-address-card--${item.default ? 'active' : 'normal'}`}>
            <h3>{item.name}</h3>
            <p>{buildAddressText(item)}</p>
            <p>{item.phone}</p>
            <div className="account-address-card__footer">
              <span>{item.default ? 'Default Address' : 'Set as default'}</span>
              <div className="account-address-card__actions">
                <button
                  type="button"
                  aria-label="Edit address"
                  onClick={() => onNavigate?.(`/account/address-book/edit?id=${item._id || item.id}`)}
                >
                  Edit
                </button>
                <button type="button" aria-label="Delete address" onClick={() => handleDelete(item._id || item.id)}>
                  Delete
                </button>
                {!item.default ? (
                  <button type="button" aria-label="Set default address" onClick={() => handleSetDefault(item)}>
                    Default
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </AccountPageShell>
  )
}
