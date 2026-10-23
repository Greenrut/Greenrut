import { useState, useEffect } from "react";
import { clearAdminAuth, getAdminAuth } from "../../lib/auth.js";

const adminNav = [
  { section: "OVERVIEW" },
  { label: "Dashboard", href: "/admin", icon: "dashboard" },

  { section: "CATALOG & STORE" },
  { label: "Orders", href: "/admin/orders", icon: "orders" },
  { label: "Products", href: "/admin/products", icon: "products" },
  { label: "Categories", href: "/admin/categories", icon: "categories" },
  { label: "Tags", href: "/admin/tags", icon: "tags" },

  { section: "CONTENT & CMS" },
  { label: "Hero Banners", href: "/admin/banners", icon: "banners" },
  { label: "Self-Care Articles", href: "/admin/blog/new", icon: "blog" },
  { label: "Scientific Research", href: "/admin/research/new", icon: "research" },
  { label: "Herbal Library", href: "/admin/library/new", icon: "library" },
  { label: "Customer Reviews", href: "/admin/reviews", icon: "reviews" },

  { section: "SYSTEM & ACCESS" },
  { label: "Users & Staff", href: "/admin/users", icon: "users" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

function Icon({ type }) {
  if (type === "dashboard") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    );
  }

  if (type === "orders") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    );
  }

  if (type === "products") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-1.78 0L2.83 5.92A1.78 1.78 0 0 0 2 7.45v9.1a1.78 1.78 0 0 0 .95 1.56l7.94 4.54a1.78 1.78 0 0 0 1.78 0l8.4-4.8a1.78 1.78 0 0 0 .93-1.56V7.45a1.78 1.78 0 0 0-.93-1.55l-2.07-1.18" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    );
  }

  if (type === "categories") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </svg>
    );
  }

  if (type === "tags") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    );
  }

  if (type === "banners") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <circle cx="8" cy="10" r="1.5" />
        <path d="m21 15-5-5-8 8" />
      </svg>
    );
  }

  if (type === "blog") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <path d="M6 6h10M6 10h10M6 14h6" />
      </svg>
    );
  }

  if (type === "research") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2v7.31M14 2v7.31M8.5 2h7M6 18a6 6 0 0 0 12 0l-1.5-8.69H7.5L6 18Z" />
      </svg>
    );
  }

  if (type === "library") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m16 6 4 14M12 6v14M8 6v14M4 6v14M4 4h16" />
      </svg>
    );
  }

  if (type === "reviews") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  if (type === "settings") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }

  if (type === "external") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    );
  }

  if (type === "lock") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    );
  }

  if (type === "menu") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    );
  }

  if (type === "close") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }

  if (type === "search") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    );
  }

  if (type === "bell") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    );
  }

  if (type === "plus") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    );
  }

  if (type === "pencil") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </svg>
    );
  }

  if (type === "trash") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    );
  }

  if (type === "arrow-left") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

