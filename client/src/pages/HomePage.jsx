import { useEffect, useState } from "react";
import { ProductCard } from "../components/SiteChrome.jsx";
import { publicRequest } from "../lib/publicApi.js";
import { NewsletterBand, SectionTitle } from "./shared.jsx";
import bannerOneImage from "../assets/1.png";
import bannerTwoImage from "../assets/second.png";
import bannerThreeImage from "../assets/3.png";
import bannerFourImage from "../assets/4.png";
import leafSaleImage from "../assets/leaf1.png";
import bowlSaleImage from "../assets/leaf2.png";
import { fallbackProducts } from "../data.js";
import catSkinImg from "../assets/category_skin_body_care.png";
import catSupplementsImg from "../assets/category_daily_supplements.png";
import catImmunityImg from "../assets/category_immunity_metabolism.png";
import catTargetedImg from "../assets/category_targeted_health.png";
import catMenWomenImg from "../assets/category_men_women.png";
import catHerbalImg from "../assets/category_herbal_instants.png";

function mapProduct(product, index = 0) {
  return {
    name: product.name,
    price: `NGN ${Number(product.price || 0).toLocaleString()}`,
    badge: product.status === "published" ? "" : "Draft",
    tone: ["leaf", "bowl", "powder", "bundle", "mix"][index % 5],
    images: product.images || [],
  };
}

function getHeroImageProps(slide) {
  const src = slide.image?.url || slide.image;
  return {
    src,
    srcSet: src ? `${src} 1200w` : undefined,
    sizes: "100vw",
  };
}

function getCategoryImageProps(image) {
  const src = image?.url || image;
  return {
    src,
    srcSet: src ? `${src} 400w` : undefined,
    sizes: "(max-width: 768px) 100vw, 33vw",
  };
}

const heroSlides = [
  {
    title: "Every Health Problem Has a Natural Solution.",
    image: bannerOneImage,
    alt: "Greenrut product category banner",
    primaryLabel: "Shop Products",
    primaryPath: "/product",
  },
  {
    title: "100% Herbal: Scientifically Proven, Therapeutically Potent.",
    image: bannerTwoImage,
    alt: "Greenrut scientifically proven herbal products banner",
    primaryLabel: "Explore Our Products",
    secondaryPath: "/product",
    primaryPath: "/product",
  },
  {
    title: "Science-Backed Herbal Solutions.",
    image: bannerThreeImage,
    alt: "Greenrut research and clinical study banner",
    primaryLabel: "View Research",
    primaryPath: "/research",
  },
  {
    title: "The Greenrut Difference: Pure, Potent, Proven.",
    image: bannerFourImage,
    alt: "Greenrut pure potent proven banner",
    primaryLabel: "Learn More About Our Story",
    primaryPath: "/about-us",
  },
];

const productCategories = [
  {
    title: "SKIN & BODY CARE",
    text: "Anti-Aging care, beauty bars, moisturizers, hair oil, body oil, sunscreen, soaps, toners.",
    image: catSkinImg,
  },
  {
    title: "DAILY SUPPLEMENTS (Nutrition)",
    text: "Vitamins, Minerals, Stress reliever, Sleep, Focus, Energy, Performance.",
    image: catSupplementsImg,
  },
  {
    title: "IMMUNITY & METABOLISM",
    text: "Detoxifier, Anti-oxidants, Blood sugar, Digestion, Cholesterol, Circulation.",
    image: catImmunityImg,
  },
  {
    title: "TARGETED HEALTH",
    text: "Weight Management, Heart & Brain Health, Bone & Eye care, Diabetes, Respiratory health.",
    image: catTargetedImg,
  },
  {
    title: "MEN & WOMEN",
    text: "Fertility, Menopause, Prostate, Stamina, Hormonal balances, Menstrual comfort, libido.",
    image: catMenWomenImg,
  },
  {
    title: "HERBAL INSTANTS",
    text: "Herbal Drinks, Juice, Concentrated powders, tinctures, adaptogens for instant action.",
    image: catHerbalImg,
  },
];

function getPostSummary(post) {
  return post.excerpt || post.content || "A new blog post is ready.";
}

