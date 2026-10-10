import { useEffect, useMemo, useState } from 'react'
import { publicRequest } from '../lib/publicApi.js'
import { HeroBanner } from '../components/SiteChrome.jsx'
import { SectionTitle } from './shared.jsx'
import bannaImage from '../assets/banna.png'

function getPostCover(post) {
  if (!post) return null
  const img = post.coverImage || post.image
  if (!img) return null
  if (typeof img === 'string') return img
  if (typeof img === 'object') {
    return img.url || img.secureUrl || img.src || img.path || null
  }
  return null
}

function getPostSummary(post) {
  const text = post.excerpt || post.content || 'Explore this self-care guide from Greenrut Laboratories.'
  return text.length > 150 ? text.slice(0, 150).trim() + '...' : text
}

function calculateReadTime(text) {
  if (!text) return '3 min read'
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 180))
  return `${minutes} min read`
}

export function BlogPage({ onNavigate, search, pathname }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [copied, setCopied] = useState(false)

  // Extract selected ID or slug from query param OR path segment
  const queryParams = new URLSearchParams(search || (typeof window !== 'undefined' ? window.location.search : ''))
  const queryParamId = queryParams.get('id') || queryParams.get('slug')
  
  // Extract path segment (e.g. /self-care/future-of-medicine or /blog/future-of-medicine)
  const pathParam = useMemo(() => {
    if (!pathname) return null
    const cleaned = pathname.replace(/^\/(blog|self-care)\/?/, '').trim()
    return cleaned.length > 0 ? decodeURIComponent(cleaned) : null
  }, [pathname])

  const activeKey = queryParamId || pathParam

  const selectedPost = useMemo(() => {
    if (!activeKey || posts.length === 0) return null
    const normalizedKey = String(activeKey).toLowerCase().trim()
    return posts.find((p) => {
      const idMatch = String(p.id) === activeKey || String(p._id) === activeKey
      const slugMatch = p.slug && p.slug.toLowerCase().trim() === normalizedKey
      const titleMatch = p.title && p.title.toLowerCase().trim() === normalizedKey
      return idMatch || slugMatch || titleMatch
    }) || null
  }, [activeKey, posts])

  useEffect(() => {
    let cancelled = false

    async function loadPosts() {
      try {
        setLoading(true)
        const response = await publicRequest('/posts')
        if (!cancelled) {
          setPosts(response.data || [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load blog posts')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPosts()
    return () => {
      cancelled = true
    }
  }, [])

  // Scroll to top when switching between article and list view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [activeKey])

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const categories = ['All', 'Articles', 'Recipes', 'Videos & Media', 'Podcasts']

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !searchQuery ||
        (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCat =
        activeCategory === 'All' ||
        (post.category && post.category.toLowerCase().includes(activeCategory.toLowerCase()))

      return matchesSearch && matchesCat
    })
  }, [posts, searchQuery, activeCategory])

  const otherPosts = useMemo(() => {
    if (!selectedPost) return []
    return posts.filter((p) => String(p.id || p._id) !== String(selectedPost.id || selectedPost._id)).slice(0, 3)
  }, [posts, selectedPost])

  return (
    <>
      <HeroBanner
        title={selectedPost ? 'SELF-CARE & WELLNESS' : 'SELF-CARE'}
        breadcrumb={
          selectedPost
            ? `Home  /  Self-Care  /  ${selectedPost.title.length > 28 ? selectedPost.title.slice(0, 28) + '...' : selectedPost.title}`
            : 'Home  /  Self-Care'
        }
        backgroundPhoto={bannaImage}
      />

      {/* SINGLE ARTICLE VIEW */}
      {selectedPost ? (
        <section className="page-shell blog-article-container">
          {/* Back button */}
          <div className="blog-article-nav-top">
            <button
              type="button"
              className="blog-article-back-btn"
              onClick={() => onNavigate?.('/self-care')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back to all articles</span>
            </button>
          </div>

          <article className="blog-article">
            {/* Category Pill */}
            <div className="blog-article-badge-wrap">
              <span className="blog-article-badge">
                {selectedPost.category || 'HOLISTIC HEALTH & HERBAL SCIENCE'}
              </span>
            </div>

            {/* Article Headline */}
            <h1 className="blog-article-title">{selectedPost.title}</h1>

            {/* Metadata Bar */}
            <div className="blog-article-meta">
              <div className="blog-article-author-info">
                <div className="blog-author-avatar">
                  {(selectedPost.author?.[0] || 'G').toUpperCase()}
                </div>
                <div>
                  <strong className="blog-author-name">{selectedPost.author || 'Greenrut Laboratories'}</strong>
                  <span className="blog-meta-sep">•</span>
                  <span className="blog-publish-date">
                    {selectedPost.createdAt
                      ? new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recently Published'}
                  </span>
                  <span className="blog-meta-sep">•</span>
                  <span className="blog-read-time">{calculateReadTime(selectedPost.content)}</span>
                </div>
              </div>

              {/* Quick WhatsApp Share Pill */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `*${selectedPost.title}*\nRead this insightful guide on Greenrut:\n${typeof window !== 'undefined' ? window.location.href : ''}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-quick-share-btn"
                title="Share on WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.079-2.036-.477-1.613-.67-2.658-2.316-2.738-2.423-.081-.107-.655-.873-.655-1.664 0-.791.414-1.18.561-1.341.147-.161.32-.202.427-.202.107 0 .214.002.307.006.102.005.239-.039.373.283.138.33.473 1.154.514 1.238.041.084.068.183.013.293-.055.11-.082.179-.163.275-.081.096-.171.215-.245.289-.083.083-.169.174-.073.34.096.166.427.706.915 1.141.629.56 1.16.733 1.326.816.166.083.263.072.361-.041.098-.113.42-.489.533-.657.113-.168.226-.14.379-.083.153.057.969.457 1.135.54.166.083.277.124.318.193.041.069.041.401-.103.806z" />
                </svg>
                <span>Share</span>
              </a>
            </div>

            {/* Featured Hero Cover Image */}
            {getPostCover(selectedPost) ? (
              <div className="blog-article-hero">
                <img
                  src={getPostCover(selectedPost)}
                  alt={selectedPost.title}
                  className="blog-article-hero__img"
                />
              </div>
            ) : null}

            {/* Excerpt Highlight Callout */}
            {selectedPost.excerpt ? (
              <div className="blog-article-excerpt-callout">
                <div className="blog-excerpt-icon">“</div>
                <p>{selectedPost.excerpt}</p>
              </div>
            ) : null}

            {/* Main Article Body Text */}
            <div className="blog-article-body">
              {(selectedPost.content || '')
                .split('\n')
                .map((paragraph, idx) => {
                  const trimmed = paragraph.trim()
                  if (!trimmed) return null

                  // If line is a famous quote
                  if (trimmed.startsWith('"') || trimmed.startsWith('“')) {
                    return (
                      <blockquote key={idx} className="blog-article-quote">
                        {trimmed}
                      </blockquote>
                    )
                  }

                  // If line is a section heading (short text, no ending period, title-cased)
                  if (
                    trimmed.length < 55 &&
                    !trimmed.endsWith('.') &&
                    !trimmed.endsWith(',') &&
                    (trimmed === trimmed.toUpperCase() ||
                      /^[A-Z][A-Za-z0-9\s&,:-]+$/.test(trimmed)) &&
                    idx > 0
                  ) {
                    return (
                      <h3 key={idx} className="blog-article-subhead">
                        {trimmed}
                      </h3>
                    )
                  }

                  return <p key={idx}>{trimmed}</p>
                })}
            </div>

            {/* Bottom Social Sharing Bar */}
            <div className="blog-article-share-bar">
              <div className="blog-share-label">
                <span className="blog-share-dot"></span>
                <strong>Share this self-care guide:</strong>
              </div>
              <div className="blog-share-links">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `*${selectedPost.title}*\n${typeof window !== 'undefined' ? window.location.href : ''}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-share-pill blog-share-pill--whatsapp"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}&url=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-share-pill blog-share-pill--twitter"
                >
                  X (Twitter)
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : ''
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-share-pill blog-share-pill--fb"
                >
                  Facebook
                </a>
                <button
                  type="button"
                  className="blog-share-pill blog-share-pill--copy"
                  onClick={handleCopyLink}
                >
                  {copied ? '✓ Link Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* Author Profile Bio Card */}
            <div className="blog-author-bio-card">
              <div className="blog-author-bio-avatar">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2c5c2d" strokeWidth="2">
                  <path d="M12 2c5 3 8.5 4 10 4 0 12-4 18-10 22C6 24 2 18 2 6c1.5 0 5-1 10-4Z" />
                </svg>
              </div>
              <div className="blog-author-bio-text">
                <h4>Published by Greenrut Editorial & Research</h4>
                <p>
                  Greenrut is dedicated to formulating pure, science-backed botanical remedies and holistic wellness solutions. Every article is crafted from ethnobotanical wisdom and contemporary phytochemical validation.
                </p>
              </div>
            </div>
          </article>

          {/* MORE FROM SELF-CARE */}
          {otherPosts.length > 0 ? (
            <div className="blog-related-section">
              <div className="reveal-on-scroll reveal-slide-up">
                <SectionTitle title="More From Self-Care" />
              </div>
              <div className="blog-grid__list !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-[20px] !mt-6">
                {otherPosts.map((post, idx) => {
                  const cover = getPostCover(post)
                  const target = `/self-care?id=${post.id || post.slug}`
                  return (
                    <article
                      key={post.id || post.slug || idx}
                      className="blog-card blog-card--clickable"
                      onClick={() => onNavigate?.(target)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`blog-card__image ${cover ? 'has-image' : `blog-card__image--${(idx % 3) + 1}`}`}>
                        {cover ? (
                          <img src={cover} alt={post.title} className="blog-card__img" loading="lazy" />
                        ) : null}
                      </div>
                      <div className="blog-card__body">
                        <p className="blog-card__date">
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Self-Care'}
                        </p>
                        <h3 className="blog-card__title">{post.title}</h3>
                        <p>{getPostSummary(post)}</p>
                        <button
                          type="button"
                          className="blog-card__read-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigate?.(target)
                          }}
                        >
                          READ ARTICLE →
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ) : null}
        </section>
      ) : (
        /* ARCHIVE / LIST VIEW */
        <section className="page-shell blog-grid">
          <div className="reveal-on-scroll reveal-slide-up flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <SectionTitle title="Self-Care, Wellness & Insights" />
            <div className="blog-search-box">
              <input
                type="text"
                placeholder="Search articles, recipes, herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="blog-search-input"
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="blog-search-clear"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              ) : null}
            </div>
          </div>

          {/* Category Tabs: Articles, Recipes, Videos, Podcasts */}
          <div className="blog-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`blog-category-tab ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="blog-loading-state">
              <div className="blog-loading-spinner"></div>
              <p>Loading self-care articles...</p>
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-600 my-4">{error}</p> : null}

          {!loading && !error && filteredPosts.length === 0 ? (
            <div className="blog-empty-state">
              <div className="blog-empty-icon">🍃</div>
              <h3>No articles found</h3>
              <p>Try searching with another keyword or select "All".</p>
              {searchQuery && (
                <button
                  type="button"
                  className="admin-primary-button !mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : null}

          <div className="blog-grid__list !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-[24px]">
            {filteredPosts.map((post, index) => {
              const delayClass = `reveal-delay-${(index % 3) * 150}`
              const coverUrl = getPostCover(post)
              const target = `/self-care?id=${post.id || post.slug}`
              return (
                <div
                  key={post.id || post.slug || post.title}
                  className={`reveal-on-scroll reveal-slide-up ${delayClass}`}
                >
                  <article
                    className="blog-card blog-card--clickable"
                    onClick={() => onNavigate?.(target)}
                    style={{ height: '100%', cursor: 'pointer' }}
                  >
                    <div className={`blog-card__image ${coverUrl ? 'has-image' : `blog-card__image--${(index % 3) + 1}`}`}>
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={post.title}
                          className="blog-card__img"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div className="blog-card__body">
                      <p className="blog-card__date">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Self-Care'}
                      </p>
                      <h3 className="blog-card__title">{post.title}</h3>
                      <p>{getPostSummary(post)}</p>
                      <button
                        type="button"
                        className="blog-card__read-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onNavigate?.(target)
                        }}
                      >
                        READ ARTICLE →
                      </button>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
