import { useEffect, useState } from 'react'
import { AccountPageShell } from './account/shared.jsx'
import { accountRequest } from '../lib/accountApi.js'

const STATUS_BADGES = {
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Processing: 'bg-amber-50 text-amber-700 border-amber-200',
  Shipped: 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
}

const STATUS_STEPS = ['Paid', 'Processing', 'Shipped', 'Delivered']

export function AccountOrdersPage({ pathname, onNavigate }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedOrders, setExpandedOrders] = useState({})

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

  const toggleExpand = (id) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getStepIndex = (status) => {
    const idx = STATUS_STEPS.indexOf(status)
    return idx >= 0 ? idx : 0
  }

  return (
    <AccountPageShell
      pathname={pathname}
      onNavigate={onNavigate}
      title="ORDER HISTORY"
      breadcrumb="Home  /  Order History"
    >
      <div className="account-page-toolbar mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order History</h2>
          <p className="text-xs text-gray-500">
            Track your herbal medicine purchases, inspect items, and monitor live delivery status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.('/product')}
          className="inline-flex items-center gap-1.5 self-start rounded-md bg-[#63ac18] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#529113]"
        >
          <span>Browse Store</span>
          <span>→</span>
        </button>
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Loading your order history...
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {!loading && !error && orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-gray-900">No Orders Placed Yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
            When you purchase Greenrut herbal remedies and supplements, your order details and delivery status will appear here.
          </p>
          <button
            type="button"
            onClick={() => onNavigate?.('/product')}
            className="mt-4 rounded-md bg-[#63ac18] px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#529113]"
          >
            Explore Herbal Products
          </button>
        </div>
      ) : null}

      {!loading && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order._id || order.id || order.orderNumber
            const isExpanded = Boolean(expandedOrders[orderId])
            const status = order.status || 'Paid'
            const badgeClass =
              STATUS_BADGES[status] || 'bg-gray-100 text-gray-700 border-gray-200'
            const currentStepIdx = getStepIndex(status)
            const isCancelled = status === 'Cancelled'

            const itemsList =
              order.items && order.items.length > 0
                ? order.items
                : [
                    {
                      name: order.product || 'Herbal Product Order',
                      quantity: 1,
                      price: order.total || 0,
                    },
                  ]

            return (
              <div
                key={orderId}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:border-gray-300"
              >
                {/* Order Summary Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-100 bg-gray-50/50 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-gray-900">
                        Order #{order.orderNumber || order.id}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeClass}`}
                      >
                        {status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Placed on{' '}
                      {order.date || order.createdAt
                        ? new Date(order.date || order.createdAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )
                        : 'Recently'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        Total Amount
                      </span>
                      <div className="text-sm font-bold text-[#63ac18]">
                        NGN {Number(order.total || 0).toLocaleString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(orderId)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50"
                    >
                      {isExpanded ? 'Hide Details ▲' : 'View Details ▼'}
                    </button>
                  </div>
                </div>

                {/* Progress Tracker (unless Cancelled) */}
                {!isCancelled ? (
                  <div className="border-b border-gray-100 bg-white px-5 py-3">
                    <div className="flex items-center justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx
                        const isCurrent = idx === currentStepIdx
                        return (
                          <div
                            key={step}
                            className="flex flex-1 items-center last:flex-none"
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isDone
                                    ? 'bg-[#63ac18] text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span
                                className={`mt-1 text-[10px] font-medium ${
                                  isCurrent
                                    ? 'font-bold text-[#63ac18]'
                                    : isDone
                                    ? 'text-gray-700'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step}
                              </span>
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div
                                className={`h-0.5 flex-1 mx-2 -mt-4 transition ${
                                  idx < currentStepIdx
                                    ? 'bg-[#63ac18]'
                                    : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50/50 px-5 py-2 text-xs text-rose-700">
                    This order was cancelled. If you have questions, please reach out to customer support.
                  </div>
                )}

                {/* Quick Products Overview */}
                <div className="px-5 py-3 text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">Items: </span>
                  <span>{order.product || itemsList.map((i) => i.name).join(', ')}</span>
                </div>

                {/* Expandable Order Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/60 p-5 space-y-4 text-xs text-gray-700">
                    {/* Items Table */}
                    <div>
                      <h4 className="mb-2 font-bold text-gray-900">Items Breakdown</h4>
                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-gray-200 bg-gray-50 text-[10px] font-semibold uppercase text-gray-500">
                            <tr>
                              <th className="px-4 py-2">Botanical Product</th>
                              <th className="px-4 py-2 text-center">Qty</th>
                              <th className="px-4 py-2 text-right">Unit Price</th>
                              <th className="px-4 py-2 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {itemsList.map((item, idx) => (
                              <tr key={item._id || idx}>
                                <td className="px-4 py-2.5 font-medium text-gray-800">
                                  {item.name}
                                </td>
                                <td className="px-4 py-2.5 text-center text-gray-600">
                                  {item.quantity || 1}
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-600">
                                  NGN {Number(item.price || 0).toLocaleString()}
                                </td>
                                <td className="px-4 py-2.5 text-right font-semibold text-gray-900">
                                  NGN{' '}
                                  {(
                                    Number(item.price || 0) * (item.quantity || 1)
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="grid grid-cols-1 gap-2 rounded-lg border border-gray-200 bg-white p-3 sm:grid-cols-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">
                          Payment Gateway
                        </span>
                        <p className="font-semibold text-gray-800">
                          {order.paymentGateway || 'Paystack'} (Verified)
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400">
                          Payment Reference
                        </span>
                        <p className="font-mono text-gray-800">
                          {order.paymentReference || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : null}
    </AccountPageShell>
  )
}
