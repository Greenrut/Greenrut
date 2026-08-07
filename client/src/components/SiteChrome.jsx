import { useEffect, useState } from "react";
import { getCartCount } from "../lib/cart.js";
import { getImageSource } from "../lib/image.js";
import { navItems, socialLinks } from "../data.js";

function SocialIcon({ icon }) {
  if (icon === "facebook")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  if (icon === "x")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  if (icon === "linkedin")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  if (icon === "tiktok")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z" />
      </svg>
    );
  if (icon === "youtube")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
          fill="white"
        />
      </svg>
    );
  if (icon === "instagram")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" fill="white" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
      </svg>
    );
  return null;
}

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
      ></div>
      <div className="hero-banner__content !w-full !px-3 xs:!px-4 sm:!px-6">
        {subtle ? <p className="eyebrow">{subtle}</p> : null}
        <h1>{title}</h1>
        {breadcrumb ? (
          <p className="mt-2 text-[11px] xs:text-[12px] text-white/75">
            {breadcrumb}
          </p>
        ) : null}
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
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object")
    return image.url || image.src || image.secureUrl || image.path || "";
  return "";
}

export function ProductCard({ name, price, badge, tone, image, images }) {
  const imageUrl = getImageSource(
    getImageUrl(image) || getImageUrl(Array.isArray(images) ? images[0] : null),
    { width: 520 },
  );
  return (
    <article className="product-card">
      <div className="product-card__visual">
        {badge ? <span className="badge">{badge}</span> : null}
        {imageUrl ? (
          <img src={imageUrl} alt={name} loading="lazy" />
        ) : (
          <div
            className="product-card__empty"
            aria-label={`${name} has no image`}
          />
        )}
      </div>
      <h3>{name}</h3>
      <p>{price}</p>
    </article>
  );
}

export function SiteHeader({ pathname, onNavigate }) {
  const active = (href) => pathname === href;
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(() => getCartCount());

  useEffect(() => {
    const onCartChanged = () => setCartCount(getCartCount());
    window.addEventListener("cart-changed", onCartChanged);
    return () => window.removeEventListener("cart-changed", onCartChanged);
  }, []);

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
            className="icon-button cart-icon-button"
            type="button"
            aria-label={`Cart (${cartCount} items)`}
            onClick={() => onNavigate("/cart")}
          >
            <IconCart />
            {cartCount > 0 && (
              <span className="cart-badge" aria-hidden="true">
                {cartCount}
              </span>
            )}
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
              Greenrut is a modern, research based herbal medicine company,
              specializing in phototherapy, natural medicines, food supplements
              and personal care products.
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
              <div className="site-footer__socials">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="site-footer__social-link"
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h2>Contact Us</h2>
              <ul>
                {/* <li>Your address goes here</li> */}
                <li>0123456789</li>
                <li>demo@example.com</li>
                <li>
                  Pharmaco-Vigilance: To report any adverse events related to
                  products manufactured by Greenrut Laboratories, please contact
                  us by phone or email complaints@greenrut.com. Indicate the
                  batch number of the product.
                </li>
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
