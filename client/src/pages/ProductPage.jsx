import { useEffect, useMemo, useState } from "react";
import { HeroBanner } from "../components/SiteChrome.jsx";
import { publicRequest } from "../lib/publicApi.js";
import { getImageSource } from "../lib/image.js";
import bannaImage from "../assets/banna.png";
import { fallbackProducts } from "../data.js";

function getProductImage(product) {
  const firstImage = Array.isArray(product.images)
    ? product.images[0]
    : product.image || product.thumbnail;
  return getImageSource(firstImage, { width: 520 });
}

function buildWhatsAppUrl(product) {
  const number = String(import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(
    /\D/g,
    "",
  );
  const text = encodeURIComponent(`Hi, I'm interested in ${product.name}.`);
  return number ? `https://wa.me/${number}?text=${text}` : "/contact";
}

function ProductCard({ product, onView, onOrder }) {
  const imageUrl = getProductImage(product);
  const description =
    product.description ||
    product.excerpt ||
    "A clean herbal product listing ready for your content.";

  return (
    <article className="catalog-card">
      <div className="catalog-card__image">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" />
        ) : (
          <div
            className="catalog-card__empty"
            aria-label={`${product.name} has no image`}
          />
        )}
      </div>
      <div className="catalog-card__body">
        <h3>{product.name}</h3>
        <p>{description}</p>
        <div className="catalog-card__actions">
          <button
            type="button"
            className="catalog-card__primary"
            onClick={onView}
          >
            View Product
          </button>
          <button
            type="button"
            className="catalog-card__secondary"
            onClick={onOrder}
          >
            Order WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}

const productCategoryOverview = [
  [
    "SKIN & BODY CARE",
    "Anti-Aging care, beauty bars, moisturizers, hair oil, body oil, sunscreen, african soaps, toners",
  ],
  [
    "DAILY SUPPLEMENTS (Nutrition)",
    "Vitamins, Minerals, Stress reliever, Sleep, Focus, Energy, Performance.",
  ],
  [
    "IMMUNITY & METABOLISM",
    "Detoxifier, Anti-oxidants, Blood sugar, Digestion, Cholesterol, Circulation.",
  ],
  [
    "TARGETED HEALTH",
    "Weight Management, Heart & Brain Health, Bone & Eye care, Diabetes, Respiratory health",
  ],
  [
    "MEN & WOMEN",
    "Fertility, Menopause, Prostate, Stamina, Hormonal balances, Menstrual comfort, libido.",
  ],
  [
    "HERBAL INSTANTS",
    "Herbal Drinks, Juice, Concentrated powders, tinctures, adaptogens for instant action.",
  ],
];

export function ProductPage({ onNavigate, search }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return (
      new URLSearchParams(search || window.location.search).get("category") ||
      "All"
    );
  });
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const cat = new URLSearchParams(search || window.location.search).get(
      "category",
    );
    setSelectedCategory(cat || "All");
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        const response = await publicRequest("/products");
        if (!cancelled) {
          setProducts(response.data || []);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Failed to load products");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [
    "All",
    "SKIN & BODY CARE",
    "DAILY SUPPLEMENTS (Nutrition)",
    "IMMUNITY & METABOLISM",
    "TARGETED HEALTH",
    "MEN & WOMEN",
    "HERBAL INSTANTS",
  ];

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const source = products.length ? products : fallbackProducts;
    const filtered = source.filter((product) => {
      const productCategory =
        product.category || product.categories?.[0] || "Uncategorized";
      const matchesCategory =
        selectedCategory === "All" || productCategory === selectedCategory;
      const matchesSearch =
        !term ||
        [product.name, product.description, product.excerpt, productCategory]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered];
    if (sortBy === "name-asc") {
      sorted.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || "")),
      );
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) =>
        String(b.name || "").localeCompare(String(a.name || "")),
      );
    } else {
      sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    }

    return sorted;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const featureTags = [
    "Organic",
    "Herbal",
    "Natural",
    "Tea",
    "Powder",
    "Blend",
  ];

  return (
    <>
      <HeroBanner
        title="PRODUCTS"
        breadcrumb="Home  /  Product"
        backgroundPhoto={bannaImage}
      />
      <section className="page-shell catalog-page">
        <div className="catalog-page__header reveal-on-scroll reveal-slide-up">
          <h2>
            Nature's Potent Solutions for Every Aspect of Your Well-being.
          </h2>
          <p>
            Explore 100% herbal, scientifically guided products crafted for
            purity, potency, and peace of mind.
          </p>
        </div>

        <div className="product-category-overview">
          {productCategoryOverview.map(([title, text], index) => {
            const delayClass = `reveal-delay-${(index % 3) * 100}`;
            return (
              <button
                key={title}
                type="button"
                className={`reveal-on-scroll reveal-slide-up ${delayClass} ${selectedCategory === title ? "is-active" : ""}`}
                onClick={() => {
                  setSelectedCategory(title);
                  setSearchTerm("");
                }}
              >
                <h3>{title}</h3>
                <p>{text}</p>
              </button>
            );
          })}
        </div>

        {loading ? <p>Loading products...</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {!loading && !error ? (
          <div className="catalog-layout">
            <aside className="catalog-sidebar">
              <div className="filter-panel reveal-on-scroll reveal-slide-up">
                <h2>Shop by Category</h2>
                <ul>
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        type="button"
                        className={
                          selectedCategory === category ? "is-active" : ""
                        }
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="filter-panel reveal-on-scroll reveal-slide-up">
                <h2>Search</h2>
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search products"
                />
              </div>

              <div className="filter-panel reveal-on-scroll reveal-slide-up">
                <h2>Price Filter</h2>
                <div className="price-track" aria-hidden="true" />
                <p className="catalog-help-text">
                  Use the product pricing controls to narrow the list.
                </p>
              </div>

              <div className="filter-panel reveal-on-scroll reveal-slide-up">
                <h2>By Tag</h2>
                <div className="tag-list">
                  {featureTags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </aside>

            <div className="catalog-main">
              <div className="catalog-toolbar reveal-on-scroll reveal-slide-up">
                <p>
                  Showing {filteredProducts.length} of{" "}
                  {products.length || fallbackProducts.length} products
                </p>
                <div className="catalog-toolbar__controls">
                  <label>
                    Sort By
                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                    </select>
                  </label>
                  <label>
                    View
                    <select defaultValue="grid">
                      <option value="grid">Grid</option>
                      <option value="list">List</option>
                    </select>
                  </label>
                </div>
              </div>

              {!filteredProducts.length ? <p>No products found.</p> : null}

              <div className="catalog-grid">
                {filteredProducts.map((product, index) => {
                  const delayClass = `reveal-delay-${(index % 3) * 100}`;
                  return (
                    <div
                      key={product.id || product.name}
                      className={`reveal-on-scroll reveal-slide-up ${delayClass}`}
                    >
                      <ProductCard
                        product={product}
                        onView={() =>
                          onNavigate?.(`/product-details?id=${product.id}`)
                        }
                        onOrder={() => {
                          const url = buildWhatsAppUrl(product);
                          if (url.startsWith("/")) {
                            onNavigate?.(url);
                            return;
                          }
                          window.open(url, "_blank", "noopener,noreferrer");
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
