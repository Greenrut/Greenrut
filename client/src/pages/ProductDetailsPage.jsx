import { useEffect, useMemo, useState } from 'react'
import { HeroBanner, ProductCard } from '../components/SiteChrome.jsx'
import { publicRequest } from '../lib/publicApi.js'
import { addToCart } from '../lib/cart.js'
import { accountRequest } from '../lib/accountApi.js'
import { getImageSource } from '../lib/image.js'
import { hasUserAuth } from '../lib/auth.js'
import { SectionTitle } from './shared.jsx'
import bannaImage from '../assets/banna.png'
import { fallbackProducts } from '../data.js'

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
  return images.map((image) => getImageSource(image, { width: 420 })).filter(Boolean)
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
  const [wishlistMessage, setWishlistMessage] = useState('')
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: '5', comment: '' })
  const [reviewMessage, setReviewMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProduct() {
      try {
        setLoading(true)
        const response = await publicRequest('/products')
        const items = response.data || []
        let selectedProduct = null

        if (productId && String(productId).startsWith('fallback-')) {
          selectedProduct = fallbackProducts.find((item) => String(item.id) === String(productId)) || null
        } else {
          selectedProduct = items.find((item) => String(item.id) === String(productId)) || null
        }

        if (!selectedProduct) {
          selectedProduct = items[0] || fallbackProducts[0] || null
        }

        if (cancelled) return

        setProduct(selectedProduct)
        const images = Array.isArray(selectedProduct?.images) ? selectedProduct.images : []
        setSelectedImage(getImageSource(images[0], { width: 1200 }) || '')

        const sourceList = items.length ? items : fallbackProducts
        setRelatedProducts(selectedProduct ? sourceList.filter((item) => String(item.id) !== String(selectedProduct.id)).slice(0, 4) : [])

        if (selectedProduct?.id && !String(selectedProduct.id).startsWith('fallback-')) {
          const reviewsResponse = await publicRequest(`/products/${selectedProduct.id}/reviews`)
          if (!cancelled) setReviews(reviewsResponse.data || [])
        } else {
          setReviews([])
        }
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
      'Unlock the power of natural ingredients selected for therapeutic relevance and everyday wellness support.',
      'Greenrut products are shaped by research, quality assurance, and a commitment to transparent safety standards.',
      'Every formulation is presented with clear directions, benefit-led information, and room for scientific validation.',
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

  const updateReviewField = (field) => (event) => {
    setReviewForm((current) => ({ ...current, [field]: event.target.value }))
  }

  function handleAddToCart() {
    if (!product) return
    addToCart(product, selectedQty)
    setAddedMessage(`${product.name} added to cart!`)
    setTimeout(() => setAddedMessage(''), 2500)
  }

  async function handleAddToWishlist() {
    if (!product) return
    if (!hasUserAuth()) {
      onNavigate?.('/login')
      return
    }

    try {
      const images = Array.isArray(product?.images) ? product.images : []
      const imageUrl = getImageUrl(images[0]) || mainImageUrl || ''
      await accountRequest('/account/wishlist', {
        method: 'POST',
        body: {
          productId: product.id,
          name: product.name,
          price: Number(product.price || 0),
          oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
          stock: Number(product.stock || 0) > 0 ? 'in_stock' : 'out_of_stock',
          imageUrl,
        },
      })

      setWishlistMessage(`${product.name} saved to wishlist!`)
      setTimeout(() => setWishlistMessage(''), 2500)
    } catch (requestError) {
      setWishlistMessage(requestError.message || 'Failed to add to wishlist')
      setTimeout(() => setWishlistMessage(''), 3500)
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault()
    if (!product) return

    try {
      const response = await publicRequest(`/products/${product.id}/reviews`, {
        method: 'POST',
        body: {
          ...reviewForm,
          rating: Number(reviewForm.rating || 5),
        },
      })
      setReviews((current) => [response.data, ...current])
      setReviewForm({ name: '', email: '', rating: '5', comment: '' })
      setReviewMessage('Review submitted. Thank you.')
    } catch (requestError) {
      setReviewMessage(requestError.message || 'Failed to submit review')
    }
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
                        onClick={() => setSelectedImage(getImageSource(image, { width: 1200 }) || '')}
                      >
                        <img src={getImageSource(image, { width: 320 })} alt={`${product.name} ${index + 1}`} loading="lazy" />
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
              <p className="rating">{reviews.length} Reviews | Add Your Reviews</p>
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
                  'A 100% herbal solution crafted for purity, potency, and peace of mind.'}
              </p>
              <ul className="feature-list">
                <li>100% herbal formulation</li>
                <li>Scientifically guided product development</li>
                <li>Zero toxicology incidence commitment</li>
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
                <button type="button" className="secondary-button" onClick={handleAddToWishlist}>
                  Add to Wishlist
                </button>
              </div>
              {addedMessage ? <p className="text-sm" style={{ color: '#63ac18', marginTop: 8, fontWeight: 600 }}>{addedMessage}</p> : null}
              {wishlistMessage ? <p className="text-sm" style={{ color: '#0f766e', marginTop: 8, fontWeight: 600 }}>{wishlistMessage}</p> : null}
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
                  {product.benefits ? (
                    <>
                      <h3>Key Benefits</h3>
                      <p>{product.benefits}</p>
                    </>
                  ) : null}
                  {details.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <h3>Nature's Finest, Backed by Science</h3>
                  <p>
                    {product.ingredients || 'Key ingredients are selected for traditional relevance and investigated for modern therapeutic potential. Greenrut emphasizes potency, standardization, and safe use across its formulations.'}
                  </p>
                  <h3>The Greenrut Promise: Proven Efficacy, Zero Toxicity</h3>
                  <p>
                    {product.scientificValidation || 'Every product has room for clear scientific validation notes, potency summaries, and toxicology assurance from the admin panel.'}
                  </p>
                  <h3>Simple Steps for Optimal Results</h3>
                  <p>
                    {product.directions || 'Follow product directions carefully, use consistently as recommended, and consult a healthcare professional if you are pregnant, nursing, or currently taking medication.'}
                  </p>
                  <h3>Important Information</h3>
                  {product.warnings ? <p>{product.warnings}</p> : null}
                  <ul>
                    <li>Review all usage instructions before taking any herbal product.</li>
                    <li>Keep products sealed, dry, and away from direct sunlight.</li>
                    <li>Greenrut prioritizes safety, transparency, and evidence-led claims.</li>
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
                  {reviews.length ? (
                    reviews.map((review) => (
                      <article key={review.id || `${review.name}-${review.createdAt}`} className="product-review-card">
                        <strong>{review.name}</strong>
                        <span>{'*'.repeat(Number(review.rating || 5))}</span>
                        <p>{review.comment}</p>
                      </article>
                    ))
                  ) : (
                    <p>No reviews yet. Be the first to leave a review for this product.</p>
                  )}
                  <form className="product-review-form" onSubmit={handleReviewSubmit}>
                    <input value={reviewForm.name} onChange={updateReviewField('name')} type="text" placeholder="Your name" required />
                    <input value={reviewForm.email} onChange={updateReviewField('email')} type="email" placeholder="Email address" />
                    <select value={reviewForm.rating} onChange={updateReviewField('rating')}>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                    <textarea value={reviewForm.comment} onChange={updateReviewField('comment')} placeholder="Write your review" rows={4} required />
                    <button type="submit" className="primary-button">Submit Review</button>
                    {reviewMessage ? <p>{reviewMessage}</p> : null}
                  </form>
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
