import { useEffect, useState } from 'react'
import { HeroBanner, ProductArt } from '../components/SiteChrome.jsx'
import { publicRequest } from '../lib/publicApi.js'

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

function getProductImage(product) {
  const firstImage = Array.isArray(product.images) ? product.images[0] : product.image || product.thumbnail
  return getImageUrl(firstImage)
}

function buildWhatsAppUrl(product) {
  const number = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const text = encodeURIComponent(`Hi, I'm interested in ${product.name}.`)
  return number ? `https://wa.me/${number}?text=${text}` : '/contact'
}

function ProductCard({ product, index, onView, onOrder }) {
  const imageUrl = getProductImage(product)
  const description = product.description || product.excerpt || 'A clean herbal product listing ready for your content.'

  return (
    <article className="catalog-card">
      <div className="catalog-card__image">
        {imageUrl ? <img src={imageUrl} alt={product.name} loading="lazy" /> : <ProductArt tone={['leaf', 'powder', 'bundle', 'mix'][index % 4]} />}
      </div>
      <div className="catalog-card__body">
        <h3>{product.name}</h3>
        <p>{description}</p>
        <div className="catalog-card__actions">
          <button type="button" className="catalog-card__primary" onClick={onView}>
            View Product
          </button>
          <button type="button" className="catalog-card__secondary" onClick={onOrder}>
            Order WhatsApp
          </button>
        </div>
      </div>
    </article>
  )
}

export function ProductPage({ onNavigate }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        const response = await publicRequest('/products')
        if (!cancelled) {
          setProducts(response.data || [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load products')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <HeroBanner title="PRODUCTS" breadcrumb="Home  /  Product" />
      <section className="page-shell catalog-page">
        <div className="catalog-page__header">
          <h2>Products</h2>
          <p>Browse the product list and open any item for details or ordering.</p>
        </div>

        {loading ? <p>Loading products...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error && products.length === 0 ? <p>No products yet.</p> : null}

        <div className="catalog-grid !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !gap-[18px]">
          {products.map((product, index) => (
            <ProductCard
              key={product.id || product.name}
              product={product}
              index={index}
              onView={() => onNavigate?.(`/product-details?id=${product.id}`)}
              onOrder={() => {
                const url = buildWhatsAppUrl(product)
                if (url.startsWith('/')) {
                  onNavigate?.(url)
                  return
                }
                window.open(url, '_blank', 'noopener,noreferrer')
              }}
            />
          ))}
        </div>
      </section>
    </>
  )
}
