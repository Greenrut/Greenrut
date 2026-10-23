import createHttpError from 'http-errors'
import { Order } from '../models/Order.js'
import { Account } from '../models/Account.js'
import { User } from '../models/User.js'

// Helper to ensure historical orders in Account.orders are synced into Order collection
async function syncHistoricalOrders() {
  try {
    const accounts = await Account.find({ 'orders.0': { $exists: true } }).lean()
    for (const acc of accounts) {
      for (const ord of acc.orders || []) {
        if (!ord.paymentReference && !ord._id) continue
        const exists = await Order.findOne({
          $or: [
            ord.paymentReference ? { paymentReference: ord.paymentReference } : null,
            ord._id ? { _id: ord._id } : null,
          ].filter(Boolean),
        })

        if (!exists) {
          const user = acc.userId ? await User.findById(acc.userId).lean() : null
          const fullName = [acc.profile?.firstName, acc.profile?.lastName].filter(Boolean).join(' ') || user?.name || ''
          const defaultAddr = (acc.addresses || []).find((a) => a.default) || (acc.addresses || [])[0] || null

          await Order.create({
            _id: ord._id || undefined,
            orderNumber: ord.orderNumber || Math.floor(1000 + Math.random() * 9000),
            userId: acc.userId || null,
            accountId: acc._id,
            customerName: fullName,
            customerEmail: ord.customerEmail || acc.profile?.email || user?.email || 'customer@greenrut.com',
            customerPhone: acc.profile?.phone || defaultAddr?.phone || '',
            shippingAddress: defaultAddr
              ? {
                  name: defaultAddr.name || fullName,
                  line1: defaultAddr.line1 || '',
                  line2: defaultAddr.line2 || '',
                  city: defaultAddr.city || '',
                  phone: defaultAddr.phone || '',
                }
              : undefined,
            items: ord.items && ord.items.length ? ord.items : [{ name: ord.product || 'Order Item', quantity: 1, price: ord.total || 0 }],
            productSummary: ord.product || (ord.items || []).map((i) => i.name).join(', '),
            total: ord.total || 0,
            currency: ord.currency || 'NGN',
            paymentReference: ord.paymentReference || '',
            paymentGateway: ord.paymentGateway || 'Paystack',
            status: ord.status || 'Paid',
            paidAt: ord.paidAt || ord.date || new Date(),
            createdAt: ord.date || new Date(),
          })
        }
      }
    }
  } catch (err) {
    console.error('Order sync warning:', err.message)
  }
}

// GET /admin/orders
export async function listAdminOrders(req, res, next) {
  try {
    // Run background sync for any unmigrated historical orders
    await syncHistoricalOrders()

    const { status, search } = req.query
    const query = {}

    if (status && status !== 'all') {
      query.status = status
    }

    if (search && search.trim()) {
      const s = search.trim()
      const sRegex = new RegExp(s, 'i')
      const num = Number(s)
      query.$or = [
        { customerEmail: sRegex },
        { customerName: sRegex },
        { paymentReference: sRegex },
        { productSummary: sRegex },
        ...(Number.isFinite(num) ? [{ orderNumber: num }] : []),
      ]
    }

    const [orders, allOrders] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }),
      Order.find({}).select('status total'),
    ])

    const stats = {
      total: allOrders.length,
      paid: allOrders.filter((o) => o.status === 'Paid').length,
      processing: allOrders.filter((o) => o.status === 'Processing').length,
      shipped: allOrders.filter((o) => o.status === 'Shipped').length,
      delivered: allOrders.filter((o) => o.status === 'Delivered').length,
      cancelled: allOrders.filter((o) => o.status === 'Cancelled').length,
      totalRevenue: allOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? Number(o.total || 0) : 0), 0),
    }

    res.json({
      ok: true,
      data: orders,
      stats,
    })
  } catch (error) {
    next(error)
  }
}

// GET /admin/orders/:id
export async function getAdminOrder(req, res, next) {
  try {
    const { id } = req.params
    const order = await Order.findById(id)
    if (!order) {
      throw createHttpError(404, 'Order not found')
    }

    let customerAccount = null
    if (order.accountId) {
      customerAccount = await Account.findById(order.accountId).select('profile addresses')
    }

    res.json({
      ok: true,
      data: {
        ...order.toObject(),
        accountInfo: customerAccount,
      },
    })
  } catch (error) {
    next(error)
  }
}

// PUT /admin/orders/:id/status
export async function updateAdminOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    const validStatuses = ['Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    if (!status || !validStatuses.includes(status)) {
      throw createHttpError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`)
    }

    const order = await Order.findById(id)
    if (!order) {
      throw createHttpError(404, 'Order not found')
    }

    const oldStatus = order.status
    order.status = status
    if (notes !== undefined) {
      order.notes = notes
    }
    await order.save()

    // Sync status change to customer's account so client sees it live
    let account = null
    if (order.accountId) {
      account = await Account.findById(order.accountId)
    } else if (order.userId) {
      account = await Account.findOne({ userId: order.userId })
    } else if (order.customerEmail) {
      const user = await User.findOne({ email: order.customerEmail })
      if (user) account = await Account.findOne({ userId: user._id })
    }

    if (account) {
      let orderUpdated = false
      if (Array.isArray(account.orders)) {
        for (const o of account.orders) {
          if (
            (order.paymentReference && o.paymentReference === order.paymentReference) ||
            String(o._id) === String(order._id) ||
            o.orderNumber === order.orderNumber
          ) {
            o.status = status
            orderUpdated = true
            break
          }
        }
      }

      // Add inbox notification to the customer's account
      account.inbox = account.inbox || []
      account.inbox.unshift({
        subject: `Order #${order.orderNumber} Status Updated: ${status}`,
        message: `Your order #${order.orderNumber} for "${order.productSummary || 'Greenrut Products'}" is now marked as ${status}.${notes ? ` Note from team: ${notes}` : ''}`,
        createdAt: new Date(),
      })

      await account.save()
    }

    res.json({
      ok: true,
      data: order,
      message: `Order #${order.orderNumber} status successfully updated from ${oldStatus} to ${status}.`,
    })
  } catch (error) {
    next(error)
  }
}
