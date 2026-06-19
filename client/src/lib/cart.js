const CART_KEY = 'greenrut:cart'

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent('cart-changed', { detail: { items } }))
}

export function getCart() {
  return readCart()
}

export function getCartCount() {
  return readCart().reduce((sum, item) => sum + (item.qty || 1), 0)
}

export function getCartTotal() {
  return readCart().reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0)
}

export function addToCart(product, qty = 1) {
  const items = readCart()
  const id = String(product.id || product._id || product.name)
  const existing = items.find((item) => item.id === id)

  if (existing) {
    existing.qty = (existing.qty || 1) + qty
  } else {
    items.push({
      id,
      name: product.name,
      price: Number(product.price || 0),
      image: getImageUrl(product),
      qty,
    })
  }

  writeCart(items)
}

export function removeFromCart(id) {
  writeCart(readCart().filter((item) => item.id !== String(id)))
}

export function updateCartQty(id, qty) {
  const items = readCart()
  const item = items.find((i) => i.id === String(id))
  if (item) {
    item.qty = Math.max(1, Number(qty) || 1)
    writeCart(items)
  }
}

export function clearCart() {
  writeCart([])
}

function getImageUrl(product) {
  const images = Array.isArray(product?.images) ? product.images : []
  const first = images[0]
  if (!first) return ''
  if (typeof first === 'string') return first
  if (typeof first === 'object') return first.url || first.src || first.secureUrl || ''
  return ''
}
