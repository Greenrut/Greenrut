import { useState, useEffect, useCallback } from 'react'
import { HeroBanner } from '../components/SiteChrome.jsx'
import { SectionTitle } from './shared.jsx'
import { getCart, removeFromCart, updateCartQty, clearCart, getCartTotal } from '../lib/cart.js'
import { getUserAuth } from '../lib/auth.js'
import { accountRequest } from '../lib/accountApi.js'
import bannaImage from '../assets/banna.png'

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''

function formatNGN(amount) {
  return `NGN ${Number(amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function generateReference() {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `GR-${ts}-${rand}`
}

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve()
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// ─── Mock Paystack Modal ────────────────────────────────────────────────────
function MockPaystackModal({ amount, email, onSuccess, onClose }) {
  const [simulating, setSimulating] = useState(false)

  function handleSuccess() {
    setSimulating(true)
    setTimeout(() => {
      onSuccess(`GR-MOCK-${Date.now().toString(36).toUpperCase()}`)
    }, 1200)
  }

  return (
    <div id="paystack-mock-overlay" style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: 420, maxWidth: 'calc(100vw - 32px)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {/* Header */}
        <div style={{ background: '#0a5fff', padding: '20px 24px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, opacity: 0.8, letterSpacing: 1 }}>PAYSTACK</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600 }}>Test / Development Mode</p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 0, color: '#fff', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>✕ Close</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 24px' }}>
          <div style={{ background: '#f4f7ff', borderRadius: 8, padding: 16, marginBottom: 24 }}>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: '#6b7280' }}>Paying</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#111827' }}>{formatNGN(amount)}</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{email}</p>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#92400e' }}>
              ⚠️ <strong>No Paystack API key configured.</strong> This is a simulated payment modal for development purposes. No real transaction will occur.
            </p>
          </div>

          {simulating ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div className="mock-spinner" />
              <p style={{ margin: '12px 0 0', fontSize: 14, color: '#374151' }}>Processing payment…</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              <button
                id="mock-pay-success"
                onClick={handleSuccess}
                style={{
                  background: '#16a34a', color: '#fff', border: 0, borderRadius: 8,
                  padding: '14px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%',
                }}
              >
                ✓ Simulate Successful Payment
              </button>
              <button
                id="mock-pay-cancel"
                onClick={onClose}
                style={{
                  background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8,
                  padding: '14px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%',
                }}
              >
                Cancel / Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Cart Page ──────────────────────────────────────────────────────────────
export function CartPage({ onNavigate }) {
  const [items, setItems] = useState(() => getCart())
  const [checkoutState, setCheckoutState] = useState('idle') // idle | loading | success | error
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [showMock, setShowMock] = useState(false)
  const [mockEmail, setMockEmail] = useState('')
  const [mockAmount, setMockAmount] = useState(0)

  // Sync cart state when items change externally
  useEffect(() => {
    const onCartChanged = () => setItems(getCart())
    window.addEventListener('cart-changed', onCartChanged)
    return () => window.removeEventListener('cart-changed', onCartChanged)
  }, [])

  const total = getCartTotal()
  const subtotalFormatted = formatNGN(total)

  function handleQtyChange(id, delta) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const newQty = (item.qty || 1) + delta
    if (newQty < 1) {
      removeFromCart(id)
    } else {
      updateCartQty(id, newQty)
    }
    setItems(getCart())
  }

  function handleRemove(id) {
    removeFromCart(id)
    setItems(getCart())
  }

  function handleClear() {
    clearCart()
    setItems([])
  }

  // ─── Payment verification ─────────────────────────────────────────────────
  const verifyAndComplete = useCallback(async (reference) => {
    setCheckoutState('loading')
    setShowMock(false)

    try {
      const cartSnapshot = getCart()
      await accountRequest('/payments/paystack/verify', {
        method: 'POST',
        body: {
          reference,
          email: getUserAuth()?.user?.email || '',
          items: cartSnapshot.map((item) => ({
            name: item.name,
            quantity: item.qty,
            price: item.price,
          })),
        },
      })

      clearCart()
      setItems([])
      setCheckoutState('success')
      setCheckoutMessage('🎉 Payment confirmed! Your order has been recorded.')

      // Redirect to orders after 2.5s
      setTimeout(() => {
        if (onNavigate) onNavigate('/account/orders')
      }, 2500)
    } catch (err) {
      setCheckoutState('error')
      setCheckoutMessage(err.message || 'Payment verification failed. Please contact support.')
    }
  }, [onNavigate])

  // ─── Checkout handler ──────────────────────────────────────────────────────
  async function handleCheckout() {
    // Must be logged in
    const auth = getUserAuth()
    if (!auth?.token) {
      if (onNavigate) onNavigate('/login')
      return
    }

    if (items.length === 0) return

    const email = auth.user?.email || ''
    const amountKobo = Math.round(total * 100) // Paystack uses smallest currency unit

    // No public key → use mock modal
    if (!PAYSTACK_PUBLIC_KEY) {
      setMockEmail(email)
      setMockAmount(total)
      setShowMock(true)
      return
    }

    setCheckoutState('loading')
    setCheckoutMessage('')

    try {
      await loadPaystackScript()
    } catch {
      setCheckoutState('error')
      setCheckoutMessage('Could not load Paystack checkout script. Check your internet connection.')
      return
    }

    setCheckoutState('idle')

    const reference = generateReference()

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: amountKobo,
      currency: 'NGN',
      ref: reference,
      label: 'Greenrut Checkout',
      metadata: {
        custom_fields: [
          { display_name: 'Cart Items', variable_name: 'cart_items', value: items.length },
        ],
      },
      callback: (response) => {
        verifyAndComplete(response.reference)
      },
      onClose: () => {
        setCheckoutState('idle')
      },
    })

    handler.openIframe()
  }

  return (
    <>
      <HeroBanner title="CART PAGE" breadcrumb="Home  /  Cart page" backgroundPhoto={bannaImage} />

      {showMock && (
        <MockPaystackModal
          amount={mockAmount}
          email={mockEmail}
          onSuccess={(ref) => verifyAndComplete(ref)}
          onClose={() => setShowMock(false)}
        />
      )}

      <section className="page-shell cart-page">
        <SectionTitle title="Your cart items" />

        {/* Status messages */}
        {checkoutState === 'success' && (
          <div className="checkout-status checkout-status--success">
            <p>{checkoutMessage}</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Redirecting you to your orders…</p>
          </div>
        )}
        {checkoutState === 'error' && (
          <div className="checkout-status checkout-status--error">
            <p>{checkoutMessage}</p>
          </div>
        )}
        {checkoutState === 'loading' && (
          <div className="checkout-status checkout-status--loading">
            <p>Verifying your payment…</p>
          </div>
        )}

        <div className="cart-table">
          <div className="cart-table__head">
            <span>IMAGE</span>
            <span>PRODUCT NAME</span>
            <span>UNIT PRICE</span>
            <span>QTY</span>
            <span>SUBTOTAL</span>
            <span>REMOVE</span>
          </div>

          {items.length ? (
            items.map((item) => (
              <div key={item.id} className="cart-table__row">
                <div className="cart-thumb">
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'contain' }} />
                  ) : (
                    <div className="product-card__empty" style={{ width: 60, height: 60 }} />
                  )}
                </div>
                <span>{item.name}</span>
                <span>{formatNGN(item.price)}</span>
                <span className="cart-qty-control">
                  <button type="button" onClick={() => handleQtyChange(item.id, -1)} aria-label="Decrease quantity">−</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => handleQtyChange(item.id, 1)} aria-label="Increase quantity">+</button>
                </span>
                <span>{formatNGN(item.price * item.qty)}</span>
                <span className="delete-icons">
                  <button type="button" aria-label="Remove" onClick={() => handleRemove(item.id)}>
                    Remove
                  </button>
                </span>
              </div>
            ))
          ) : (
            <div className="cart-table__row cart-table__row--empty">
              <span>Your cart is empty.</span>
            </div>
          )}
        </div>

        <div className="cart-actions !grid !grid-cols-1 lg:!grid-cols-3 !gap-4">
          <button type="button" className="secondary-button" onClick={() => onNavigate && onNavigate('/product')}>
            CONTINUE SHOPPING
          </button>
          <button type="button" className="secondary-button" onClick={() => setItems(getCart())}>
            UPDATE CART
          </button>
          <button type="button" className="secondary-button" onClick={handleClear} disabled={items.length === 0}>
            CLEAR CART
          </button>
        </div>

        <div className="cart-panels !grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 !gap-[18px]">
          <article className="panel">
            <h3>Estimate Shipping And Tax</h3>
            <p>Enter your destination to get a shipping estimate.</p>
            <label>
              Country
              <input type="text" defaultValue="Nigeria" />
            </label>
            <label>
              Region / State
              <input type="text" defaultValue="Lagos" />
            </label>
            <label>
              Zip/Postal Code
              <input type="text" />
            </label>
            <button type="button" className="primary-button">GET A QUOTE</button>
          </article>

          <article className="panel">
            <h3>Use Coupon Code</h3>
            <p>Enter your coupon code if you have one.</p>
            <input type="text" />
            <button type="button" className="primary-button">APPLY COUPON</button>
          </article>

          <article className="panel panel--total">
            <h3>Cart Total</h3>
            <div className="total-line">
              <span>Total products</span>
              <strong>{subtotalFormatted}</strong>
            </div>
            <div className="total-line total-line--spaced">
              <span>Total shipping</span>
              <div>
                <label>
                  <input type="checkbox" /> Standard
                </label>
                <label>
                  <input type="checkbox" /> Express
                </label>
              </div>
            </div>
            <div className="total-line total-line--grand">
              <span>Grand Total</span>
              <strong>{subtotalFormatted}</strong>
            </div>
            <button
              id="proceed-to-checkout"
              type="button"
              className="primary-button"
              disabled={items.length === 0 || checkoutState === 'loading'}
              onClick={handleCheckout}
            >
              {checkoutState === 'loading' ? 'PLEASE WAIT…' : 'PROCEED TO CHECKOUT'}
            </button>
            {!getUserAuth()?.token && items.length > 0 && (
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                You'll need to{' '}
                <button
                  type="button"
                  style={{ color: '#63ac18', background: 'none', border: 0, cursor: 'pointer', fontWeight: 600, padding: 0 }}
                  onClick={() => onNavigate && onNavigate('/login')}
                >
                  log in
                </button>
                {' '}to checkout.
              </p>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
