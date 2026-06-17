import { Account } from '../models/Account.js'
import { User } from '../models/User.js'
import { createHttpError } from '../utils/httpError.js'

function splitName(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  }
}

function buildDefaultAccount(user) {
  const { firstName, lastName } = splitName(user.name)

  return {
    userId: user._id,
    profile: {
      firstName,
      lastName,
      email: user.email || '',
      phone: '',
    },
    addresses: [],
    wishlist: [],
    inbox: [],
    orders: [],
  }
}

async function getOrCreateAccount(userId) {
  const account = await Account.findOne({ userId })
  if (account) {
    return account
  }

  const user = await User.findById(userId)
  if (!user) {
    throw createHttpError(404, 'Account not found')
  }

  return Account.create(buildDefaultAccount(user))
}

function toAddressPayload(body = {}) {
  return {
    name: String(body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim()).trim(),
    line1: String(body.line1 || body.address1 || '').trim(),
    line2: String(body.line2 || body.address2 || '').trim(),
    city: String(body.city || '').trim(),
    phone: String(body.phone || body.telephone || '').trim(),
    default: Boolean(body.default),
  }
}

function serializeAccount(account) {
  return {
    id: account._id,
    profile: account.profile,
    addresses: account.addresses,
    wishlist: account.wishlist,
    inbox: account.inbox,
    orders: account.orders,
  }
}

function getUserId(req) {
  return req.auth?.sub
}

export async function getAccountOverview(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    res.json({
      ok: true,
      data: {
        profile: account.profile,
        totals: {
          addresses: account.addresses.length,
          wishlist: account.wishlist.length,
          inbox: account.inbox.length,
          orders: account.orders.length,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export async function getAccountProfile(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    res.json({ ok: true, data: account.profile })
  } catch (error) {
    next(error)
  }
}

export async function updateAccountProfile(req, res, next) {
  try {
    const userId = getUserId(req)
    const account = await getOrCreateAccount(userId)
    const user = await User.findById(userId)

    if (!user) {
      return next(createHttpError(404, 'Account not found'))
    }

    const profile = {
      firstName: String(req.body?.firstName ?? account.profile.firstName ?? '').trim(),
      lastName: String(req.body?.lastName ?? account.profile.lastName ?? '').trim(),
      email: String(req.body?.email ?? account.profile.email ?? '').trim(),
      phone: String(req.body?.phone ?? account.profile.phone ?? '').trim(),
    }

    account.profile = profile
    user.name = `${profile.firstName} ${profile.lastName}`.trim()
    user.email = profile.email || user.email

    await Promise.all([account.save(), user.save()])

    res.json({ ok: true, data: profile })
  } catch (error) {
    next(error)
  }
}

export async function listAddresses(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    res.json({ ok: true, data: account.addresses })
  } catch (error) {
    next(error)
  }
}

export async function createAddress(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    const address = {
      ...toAddressPayload(req.body || {}),
      _id: undefined,
    }

    if (!address.name || !address.line1) {
      return next(createHttpError(400, 'Name and address line 1 are required'))
    }

    if (address.default) {
      account.addresses.forEach((item) => {
        item.default = false
      })
    }

    account.addresses.push(address)
    await account.save()

    const created = account.addresses[account.addresses.length - 1]
    res.status(201).json({ ok: true, data: created })
  } catch (error) {
    next(error)
  }
}

export async function getAddressById(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    const address = account.addresses.id(req.params.id)
    if (!address) return next(createHttpError(404, 'Address not found'))

    res.json({ ok: true, data: address })
  } catch (error) {
    next(error)
  }
}

export async function updateAddress(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    const address = account.addresses.id(req.params.id)
    if (!address) return next(createHttpError(404, 'Address not found'))

    const payload = toAddressPayload(req.body || {})
    Object.assign(address, payload)

    if (payload.default) {
      account.addresses.forEach((item) => {
        item.default = item._id.toString() === address._id.toString()
      })
    }

    await account.save()
    res.json({ ok: true, data: address })
  } catch (error) {
    next(error)
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    const address = account.addresses.id(req.params.id)
    if (!address) return next(createHttpError(404, 'Address not found'))

    address.deleteOne()
    await account.save()
    res.json({ ok: true, data: address })
  } catch (error) {
    next(error)
  }
}

export async function listWishlist(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    res.json({ ok: true, data: account.wishlist })
  } catch (error) {
    next(error)
  }
}

export async function deleteWishlistItem(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    const id = Number(req.params.id)
    const index = account.wishlist.findIndex((item, itemIndex) => Number(item.id ?? itemIndex + 1) === id)
    if (index === -1) return next(createHttpError(404, 'Wishlist item not found'))

    const [removed] = account.wishlist.splice(index, 1)
    await account.save()
    res.json({ ok: true, data: removed })
  } catch (error) {
    next(error)
  }
}

export async function listInbox(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    res.json({ ok: true, data: account.inbox })
  } catch (error) {
    next(error)
  }
}

export async function listOrders(req, res, next) {
  try {
    const account = await getOrCreateAccount(getUserId(req))
    res.json({ ok: true, data: account.orders })
  } catch (error) {
    next(error)
  }
}

export async function seedAccountForUser(userId) {
  return getOrCreateAccount(userId)
}
