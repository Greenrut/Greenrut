import { useEffect, useState } from "react";
import { ProductCard } from "../components/SiteChrome.jsx";
import { publicRequest } from "../lib/publicApi.js";
import { SectionTitle } from "./shared.jsx";
import heroImage from "../assets/hero.png"; // Assuming hero.png is in the assets folder

function mapProduct(product, index = 0) {
  return {
    name: product.name,
    price: `NGN ${Number(product.price || 0).toLocaleString()}`,
    badge: product.status === "published" ? "" : "Draft",
    tone: ["leaf", "bowl", "powder", "bundle", "mix"][index % 5],
    images: product.images || [],
  };
}

function getPostSummary(post) {
  return post.excerpt || post.content || "A new blog post is ready.";
}

export function HomePage({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const bestsellers = products.slice(0, 8);

  return (
    <>
      <section className="home-hero page-shell">
        <div className="home-hero__copy">
          <h1>
            100% <span>herbal:</span>
            <br />
            Scientifically Proven,
          </h1>
          <p>
            Explore our range of herbal products with a calm, modern
            presentation that keeps the layout close to the supplied references.
          </p>
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
        </div>
        <div className="home-hero__art">
          <img
            src={heroImage}
            alt="Herbal products hero"
            className="home-hero__image"
          />
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
    </>
  );
}