export function AdminShell({ pathname, onNavigate, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const auth = getAdminAuth();
    if (auth?.user) {
      setAdminUser(auth.user);
    }
  }, []);

  // Close mobile menu upon navigation
  useEffect(() => {
    setMobileOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    if (href === "/admin/products") {
      return pathname.startsWith("/admin/products");
    }
    if (href === "/admin/banners") {
      return pathname.startsWith("/admin/banners");
    }
    if (href === "/admin/blog/new") {
      return pathname.startsWith("/admin/blog");
    }
    if (href === "/admin/research/new") {
      return pathname.startsWith("/admin/research");
    }
    if (href === "/admin/library/new") {
      return pathname.startsWith("/admin/library");
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    clearAdminAuth();
    onNavigate("/admin/login");
  };

  const adminName = adminUser?.name || "Administrator";
  const adminEmail = adminUser?.email || "admin@greenrut.com";
  const adminInitial = (adminName[0] || "A").toUpperCase();

  return (
    <div className="admin-shell">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? "is-mobile-open" : ""}`}>
        <div className="admin-sidebar__header">
          <button
            type="button"
            className="admin-brand"
            onClick={() => onNavigate("/admin")}
            title="Greenrut Admin Home"
          >
            <img src="/logo.png" alt="Greenrut" className="admin-brand__logo" />
            <div className="admin-brand__badge">
              <span className="admin-brand__status-dot" />
              <span>CONTROL HUB</span>
            </div>
          </button>
          <button
            type="button"
            className="admin-sidebar__close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <Icon type="close" />
          </button>
        </div>

        <nav className="admin-nav" aria-label="Admin Navigation">
          {adminNav.map((item) =>
            item.section ? (
              <div key={item.section} className="admin-nav__section">
                <span>{item.section}</span>
              </div>
            ) : (
              <button
                key={item.label}
                type="button"
                className={`admin-nav__item ${isActive(item.href) ? "is-active" : ""}`}
                onClick={() => onNavigate(item.href)}
              >
                <span className="admin-nav__icon">
                  <Icon type={item.icon} />
                </span>
                <span className="admin-nav__label">{item.label}</span>
                {item.label === "Dashboard" && (
                  <span className="admin-nav__indicator" />
                )}
              </button>
            )
          )}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            type="button"
            className="admin-footer-btn admin-footer-btn--store"
            onClick={() => window.open("/", "_blank")}
            title="Preview customer-facing website"
          >
            <Icon type="external" />
            <span>View Live Store</span>
          </button>

          <div className="admin-profile-card">
            <div className="admin-profile-card__avatar">{adminInitial}</div>
            <div className="admin-profile-card__info">
              <strong className="admin-profile-card__name" title={adminName}>
                {adminName}
              </strong>
              <span className="admin-profile-card__role">Administrator</span>
            </div>
            <button
              type="button"
              className="admin-profile-card__logout"
              onClick={handleLogout}
              title="Sign Out"
            >
              <Icon type="lock" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              <Icon type="menu" />
            </button>
            <div className="admin-topbar__system-badge">
              <span className="admin-topbar__pulse-dot" />
              <span>Production Live</span>
            </div>
          </div>

          <div className="admin-topbar__right">
            <button
              type="button"
              className="admin-quick-add-btn"
              onClick={() => onNavigate("/admin/products/new")}
            >
              <Icon type="plus" />
              <span>New Product</span>
            </button>

            <div className="admin-user-menu-wrapper">
              <button
                type="button"
                className="admin-user-pill"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-expanded={userDropdownOpen}
              >
                <span className="admin-user-pill__avatar">{adminInitial}</span>
                <span className="admin-user-pill__name">{adminName}</span>
                <span className="admin-user-pill__role-tag">Admin</span>
              </button>

              {userDropdownOpen && (
                <div className="admin-user-dropdown">
                  <div className="admin-user-dropdown__header">
                    <strong>{adminName}</strong>
                    <span>{adminEmail}</span>
                  </div>
                  <div className="admin-user-dropdown__divider" />
                  <button
                    type="button"
                    className="admin-user-dropdown__item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate("/admin/settings");
                    }}
                  >
                    <Icon type="settings" />
                    <span>Account Settings</span>
                  </button>
                  <button
                    type="button"
                    className="admin-user-dropdown__item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      window.open("/", "_blank");
                    }}
                  >
                    <Icon type="external" />
                    <span>View Storefront</span>
                  </button>
                  <div className="admin-user-dropdown__divider" />
                  <button
                    type="button"
                    className="admin-user-dropdown__item admin-user-dropdown__item--danger"
                    onClick={handleLogout}
                  >
                    <Icon type="lock" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  subtitle,
  actions,
  backLabel,
  onBack,
  tag,
}) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header__meta">
        {backLabel && (
          <button
            type="button"
            className="admin-back-button"
            onClick={onBack}
          >
            <Icon type="arrow-left" />
            <span>{backLabel}</span>
          </button>
        )}
        <div className="admin-page-header__title-row">
          <h1>{title}</h1>
          {tag && <span className="admin-page-header__tag">{tag}</span>}
        </div>
        {subtitle && <p className="admin-page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div className="admin-page-header__actions">{actions}</div>
      )}
    </div>
  );
}

export function AdminCard({
  title,
  subtitle,
  actions,
  children,
  className = "",
}) {
  return (
    <section className={`admin-card ${className}`.trim()}>
      {(title || subtitle || actions) && (
        <div className="admin-card__header">
          <div>
            {title && <h2 className="admin-card__title">{title}</h2>}
            {subtitle && <p className="admin-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="admin-card__actions">{actions}</div>}
        </div>
      )}
      <div className="admin-card__body">{children}</div>
    </section>
  );
}

export function AdminPill({ tone = "green", children }) {
  return <span className={`admin-pill admin-pill--${tone}`}>{children}</span>;
}

export function AdminStatCard({
  iconTone = "green",
  title,
  value,
  description,
  badge,
  onClick,
}) {
  return (
    <div
      className={`admin-stat-card ${onClick ? "is-clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="admin-stat-card__top">
        <div className={`admin-stat-card__icon admin-stat-card__icon--${iconTone}`}>
          <Icon
            type={
              iconTone === "green"
                ? "products"
                : iconTone === "blue"
                  ? "blog"
                  : iconTone === "purple"
                    ? "users"
                    : "dashboard"
            }
          />
        </div>
        {badge && <span className="admin-stat-card__badge">{badge}</span>}
      </div>
      <div className="admin-stat-card__details">
        <span className="admin-stat-card__title">{title}</span>
        <strong className="admin-stat-card__value">{value}</strong>
        {description && (
          <p className="admin-stat-card__description">{description}</p>
        )}
      </div>
    </div>
  );
}

export function AdminTable({ columns, rows, rowRenderer, emptyMessage = "No records found." }) {
  return (
    <div className="admin-table-container">
      <div className="admin-table">
        <div className="admin-table__head">
          {columns.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
        <div className="admin-table__body">
          {rows.length === 0 ? (
            <div className="admin-table__empty">{emptyMessage}</div>
          ) : (
            rows.map(rowRenderer)
          )}
        </div>
      </div>
    </div>
  );
}

export { Icon as AdminIcon };
