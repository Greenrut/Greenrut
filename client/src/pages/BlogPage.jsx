import { useEffect, useState } from 'react'
import { publicRequest } from '../lib/publicApi.js'
import { HeroBanner } from '../components/SiteChrome.jsx'
import { SectionTitle } from './shared.jsx'
import bannaImage from '../assets/banna.png'

function getPostSummary(post) {
  return post.excerpt || post.content || 'A new blog post is ready.'
}

export function BlogPage({ onNavigate, search }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const selectedId = new URLSearchParams(search || window.location.search).get('id')
  const selectedPost = posts.find((post) => String(post.id) === String(selectedId))

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

  return (
    <>
      <HeroBanner
        title="BLOG"
        breadcrumb="Home  /  Blog"
        backgroundPhoto={bannaImage}
      />
      <section className="page-shell blog-grid">
        <SectionTitle title={selectedPost ? selectedPost.title : 'Latest Posts'} />
        {loading ? <p>Loading blog posts...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error && posts.length === 0 ? <p>No blog posts yet.</p> : null}
        {selectedPost ? (
          <article className="blog-card blog-card--featured">
            <p className="blog-card__date">{selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleDateString() : 'Blog'}</p>
            <h3>{selectedPost.title}</h3>
            <p>{getPostSummary(selectedPost)}</p>
            <button type="button" onClick={() => onNavigate?.('/blog')}>
              BACK TO LIST
            </button>
          </article>
        ) : (
          <div className="blog-grid__list !grid !grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !gap-[18px]">
            {posts.map((post, index) => (
              <article key={post.id || post.slug || post.title} className="blog-card">
                <div className={`blog-card__image blog-card__image--${(index % 3) + 1}`} />
                <p className="blog-card__date">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Blog'}</p>
                <h3>{post.title}</h3>
                <p>{getPostSummary(post)}</p>
                <button type="button" onClick={() => onNavigate?.(`/blog?id=${post.id}`)}>
                  READ MORE
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
