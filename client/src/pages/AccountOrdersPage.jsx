import { useEffect, useState } from 'react'
import { AccountPageShell } from './account/shared.jsx'
import { accountRequest } from '../lib/accountApi.js'

export function AccountOrdersPage({ pathname, onNavigate }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadOrders() {
      try {
        setLoading(true)
        const response = await accountRequest('/account/orders')
        if (!cancelled) {
          setOrders(response.data || [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load orders')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOrders()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AccountPageShell pathname={pathname} onNavigate={onNavigate} title="ORDER HISTORY" breadcrumb="Home  /  Orders">
      <div className="account-page-toolbar">
        <h2>Orders</h2>
      </div>
      {loading ? <p>Loading orders...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="account-orders">
        <div className="account-orders__head">
          <span>Order #</span>
          <span>Product</span>
          <span>Date</span>
          <span>Status</span>
          <span>Total</span>
        </div>
        {orders.map((order) => (
          <div key={order._id || order.id} className="account-orders__row">
            <span>{order.orderNumber || order.id}</span>
            <span>{order.product}</span>
            <span>{order.date ? new Date(order.date).toLocaleDateString() : ''}</span>
            <span>{order.status}</span>
            <strong>NGN {order.total?.toLocaleString?.() ?? order.total}</strong>
          </div>
        ))}
      </div>
    </AccountPageShell>
  )
}
