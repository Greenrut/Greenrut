import { useEffect, useState } from "react";
import { ProductCard } from "../components/SiteChrome.jsx";
import { publicRequest } from "../lib/publicApi.js";
import { NewsletterBand, SectionTitle } from "./shared.jsx";
import heroImage from '../assets/hero.png'
import bannerImage from '../assets/banna.png'

function mapProduct(product, index = 0) {
  return {
    name: product.name,
    price: `NGN ${Number(product.price || 0).toLocaleString()}`,
    badge: product.status === "published" ? "" : "Draft",
    tone: ["leaf", "bowl", "powder", "bundle", "mix"][index % 5],
    images: product.images || [],
  };
}

const heroSlides = [
  {
    eyebrow: '100% herbal',
    title: 'Scientifically Proven,',
    text:
      'Explore our range of herbal products with a calm, modern presentation that keeps the layout close to the supplied references.',
    image: heroImage,
    alt: 'Herbal products hero',
  },
  {
    eyebrow: 'Greenrut',
    title: 'Nature Powered Wellness',
    text:
      'Discover a cleaner storefront experience built around thoughtful product storytelling and a premium visual rhythm.',
    image: bannerImage,
    alt: 'Greenrut wellness banner',
  },
]

function getPostSummary(post) {
  return post.excerpt || post.content || "A new blog post is ready.";
}

export function HomePage({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        setLoading(true);
        const [productsResponse, postsResponse] = await Promise.all([
          publicRequest("/products"),
          publicRequest("/posts"),
        ]);
        if (cancelled) return;

        setProducts(productsResponse.data || []);
        setPosts(postsResponse.data || []);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Failed to load home content");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHomeData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const bestsellers = products.slice(0, 8);
  const heroSlide = heroSlides[activeHero];

  return (
    <>
      <section className="home-hero page-shell">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">{heroSlide.eyebrow}</p>
          <h1>
            {heroSlide.title}
          </h1>
          <p>{heroSlide.text}</p>
          <div className="actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => onNavigate?.("/product")}
            >
              Explore Our Products
            </button>
            <button
              type="button"
              className="secondary-button secondary-button--dark"
              onClick={() => onNavigate?.("/blog")}
            >
              Read Blog
            </button>
          </div>
          <div className="home-hero__dots" aria-label="Hero slides">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={index === activeHero ? 'is-active' : ''}
                aria-label={`Show slide ${index + 1}`}
                aria-pressed={index === activeHero}
                onClick={() => setActiveHero(index)}
              />
            ))}
          </div>
        </div>
        <div className="home-hero__art">
          <button
            type="button"
            className="home-hero__nav home-hero__nav--prev"
            aria-label="Previous slide"
            onClick={() => setActiveHero((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
          >
            &#8249;
          </button>
          <img
            src={heroSlide.image}
            alt={heroSlide.alt}
            className="home-hero__image"
          />
          <button
            type="button"
            className="home-hero__nav home-hero__nav--next"
            aria-label="Next slide"
            onClick={() => setActiveHero((current) => (current + 1) % heroSlides.length)}
          >
            &#8250;
          </button>
        </div>
      </section>

      <section className="section-band">
        <div className="page-shell">
          <SectionTitle title="Our Bestsellers" />
          {loading ? <p>Loading products...</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!loading && !error && bestsellers.length === 0 ? (
            <p>No products yet.</p>
          ) : null}
          <div className="product-grid product-grid--home">
            {bestsellers.map((product, index) => (
              <button
                key={product.id || product.name}
                type="button"
                className="text-left"
                onClick={() =>
                  onNavigate?.(`/product-details?id=${product.id}`)
                }
              >
                <ProductCard {...mapProduct(product, index)} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell blog-grid">
        <SectionTitle title="From the Blog" />
        {!loading && !error && posts.length === 0 ? (
          <p>No blog posts yet.</p>
        ) : null}
        <div className="blog-grid__list">
          {posts.slice(0, 3).map((post, index) => (
            <article
              key={post.id || post.slug || post.title}
              className="blog-card"
            >
              <div
                className={`blog-card__image blog-card__image--${index + 1}`}
              />
              <p className="blog-card__date">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : "Blog"}
              </p>
              <h3>{post.title}</h3>
              <p>{getPostSummary(post)}</p>
              <button type="button" onClick={() => onNavigate?.("/blog")}>
                READ MORE
              </button>
            </article>
          ))}
        </div>
      </section>

      <NewsletterBand />
    </>
  );
}