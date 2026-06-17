import { useEffect, useState } from "react";
import { navItems } from "../data.js";

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6h15l-2 8H8L6 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M6 6 5 3H2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="9" cy="19" r="1.4" fill="currentColor" />
      <circle cx="17" cy="19" r="1.4" fill="currentColor" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6 18 18M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeroBanner({ title, breadcrumb, subtle, backgroundPhoto }) {
  const backdropStyle = backgroundPhoto
    ? {
        backgroundImage: `url('${backgroundPhoto}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};
  return (
    <section className="hero-banner !min-h-[200px] xs:!min-h-[240px] sm:!min-h-[280px] lg:!min-h-[300px]">
      <div
        className="hero-banner__backdrop"
        aria-hidden="true"
        style={backdropStyle}
      >
        <div className="hero-banner__mug" />
        <div className="hero-banner__leaf hero-banner__leaf--left" />
        <div className="hero-banner__leaf hero-banner__leaf--right" />
      </div>
      <div className="hero-banner__content !w-full !px-3 xs:!px-4 sm:!px-6">
        {subtle ? <p className="eyebrow">{subtle}</p> : null}
        <h1>{title}</h1>
        <p>{breadcrumb}</p>
      </div>
    </section>
  );
}

export function ProductArt({ tone }) {
  return (
    <div className={`product-art product-art--${tone}`} aria-hidden="true" />
  );
}

function getImageUrl(image) {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object') return image.url || image.src || image.secureUrl || image.path || ''
  return ''
}

export function ProductCard({ name, price, badge, tone, image, images }) {
  const imageUrl = getImageUrl(image) || getImageUrl(Array.isArray(images) ? images[0] : null)
  return (
    <article className="product-card">
      <div className="product-card__visual">
        {badge ? <span className="badge">{badge}</span> : null}
        {imageUrl ? <img src={imageUrl} alt={name} /> : <ProductArt tone={tone} />}
      </div>
      <h3>{name}</h3>
      <p>{price}</p>
    </article>
  );
}

export function SiteHeader({ pathname, onNavigate }) {
  const active = (href) => pathname === href;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="page-shell site-header__inner">
        <button className="brand" type="button" onClick={() => onNavigate("/")}>
          <img src="/logo.png" alt="Greenrut" />
        </button>

        <button
          className="site-header__toggle"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <IconClose /> : <IconMenu />}
        </button>

        <nav
          id="primary-navigation"
          className={`site-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={active(item.href) ? "is-active" : ""}
              onClick={(event) => {
                if (item.href.startsWith("/#")) {
                  setMenuOpen(false);
                  return;
                }
                event.preventDefault();
                setMenuOpen(false);
                onNavigate(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
          <a href="/#research" className="site-nav__muted">
            NGN <IconChevronDown />
          </a>
          <button
            className="icon-button"
            type="button"
            aria-label="Cart"
            onClick={() => onNavigate("/cart")}
          >
            <IconCart />
          </button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="site-footer__grid !grid !grid-cols-1 lg:!grid-cols-[1.2fr_2.2fr] !gap-6 xs:!gap-8">
          <div className="site-footer__brand">
            <img src="/logo.png" alt="Greenrut" />
            <p>
              A clean storefront experience for the Greenrut brand, with
              reusable components for product, cart, contact, and account pages.
            </p>
          </div>
          <div className="site-footer__columns !grid !grid-cols-1 xs:!grid-cols-2 xl:!grid-cols-4 !gap-4 xs:!gap-5">
            <div>
              <h2>My Account</h2>
              <ul>
                <li>My Account</li>
                <li>Order History</li>
                <li>WishList</li>
                <li>Newsletter</li>
                <li>International Orders</li>
              </ul>
            </div>
            <div>
              <h2>Information</h2>
              <ul>
                <li>About Us</li>
                <li>Delivery Information</li>
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Return Policy</li>
              </ul>
            </div>
            <div>
              <h2>Follow Us:</h2>
              <ul>
                <li>Youtube</li>
                <li>Instagram</li>
                <li>X</li>
                <li>WhatsApp</li>
                <li>LinkedIn</li>
                <li>Tiktok</li>
              </ul>
            </div>
            <div>
              <h2>Contact Us</h2>
              <ul>
                <li>Your address goes here</li>
                <li>0123456789</li>
                <li>demo@example.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="site-footer__copy">
        © 2026 Greenrut - All Rights Reserved
      </div>
    </footer>
  );
}

export function SiteFrame({ pathname, onNavigate, children }) {
  return (
    <div className="site-frame">
      <SiteHeader pathname={pathname} onNavigate={onNavigate} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
