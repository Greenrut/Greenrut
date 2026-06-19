import { useEffect, useMemo, useState } from 'react'
import { HeroBanner, ProductCard } from '../components/SiteChrome.jsx'
import { publicRequest } from '../lib/publicApi.js'
import { addToCart } from '../lib/cart.js'
import { SectionTitle } from './shared.jsx'
import bannaImage from '../assets/banna.png'

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

function getProductImages(product) {
  const images = Array.isArray(product?.images) ? product.images : []
  return images.map((image) => getImageUrl(image)).filter(Boolean)
}

export function ProductDetailsPage({ onNavigate }) {
  const productId = getProductId()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState('')
  const [tab, setTab] = useState('Description')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedQty, setSelectedQty] = useState(1)
  const [addedMessage, setAddedMessage] = useState('')

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
  const productImages = getProductImages(product)
  const mainImageUrl = selectedImage || productImages[0] || ''
  const displayPrice = product ? `NGN ${Number(product.price || 0).toLocaleString()}` : ''
  const quickFacts = useMemo(
    () => [
      product?.category || 'Herbal blend',
      product?.sku || 'Natural ingredients',
      Number(product?.stock || 0) > 0 ? 'In stock' : 'Out of stock',
    ],
    [product],
  )
  const details = useMemo(
    () => [
      'A refined herbal product crafted for daily use, with a clean and natural presentation.',
      'Made to feel premium on the page while still being simple to scan on mobile.',
      'Use the gallery to switch between product variations and view each image clearly.',
    ],
    [],
  )
  const productTags = useMemo(
    () => [
      product?.category || 'Herbs',
      product?.sku || 'Organic',
      'Natural',
      'Featured',
    ],
    [product],
  )
  const quantityOptions = [1, 2, 3]

  function handleAddToCart() {
    if (!product) return
    addToCart(product, selectedQty)
    setAddedMessage(`${product.name} added to cart!`)
    setTimeout(() => setAddedMessage(''), 2500)
  }

  return (
    <>
      <HeroBanner
        title="PRODUCT DETAILS"
        breadcrumb={`Home  /  Product Details${product?.name ? `  /  ${product.name}` : ''}`}
        backgroundPhoto={bannaImage}
      />

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
          <section className="page-shell product-detail">
            <div className="product-detail__gallery">
              <div className="product-detail__main">
                {mainImageUrl ? (
                  <img src={mainImageUrl} alt={product.name} />
                ) : (
                  <div className="product-detail__empty-image" aria-label={`${product.name} has no image`} />
                )}
                <span className="badge badge--floating">New</span>
              </div>
              <div className="product-detail__thumbs">
                {productImages.length ? (
                  productImages.map((image, index) => {
                    return (
                      <button
                        key={image || index}
                        type="button"
                        className={selectedImage === image ? 'is-active' : ''}
                        onClick={() => setSelectedImage(image)}
                      >
                        <img src={image} alt={`${product.name} ${index + 1}`} />
                      </button>
                    )
                  })
                ) : (
                  <p className="product-detail__empty-text">No product images uploaded yet.</p>
                )}
              </div>
            </div>
            <div className="product-detail__content">
              {loading ? <p>Loading product...</p> : null}
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <h2>{product.name}</h2>
              <p className="rating">32 Reviews | Add Your Reviews</p>
              <div className="product-detail__meta-row">
                {quickFacts.map((fact) => (
                  <span key={fact}>{fact}</span>
                ))}
              </div>
              <strong className="price">{displayPrice}</strong>
              <p className="available">
                Available: <span>{Number(product.stock || 0) > 0 ? 'In stock' : 'Out of stock'}</span>
              </p>
              <p className="summary">
                {product.description ||
                  'A clean herbal product page with room for ingredients, benefits, and variation images.'}
              </p>
              <ul className="feature-list">
                <li>Premium herbal formulation</li>
                <li>Multiple product images</li>
                <li>Designed for easy browsing</li>
              </ul>
              <div className="purchase-row">
                <div className="product-detail__selector">
                  <span>Qty</span>
                  <div className="product-detail__qty">
                    {quantityOptions.map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        className={selectedQty === qty ? 'is-active' : ''}
                        onClick={() => setSelectedQty(qty)}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="button" className="primary-button" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button type="button" className="secondary-button">
                  Add to Wishlist
                </button>
              </div>
              {addedMessage ? <p className="text-sm" style={{ color: '#63ac18', marginTop: 8, fontWeight: 600 }}>{addedMessage}</p> : null}
              <p className="meta">Categories: {product.category || 'General'}</p>
              <p className="meta">Tags: {productTags.join(', ')}</p>
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
                <div className="product-description">
                  <p>{product.description || 'No description added yet.'}</p>
                  {details.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <h3>Important Information</h3>
                  <ul>
                    <li>Great for a clean, modern product presentation.</li>
                    <li>Supports multiple product photos for variations.</li>
                    <li>Designed to stay readable on mobile and desktop.</li>
                  </ul>
                </div>
              ) : tab === 'Tags' ? (
                <div className="tag-list">
                  {productTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              ) : (
                <div className="product-reviews">
                  <p>No reviews yet.</p>
                  <p>Be the first to leave a review for this product.</p>
                </div>
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