export function HomePage({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeHero, setActiveHero] = useState(0);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadHomeData() {
      try {
        setLoading(true);
        const [
          productsResponse,
          postsResponse,
          reviewsResponse,
          bannersResponse,
        ] = await Promise.all([
          publicRequest("/products"),
          publicRequest("/posts"),
          publicRequest("/reviews"),
          publicRequest("/banners").catch(() => ({ data: [] })),
        ]);
        if (cancelled) return;

        setProducts(productsResponse.data || []);
        setPosts(postsResponse.data || []);
        setReviews(reviewsResponse.data || []);
        const fetchedBanners = bannersResponse.data || [];
        setBanners(fetchedBanners.length > 0 ? fetchedBanners : heroSlides);
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || "Failed to load home content");
          setBanners(heroSlides);
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
    const slidesToUse = banners.length > 0 ? banners : heroSlides;
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % slidesToUse.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % reviews.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [reviews.length]);

  const bestsellers = products.length ? products.slice(0, 8) : fallbackProducts;
  const slidesToUse = banners.length > 0 ? banners : heroSlides;
  const heroSlide = slidesToUse[activeHero];

  return (
    <>
      <section className="home-hero home-hero--banner page-shell">
        <div className="home-hero__art home-hero__art--banner" style={{ position: "relative" }}>
          
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {slidesToUse.map((slide, index) => {
              const isActive = index === activeHero;
              const imgProps = getHeroImageProps(slide);
              return (
                <button
                  key={slide.id || slide.title || index}
                  type="button"
                  className={`home-hero__slide${isActive ? " is-active" : ""}`}
                  onClick={() => onNavigate?.(slide.primaryPath || "/product")}
                  aria-label={slide.title || slide.alt || "Open banner"}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    padding: 0,
                    background: "transparent",
                    cursor: "pointer",
                    opacity: isActive ? 1 : 0,
                    pointerEvents: isActive ? "auto" : "none",
                    transition: "opacity 0.80s cubic-bezier(0.215, 0.61, 0.355, 1)",
                    zIndex: isActive ? 2 : 1,
                  }}
                >
                  <img
                    src={imgProps.src}
                    srcSet={imgProps.srcSet}
                    sizes={imgProps.sizes}
                    alt={slide.alt || slide.title || "Greenrut banner"}
                    className="home-hero__image"
                    loading={index === 0 ? "eager" : "lazy"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                      background: "#f4faf2",
                    }}
                  />
                </button>
              );
            })}
          </div>

          <div className="home-hero__dots" aria-label="Hero slides" style={{ zIndex: 10 }}>
            {slidesToUse.map((slide, index) => (
              <button
                key={slide.id || slide.title || index}
                type="button"
                className={index === activeHero ? "is-active" : ""}
                aria-label={`Show slide ${index + 1}`}
                aria-pressed={index === activeHero}
                onClick={() => setActiveHero(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="page-shell">
          <div className="reveal-on-scroll reveal-slide-up">
            <SectionTitle title="Our Bestsellers" />
          </div>
          {loading ? <p>Loading products...</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!loading && !error && bestsellers.length === 0 ? (
            <p>No products yet.</p>
          ) : null}
          <div className="product-grid product-grid--home">
            {bestsellers.map((product, index) => {
              const delayClass = `reveal-delay-${(index % 4) * 100}`;
              return (
                <div
                  key={product.id || product.name}
                  className={`reveal-on-scroll reveal-slide-up ${delayClass}`}
                >
                  <button
                    type="button"
                    className="text-left"
                    style={{ width: "100%", border: 0, padding: 0, background: "none" }}
                    onClick={() =>
                      onNavigate?.(`/product-details?id=${product.id}`)
                    }
                  >
                    <ProductCard {...mapProduct(product, index)} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-promo-band reveal-on-scroll reveal-fade-in">
        <div className="home-promo-quote">
          <span className="sprout" aria-hidden="true" />
          <p>
            Pure herbal blends made for calm routines, steady energy, and
            everyday wellness.
          </p>
          <strong>GREENRUT WELLNESS</strong>
          <small>Customer</small>
        </div>
      </section>

      <section className="home-category-section page-shell">
        <div className="reveal-on-scroll reveal-slide-up">
          <SectionTitle title="Our Comprehensive Range of Herbal Innovations" />
        </div>
        <p className="home-category-section__intro reveal-on-scroll reveal-slide-up reveal-delay-100">
          Every Greenrut category is shaped by scientific validation,
          transparent formulation, and a commitment to safe natural living.
        </p>
        <div className="home-category-grid">
          {productCategories.map((category, index) => {
            const delayClass = `reveal-delay-${(index % 3) * 100}`;
            return (
              <div
                key={category.title}
                className={`reveal-on-scroll reveal-slide-up ${delayClass}`}
                style={{ display: "flex", flex: 1 }}
              >
                <button
                  type="button"
                  className="home-category-card"
                  style={{ width: "100%", height: "100%" }}
                  onClick={() =>
                    onNavigate?.(
                      `/product?category=${encodeURIComponent(category.title)}`,
                    )
                  }
                >
                  <div className="home-category-card__image">
                    <img
                      src={getCategoryImageProps(category.image).src}
                      srcSet={getCategoryImageProps(category.image).srcSet}
                      sizes={getCategoryImageProps(category.image).sizes}
                      alt={category.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="home-category-card__body">
                    <h3>{category.title}</h3>
                    <p>{category.text}</p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="page-shell blog-grid">
        <div className="reveal-on-scroll reveal-slide-up">
          <SectionTitle title="From the Blog" />
        </div>
        {!loading && !error && posts.length === 0 ? (
          <p>No blog posts yet.</p>
        ) : null}
        <div className="blog-grid__list">
          {posts.slice(0, 3).map((post, index) => {
            const delayClass = `reveal-delay-${index * 150}`;
            return (
              <article
                key={post.id || post.slug || post.title}
                className={`blog-card reveal-on-scroll reveal-slide-up ${delayClass}`}
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
            );
          })}
        </div>
      </section>

      <section className="reviews-section page-shell reveal-on-scroll reveal-slide-up">
        <SectionTitle title="What Customers Say" />
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="reviews-carousel">
            <div className="reviews-carousel__track">
              {reviews.map((review, index) => (
                <article
                  key={review.id || review.name}
                  className={`review-card reviews-carousel__slide${index === activeReview ? " is-active" : ""}`}
                  aria-hidden={index !== activeReview}
                >
                  <div
                    className="review-card__stars"
                    aria-label={`${review.rating || 5} out of 5 stars`}
                  >
                    {"★".repeat(Number(review.rating || 5))}
                    {"☆".repeat(5 - Number(review.rating || 5))}
                  </div>
                  <p>{review.quote}</p>
                  <div>
                    <h3>{review.name}</h3>
                    <span>{review.role || "Customer"}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="reviews-carousel__dots" aria-label="Review slides">
              {reviews.map((review, index) => (
                <button
                  key={review.id || review.name}
                  type="button"
                  className={`reviews-carousel__dot${index === activeReview ? " is-active" : ""}`}
                  aria-label={`Go to review ${index + 1}`}
                  aria-pressed={index === activeReview}
                  onClick={() => setActiveReview(index)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <NewsletterBand />
    </>
  );
}
