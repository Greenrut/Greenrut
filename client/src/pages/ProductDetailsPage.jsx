import { useEffect, useState } from 'react'
import { HeroBanner, ProductArt, ProductCard } from '../components/SiteChrome.jsx'
import { publicRequest } from '../lib/publicApi.js'
import { SectionTitle } from './shared.jsx'

function getProductId() {
  const params = new URLSearchParams(window.location.search)
  return params.get('id')
}

function mapRelatedProduct(product, index = 0) {
  return {
    name: product.name,
    price: `NGN ${Number(product.price || 0).toLocaleString()}`,
    badge: product.status === 'published' ? '' : 'Draft',
    tone: ['leaf', 'powder', 'bundle', 'tea'][index % 4],
    images: product.images || [],
  }
}

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

export function ProductDetailsPage({ onNavigate }) {
  const productId = getProductId()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [tab, setTab] = useState('Description')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      try {
        setLoading(true)
        const response = await publicRequest('/products')
        const items = response.data || []
        const selectedProduct = items.find((item) => String(item.id) === String(productId)) || items[0] || null
        if (cancelled) return

        setProduct(selectedProduct)
        const images = Array.isArray(selectedProduct?.images) ? selectedProduct.images : []
        setSelectedImage(getImageUrl(images[0]) || '')
        setRelatedProducts(selectedProduct ? items.filter((item) => String(item.id) !== String(selectedProduct.id)).slice(0, 4) : [])
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load product')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProduct()
    return () => {
      cancelled = true
    }
  }, [productId])

  const tabs = ['Description', 'Tags', 'Review']
  const productImages = Array.isArray(product?.images) ? product.images : []
  const mainImageUrl = selectedImage || getImageUrl(productImages[0]) || ''

  return (
    <>
      <HeroBanner title="SINGLE PRODUCT" breadcrumb="Home  /  Single Product" />

      {!loading && !error && !product ? (
        <section className="page-shell">
          <div className="empty-state">
            <h2>No product yet.</h2>
            <p>Add a product in the admin panel to see the detail page here.</p>
          </div>
        </section>
      ) : null}

      {product ? (
        <>
          <section className="page-shell product-detail !grid !grid-cols-1 xl:!grid-cols-[minmax(360px,1fr)_minmax(0,1fr)] !gap-6 xl:!gap-8">
            <div className="product-detail__gallery">
              <div className="product-detail__main">
                {mainImageUrl ? <img src={mainImageUrl} alt={product.name} /> : <ProductArt tone="leaf" />}
                <span className="badge badge--floating">-29%</span>
              </div>
              <div className="product-detail__thumbs !flex !flex-wrap !justify-center !gap-3">
                {productImages.length ? (
                  productImages.map((image, index) => {
                    const imageUrl = getImageUrl(image)
                    return (
                      <button key={imageUrl || index} type="button" onClick={() => setSelectedImage(imageUrl)}>
                        {imageUrl ? <img src={imageUrl} alt={`${product.name} ${index + 1}`} /> : <ProductArt tone={['leaf', 'tea', 'powder', 'bundle'][index % 4]} />}
                      </button>
                    )
                  })
                ) : (
                  <>
                    <button type="button">
                      <ProductArt tone="leaf" />
                    </button>
                    <button type="button">
                      <ProductArt tone="tea" />
                    </button>
                    <button type="button">
                      <ProductArt tone="powder" />
                    </button>
                    <button type="button">
                      <ProductArt tone="bundle" />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="product-detail__content">
              {loading ? <p>Loading product...</p> : null}
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <h2>{product.name}</h2>
              <p className="rating">32 Reviews | Add Your Reviews</p>
              <strong className="price">NGN {Number(product.price || 0).toLocaleString()}</strong>
              <p className="available">
                Available: <span>{Number(product.stock || 0) > 0 ? 'In stock' : 'Out of stock'}</span>
              </p>
              <p className="summary">{product.description || ''}</p>
              <ul className="feature-list">
                <li>Protection Plan</li>
                <li>Remote Holder</li>
                <li>Amazon Basics HD Antenna</li>
              </ul>
              <div className="purchase-row !flex !flex-wrap !gap-3">
                <label>
                  Qty:
                  <input type="text" defaultValue="02" />
                </label>
                <button type="button" className="icon-button icon-button--filled" aria-label="Add to cart">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6h15l-2 8H8L6 6Z" fill="none" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="9" cy="19" r="1.4" fill="currentColor" />
                    <circle cx="17" cy="19" r="1.4" fill="currentColor" />
                  </svg>
                </button>
                <button type="button" className="icon-button icon-button--filled" aria-label="Wish list">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                </button>
              </div>
              <p className="meta">Categories: {product.category || 'General'}</p>
              <p className="meta">Tags: {product.sku || 'Featured'}</p>
              <div className="share-row">
                {['Tweet', 'Share', 'Google+', 'Pinterest'].map((label) => (
                  <button type="button" key={label} className="share-button">
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="page-shell tabs-block">
            <div className="tabs">
              {tabs.map((name) => (
                <button key={name} type="button" className={tab === name ? 'is-active' : ''} onClick={() => setTab(name)}>
                  {name}
                </button>
              ))}
            </div>
            <div className="tabs-block__content">
              {tab === 'Description' ? (
                <p>{product.description || 'No description added yet.'}</p>
              ) : tab === 'Tags' ? (
                <p>No product tags yet.</p>
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </section>
        </>
      ) : null}

      {relatedProducts.length ? (
        <section className="page-shell related-products">
          <SectionTitle title="Related Products" />
          <div className="product-grid product-grid--related !grid !grid-cols-1 xs:!grid-cols-2 xl:!grid-cols-4 !gap-[18px]">
            {relatedProducts.map((item, index) => (
              <button key={item.id || item.name} type="button" className="text-left" onClick={() => onNavigate?.(`/product-details?id=${item.id}`)}>
                <ProductCard {...mapRelatedProduct(item, index)} />
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
