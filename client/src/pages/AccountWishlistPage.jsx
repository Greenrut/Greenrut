import { useEffect, useState } from 'react'
import { AccountPageShell } from './account/shared.jsx'
import { accountRequest } from '../lib/accountApi.js'

export function AccountWishlistPage({ pathname }) {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWishlist = async () => {
    try {
      setLoading(true)
      const response = await accountRequest('/account/wishlist')
      setWishlistItems(response.data || [])
    } catch (requestError) {
      setError(requestError.message || 'Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [])

  const handleRemove = async (id) => {
    await accountRequest(`/account/wishlist/${id}`, { method: 'DELETE' })
    await loadWishlist()
  }

  return (
    <AccountPageShell pathname={pathname} title="WISHLIST" breadcrumb="Home  /  Wishlist">
      <div className="account-page-toolbar">
        <h2>Wishlist ({wishlistItems.length})</h2>
      </div>
      {loading ? <p>Loading wishlist...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="account-wishlist">
        {wishlistItems.map((item) => (
          <article key={item.id || item.name} className="account-wishlist__item">
            <div className="account-wishlist__thumb" />
            <div className="account-wishlist__copy">
              <h3>{item.name}</h3>
              <div className="account-price-row">
                <strong>NGN {item.price?.toLocaleString?.() ?? item.price}</strong>
                {item.oldPrice ? <span className="account-price-row__old">NGN {item.oldPrice?.toLocaleString?.() ?? item.oldPrice}</span> : null}
                {item.oldPrice ? (
                  <span className="account-price-row__badge">
                    -{Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}%
                  </span>
                ) : null}
              </div>
            </div>
            <div className="account-wishlist__actions">
              <button type="button" className="account-wishlist__remove" onClick={() => handleRemove(item.id)}>
                Remove
              </button>
              <button type="button" className={item.stock === 'in_stock' ? 'account-primary-button' : 'account-secondary-button'}>
                {item.stock === 'in_stock' ? 'Add to Cart' : 'Out of stock'}
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="account-pagination">
        <button type="button">|&lt;</button>
        <button type="button">&lt;</button>
        <button type="button" className="is-active">
          1
        </button>
        <button type="button">2</button>
        <button type="button">3</button>
        <button type="button">&gt;</button>
        <button type="button">&gt;|</button>
      </div>
    </AccountPageShell>
  )
}
